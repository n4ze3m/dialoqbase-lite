import { Storage } from "@plasmohq/storage"

const storage = new Storage()

const DEFAULT_ASK_FOR_MODEL_SELECTION_EVERY_TIME = true
const DEFAULT_PAGE_SHARE_URL = "https://pageassist.xyz"

const DEFAULT_RAG_QUESTION_PROMPT =
  "Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.   Chat History: {chat_history} Follow Up Input: {question} Standalone question:"

const DEFAULT_RAG_SYSTEM_PROMPT = `You are a helpful AI assistant. Use the following pieces of context to answer the question at the end. If you don't know the answer, just say you don't know. DO NOT try to make up an answer. If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.  

Context:

{context}

-------------------

Question: {question} 

Helpful answer:`

const DEFAULT_WEBSEARCH_PROMP = `You are a helpful assistant that can answer any questions. You can use the following search results in case you want to answer questions about anything in real-time. The current date and time are {current_date_time}.  

Search results: 

{search_results}`

export const askForModelSelectionEveryTime = async () => {
  const askForModelSelectionEveryTime = await storage.get(
    "askForModelSelectionEveryTime"
  )
  if (
    !askForModelSelectionEveryTime ||
    askForModelSelectionEveryTime.length === 0
  )
    return DEFAULT_ASK_FOR_MODEL_SELECTION_EVERY_TIME
  return askForModelSelectionEveryTime
}

export const defaultModel = async () => {
  const defaultModel = await storage.get("defaultModel")
  return defaultModel
}

export const systemPromptForNonRag = async () => {
  const prompt = await storage.get("systemPromptForNonRag")
  return prompt
}

export const promptForRag = async () => {
  const prompt = await storage.get("systemPromptForRag")
  const questionPrompt = await storage.get("questionPromptForRag")

  let ragPrompt = prompt
  let ragQuestionPrompt = questionPrompt

  if (!ragPrompt || ragPrompt.length === 0) {
    ragPrompt = DEFAULT_RAG_SYSTEM_PROMPT
  }

  if (!ragQuestionPrompt || ragQuestionPrompt.length === 0) {
    ragQuestionPrompt = DEFAULT_RAG_QUESTION_PROMPT
  }

  return {
    ragPrompt,
    ragQuestionPrompt
  }
}

export const setSystemPromptForNonRag = async (prompt: string) => {
  await storage.set("systemPromptForNonRag", prompt)
}

export const setPromptForRag = async (
  prompt: string,
  questionPrompt: string
) => {
  await storage.set("systemPromptForRag", prompt)
  await storage.set("questionPromptForRag", questionPrompt)
}

export const systemPromptForNonRagOption = async () => {
  const prompt = await storage.get("systemPromptForNonRagOption")
  return prompt
}

export const setSystemPromptForNonRagOption = async (prompt: string) => {
  await storage.set("systemPromptForNonRagOption", prompt)
}

export const sendWhenEnter = async () => {
  const sendWhenEnter = await storage.get("sendWhenEnter")
  if (!sendWhenEnter || sendWhenEnter.length === 0) {
    return true
  }
  return sendWhenEnter === "true"
}

export const setSendWhenEnter = async (sendWhenEnter: boolean) => {
  await storage.set("sendWhenEnter", sendWhenEnter.toString())
}

export const defaultEmbeddingModelForRag = async () => {
  const embeddingMode = await storage.get("defaultEmbeddingModel")
  if (!embeddingMode || embeddingMode.length === 0) {
    return null
  }
  return embeddingMode
}

export const defaultEmbeddingChunkSize = async () => {
  const embeddingChunkSize = await storage.get("defaultEmbeddingChunkSize")
  if (!embeddingChunkSize || embeddingChunkSize.length === 0) {
    return 1000
  }
  return parseInt(embeddingChunkSize)
}

export const defaultEmbeddingChunkOverlap = async () => {
  const embeddingChunkOverlap = await storage.get(
    "defaultEmbeddingChunkOverlap"
  )
  if (!embeddingChunkOverlap || embeddingChunkOverlap.length === 0) {
    return 200
  }
  return parseInt(embeddingChunkOverlap)
}

export const setDefaultEmbeddingModelForRag = async (model: string) => {
  await storage.set("defaultEmbeddingModel", model)
}

export const setDefaultEmbeddingChunkSize = async (size: number) => {
  await storage.set("defaultEmbeddingChunkSize", size.toString())
}

export const setDefaultEmbeddingChunkOverlap = async (overlap: number) => {
  await storage.set("defaultEmbeddingChunkOverlap", overlap.toString())
}

export const saveForRag = async (
  model: string,
  chunkSize: number,
  overlap: number
) => {
  await setDefaultEmbeddingModelForRag(model)
  await setDefaultEmbeddingChunkSize(chunkSize)
  await setDefaultEmbeddingChunkOverlap(overlap)
}

export const getWebSearchPrompt = async () => {
  const prompt = await storage.get("webSearchPrompt")
  if (!prompt || prompt.length === 0) {
    return DEFAULT_WEBSEARCH_PROMP
  }
  return prompt
}

export const setWebSearchPrompt = async (prompt: string) => {
  await storage.set("webSearchPrompt", prompt)
}

export const geWebSearchFollowUpPrompt = async () => {
  const prompt = await storage.get("webSearchFollowUpPrompt")
  if (!prompt || prompt.length === 0) {
    return DEFAULT_RAG_QUESTION_PROMPT
  }
  return prompt
}

export const setWebSearchFollowUpPrompt = async (prompt: string) => {
  await storage.set("webSearchFollowUpPrompt", prompt)
}

export const setWebPrompts = async (prompt: string, followUpPrompt: string) => {
  await setWebSearchPrompt(prompt)
  await setWebSearchFollowUpPrompt(followUpPrompt)
}

export const getIsSimpleInternetSearch = async () => {
  const isSimpleInternetSearch = await storage.get("isSimpleInternetSearch")
  if (!isSimpleInternetSearch || isSimpleInternetSearch.length === 0) {
    return true
  }
  return isSimpleInternetSearch === "true"
}

export const setIsSimpleInternetSearch = async (
  isSimpleInternetSearch: boolean
) => {
  await storage.set("isSimpleInternetSearch", isSimpleInternetSearch.toString())
}

export const getPageShareUrl = async () => {
  const pageShareUrl = await storage.get("pageShareUrl")
  if (!pageShareUrl || pageShareUrl.length === 0) {
    return DEFAULT_PAGE_SHARE_URL
  }
  return pageShareUrl
}

export const setPageShareUrl = async (pageShareUrl: string) => {
  await storage.set("pageShareUrl", pageShareUrl)
}
