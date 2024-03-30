import { ChatTogetherAI } from "@langchain/community/chat_models/togetherai"

export const isValidTogetherApiKey = async ({ apiKey }: { apiKey: string }) => {
  const chat = new ChatTogetherAI({
    togetherAIApiKey: apiKey,
    maxTokens: 10,
    maxRetries: 0,
    modelName: "mistralai/Mistral-7B-Instruct-v0.2"
  })

  const response = await chat.invoke("Hello, world!")

  if (!response) {
    throw new Error("Invalid API key")
  }

  return true
}
