import React from "react"
import {
  geWebSearchFollowUpPrompt,
  systemPromptForNonRagOption
} from "@/services/dialoqbase"
import { type ChatHistory } from "~/store/option"
import { Message } from "@/types/message"
import { HumanMessage, SystemMessage } from "@langchain/core/messages"
import { useStoreMessageOption } from "~/store/option"
import {
  deleteChatForEdit,
  getPromptById,
  removeMessageUsingHistoryId,
  updateMessageByIndex
} from "@/db"
import { useNavigate } from "react-router-dom"
import { notification } from "antd"
import { getSystemPromptForWeb } from "~/web/web"
import { generateHistory } from "@/utils/generate-history"
import { useTranslation } from "react-i18next"
import { generateID, getModelInfo } from "@/db/util"
import { dialoqChatModel } from "@/libs/model"
import { useDialoq } from "@/context"
import { saveMessageOnError, saveMessageOnSuccess } from "./chat-helper"
import { useStorage } from "@plasmohq/storage/hook"

export const useMessageOption = () => {
  const {
    messages,
    setMessages,
    controller: abortController,
    setController: setAbortController
  } = useDialoq()
  const [selectedModel, setSelectedModel] = useStorage<{
    model_id: string
    name: string
    provider: string
  }>("selectedModel")

  const {
    history,
    setHistory,
    setStreaming,
    streaming,
    setIsFirstMessage,
    historyId,
    setHistoryId,
    isLoading,
    setIsLoading,
    isProcessing,
    setIsProcessing,
    chatMode,
    setChatMode,
    speechToTextLanguage,
    setSpeechToTextLanguage,
    webSearch,
    setWebSearch,
    isSearchingInternet,
    setIsSearchingInternet,
    selectedQuickPrompt,
    setSelectedQuickPrompt,
    selectedSystemPrompt,
    setSelectedSystemPrompt
  } = useStoreMessageOption()

  const { t } = useTranslation("option")
  const navigate = useNavigate()
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const clearChat = () => {
    navigate("/")
    setMessages([])
    setHistory([])
    setHistoryId(null)
    setIsFirstMessage(true)
    setIsLoading(false)
    setIsProcessing(false)
    setStreaming(false)
    textareaRef?.current?.focus()
  }

  const searchChatMode = async (
    message: string,
    image: string,
    isRegenerate: boolean,
    messages: Message[],
    history: ChatHistory,
    signal: AbortSignal
  ) => {
    if (image.length > 0) {
      image = `data:image/jpeg;base64,${image.split(",")[1]}`
    }

    const modelInfo = await getModelInfo(selectedModel.model_id)

    const chatModel = await dialoqChatModel({
      config: {
        apiKey: modelInfo.model_provider.apiKey,
        baseUrl: modelInfo.model_provider.baseUrl,
        headers: modelInfo.model_provider.headers
      },
      modelName: selectedModel.model_id,
      provider: modelInfo.model_provider.key as any
    })
    let newMessage: Message[] = []
    let generateMessageId = generateID()

    if (!isRegenerate) {
      newMessage = [
        ...messages,
        {
          isBot: false,
          name: "You",
          message,
          sources: [],
          images: [image]
        },
        {
          isBot: true,
          name: selectedModel.name,
          message: "▋",
          sources: [],
          id: generateMessageId
        }
      ]
    } else {
      newMessage = [
        ...messages,
        {
          isBot: true,
          name: selectedModel.name,
          message: "▋",
          sources: [],
          id: generateMessageId,
          model_id: selectedModel.model_id,
          model_provider: selectedModel.provider
        }
      ]
    }
    setMessages(newMessage)
    let fullText = ""
    let contentToSave = ""

    try {
      setIsSearchingInternet(true)

      let query = message

      if (newMessage.length > 2) {
        let questionPrompt = await geWebSearchFollowUpPrompt()
        const lastTenMessages = newMessage.slice(-10)
        lastTenMessages.pop()
        const chat_history = lastTenMessages
          .map((message) => {
            return `${message.isBot ? "Assistant: " : "Human: "}${message.message}`
          })
          .join("\n")
        const promptForQuestion = questionPrompt
          .replaceAll("{chat_history}", chat_history)
          .replaceAll("{question}", message)
        const questionModel = chatModel
        const response = await questionModel.invoke(promptForQuestion)
        query = response.content.toString()
      }

      const { prompt, source } = await getSystemPromptForWeb(query)
      setIsSearchingInternet(false)

      message = message.trim().replaceAll("\n", " ")

      let humanMessage = new HumanMessage({
        content: message
      })
      if (image.length > 0) {
        humanMessage = new HumanMessage({
          content: [
            {
              text: message,
              type: "text"
            },
            {
              image_url: image,
              type: "image_url"
            }
          ]
        })
      }

      const applicationChatHistory = generateHistory(history)

      if (prompt) {
        applicationChatHistory.unshift(
          new SystemMessage({
            content: prompt
          })
        )
      }

      const chunks = await chatModel.stream(
        [...applicationChatHistory, humanMessage],
        {
          signal: signal
        }
      )
      let count = 0
      for await (const chunk of chunks) {
        contentToSave += chunk.content
        fullText += chunk.content
        if (count === 0) {
          setIsProcessing(true)
        }
        setMessages((prev) => {
          return prev.map((message) => {
            if (message.id === generateMessageId) {
              return {
                ...message,
                message: fullText + " ▋"
              }
            }
            return message
          })
        })
        count++
      }
      // update the message with the full text
      setMessages((prev) => {
        return prev.map((message) => {
          if (message.id === generateMessageId) {
            return {
              ...message,
              message: fullText,
              sources: source
            }
          }
          return message
        })
      })

      setHistory([
        ...history,
        {
          role: "user",
          content: message,
          image
        },
        {
          role: "assistant",
          content: fullText
        }
      ])

      await saveMessageOnSuccess({
        historyId,
        setHistoryId,
        isRegenerate,
        selectedModel: selectedModel.name,
        message,
        image,
        fullText,
        source,
        model_provider: selectedModel.provider,
        model_id: selectedModel.model_id
      })

      setIsProcessing(false)
      setStreaming(false)
    } catch (e) {
      const errorSave = await saveMessageOnError({
        e,
        botMessage: fullText,
        history,
        historyId,
        image,
        selectedModel: selectedModel.name,
        setHistory,
        setHistoryId,
        userMessage: message,
        isRegenerating: isRegenerate,
        model_provider: selectedModel.provider,
        model_id: selectedModel.model_id
      })

      if (!errorSave) {
        let newMessages = messages
        if (newMessages.length > 0) {
          if (newMessages[newMessages.length - 1].isBot) {
            newMessages.pop()
          }
        }
        setMessages(newMessages)
        notification.error({
          message: t("error"),
          description: e?.message || t("somethingWentWrong")
        })
      }
      setIsProcessing(false)
      setStreaming(false)
    } finally {
      setAbortController(null)
    }
  }

  const normalChatMode = async (
    message: string,
    image: string,
    isRegenerate: boolean,
    messages: Message[],
    history: ChatHistory,
    signal: AbortSignal
  ) => {
    const modelInfo = await getModelInfo(selectedModel.model_id)

    const chatModel = await dialoqChatModel({
      config: {
        apiKey: modelInfo.model_provider.apiKey,
        baseUrl: modelInfo.model_provider.baseUrl,
        headers: modelInfo.model_provider.headers
      },
      modelName: selectedModel.model_id,
      provider: modelInfo.model_provider.key as any
    })

    if (image.length > 0) {
      if (modelInfo.provider === "google") {
        image = `data:image/png;base64,${image.split(",")[1]}`
      } else {
        image = `data:image/jpeg;base64,${image.split(",")[1]}`
      }
    }

    let newMessage: Message[] = []

    let generateMessageId = generateID()

    if (!isRegenerate) {
      newMessage = [
        ...messages,
        {
          isBot: false,
          name: "You",
          message,
          sources: [],
          images: [image]
        },
        {
          isBot: true,
          name: selectedModel.name,
          message: "▋",
          sources: [],
          id: generateMessageId,
          model_id: selectedModel.model_id,
          model_provider: selectedModel.provider
        }
      ]
    } else {
      newMessage = [
        ...messages,
        {
          isBot: true,
          name: selectedModel.name,
          message: "▋",
          sources: [],
          id: generateMessageId,
          model_id: selectedModel.model_id,
          model_provider: selectedModel.provider
        }
      ]
    }
    setMessages(newMessage)
    let fullText = ""
    let contentToSave = ""

    try {
      const prompt = await systemPromptForNonRagOption()
      const selectedPrompt = await getPromptById(selectedSystemPrompt)

      message = message.trim().replaceAll("\n", " ")

      let humanMessage = new HumanMessage({
        content: message
      })

      if (image.length > 0) {
        humanMessage = new HumanMessage({
          content: [
            {
              text: message,
              type: "text"
            },
            {
              image_url:
                modelInfo.provider !== "google"
                  ? {
                      url: image
                    }
                  : image,
              type: "image_url"
            }
          ]
        })
      }

      const applicationChatHistory = generateHistory(history)

      if (prompt && !selectedPrompt) {
        applicationChatHistory.unshift(
          new SystemMessage({
            content: prompt
          })
        )
      }

      if (selectedPrompt) {
        applicationChatHistory.unshift(
          new SystemMessage({
            content: selectedPrompt.content
          })
        )
      }

      const chunks = await chatModel.stream(
        [...applicationChatHistory, humanMessage],
        {
          signal: signal
        }
      )
      let count = 0

      for await (const chunk of chunks) {
        contentToSave += chunk.content
        fullText += chunk.content
        if (count === 0) {
          setIsProcessing(true)
        }
        setMessages((prev) => {
          return prev.map((message) => {
            if (message.id === generateMessageId) {
              return {
                ...message,
                message: fullText + " ▋"
              }
            }
            return message
          })
        })
        count++
      }

      setMessages((prev) => {
        return prev.map((message) => {
          if (message.id === generateMessageId) {
            return {
              ...message,
              message: fullText
            }
          }
          return message
        })
      })

      setHistory([
        ...history,
        {
          role: "user",
          content: message,
          image
        },
        {
          role: "assistant",
          content: fullText
        }
      ])

      await saveMessageOnSuccess({
        historyId,
        setHistoryId,
        isRegenerate,
        selectedModel: selectedModel.name,
        message,
        image,
        fullText,
        source: [],
        model_provider: selectedModel.provider,
        model_id: selectedModel.model_id
      })

      setIsProcessing(false)
      setStreaming(false)
    } catch (e) {
      const errorSave = await saveMessageOnError({
        e,
        botMessage: fullText,
        history,
        historyId,
        image,
        selectedModel: selectedModel.name,
        setHistory,
        setHistoryId,
        userMessage: message,
        isRegenerating: isRegenerate,
        model_provider: selectedModel.provider,
        model_id: selectedModel.model_id
      })

      if (!errorSave) {
        let newMessages = messages
        if (newMessages.length > 0) {
          if (newMessages[newMessages.length - 1].isBot) {
            newMessages.pop()
          }
        }
        setMessages(newMessages)
        notification.error({
          message: t("error"),
          description: e?.message || t("somethingWentWrong")
        })
      }
      setIsProcessing(false)
      setStreaming(false)
    } finally {
      setAbortController(null)
    }
  }

  const onSubmit = async ({
    message,
    image,
    isRegenerate = false,
    messages: chatHistory,
    memory,
    controller
  }: {
    message: string
    image: string
    isRegenerate?: boolean
    messages?: Message[]
    memory?: ChatHistory
    controller?: AbortController
  }) => {
    setStreaming(true)
    let signal: AbortSignal
    if (!controller) {
      const newController = new AbortController()
      signal = newController.signal
      setAbortController(newController)
    } else {
      setAbortController(controller)
      signal = controller.signal
    }

    if (webSearch) {
      await searchChatMode(
        message,
        image,
        isRegenerate,
        chatHistory || messages,
        memory || history,
        signal
      )
    } else {
      await normalChatMode(
        message,
        image,
        isRegenerate,
        chatHistory || messages,
        memory || history,
        signal
      )
    }
  }

  const regenerateLastMessage = async () => {
    const isOk = validateBeforeSubmit()

    if (!isOk) {
      return
    }
    if (history.length > 0) {
      const lastMessage = history[history.length - 2]
      let newHistory = history.slice(0, -2)
      let mewMessages = messages
      mewMessages.pop()
      setHistory(newHistory)
      setMessages(mewMessages)
      await removeMessageUsingHistoryId(historyId)
      if (lastMessage.role === "user") {
        const newController = new AbortController()
        await onSubmit({
          message: lastMessage.content,
          image: lastMessage.image || "",
          isRegenerate: true,
          memory: newHistory,
          controller: newController
        })
      }
    }
  }

  const stopStreamingRequest = () => {
    if (abortController) {
      abortController.abort()
      setAbortController(null)
    }
  }

  const validateBeforeSubmit = () => {
    if (!selectedModel || selectedModel?.model_id?.trim()?.length === 0) {
      notification.error({
        message: t("error"),
        description: t("validationSelectModel")
      })
      return false
    }

    return true
  }
  const editMessage = async (
    index: number,
    message: string,
    isHuman: boolean
  ) => {
    let newMessages = messages
    let newHistory = history

    if (isHuman) {
      const isOk = validateBeforeSubmit()

      if (!isOk) {
        return
      }

      const currentHumanMessage = newMessages[index]
      newMessages[index].message = message
      const previousMessages = newMessages.slice(0, index + 1)
      setMessages(previousMessages)
      const previousHistory = newHistory.slice(0, index)
      setHistory(previousHistory)
      await updateMessageByIndex(historyId, index, message)
      await deleteChatForEdit(historyId, index)
      const abortController = new AbortController()
      await onSubmit({
        message: message,
        image: currentHumanMessage.images[0] || "",
        isRegenerate: true,
        messages: previousMessages,
        memory: previousHistory,
        controller: abortController
      })
    } else {
      newMessages[index].message = message
      setMessages(newMessages)
      newHistory[index].content = message
      setHistory(newHistory)
      await updateMessageByIndex(historyId, index, message)
    }
  }

  return {
    editMessage,
    messages,
    setMessages,
    onSubmit,
    setStreaming,
    streaming,
    setHistory,
    historyId,
    setHistoryId,
    setIsFirstMessage,
    isLoading,
    setIsLoading,
    isProcessing,
    stopStreamingRequest,
    clearChat,
    selectedModel,
    setSelectedModel,
    chatMode,
    setChatMode,
    speechToTextLanguage,
    setSpeechToTextLanguage,
    regenerateLastMessage,
    webSearch,
    setWebSearch,
    isSearchingInternet,
    setIsSearchingInternet,
    selectedQuickPrompt,
    setSelectedQuickPrompt,
    selectedSystemPrompt,
    setSelectedSystemPrompt,
    textareaRef
  }
}
