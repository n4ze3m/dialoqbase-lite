import { ChatOpenAI } from "@langchain/openai"

export const openRouterModel = async ({
  modelName,
  apiKey,
  maxTokens,
  maxRetries
}: {
  modelName: string
  apiKey: string
  maxRetries?: number
  maxTokens?: number
}) => {
  return new ChatOpenAI({
    modelName: modelName,
    openAIApiKey: apiKey,
    maxTokens,
    maxRetries,
    configuration: {
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: apiKey,
      defaultHeaders: {
        "HTTP-Referer": "https://dialoqlite.n4ze3m.com/",
        "X-Title": "Dialoqlite"
      }
    }
  })
}
