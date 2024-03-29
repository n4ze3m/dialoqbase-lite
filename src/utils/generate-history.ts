import { Message } from "@/store"
import {
  HumanMessage,
  AIMessage,
  type MessageContent
} from "@langchain/core/messages"

export const generateHistory = (
  messages: {
    role: "user" | "assistant" | "system"
    content: string
    image?: string
  }[]
) => {
  let history = []
  for (const message of messages) {
    if (message.role === "user") {
      let content: MessageContent = message.content

      if (message.image && message.image.length > 0) {
        content = [
          {
            type: "image_url",
            image_url: message.image
          },
          {
            type: "text",
            text: message.content
          }
        ]
      }
      history.push(
        new HumanMessage({
          content: content
        })
      )
    } else if (message.role === "assistant") {
      history.push(
        new AIMessage({
          content: message.content
        })
      )
    }
  }
  return history
}

export const generateHistoryFromMessage = (messages: Message[]) => {
  let history = []
  for (const message of messages) {
    if (!message.isBot) {
      let content: MessageContent = message.message

      if (message.images && message.images.length > 0) {
        const images: MessageContent = message.images.map((image) => {
          return {
            type: "image_url",
            image_url: image
          }
        })
        content = [
          {
            type: "text",
            text: message.message
          },
          ...images
        ]
      }
      history.push(
        new HumanMessage({
          content: content
        })
      )
    } else {
      history.push(
        new AIMessage({
          content: message.message
        })
      )
    }
  }
  return history
}
