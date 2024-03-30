import { ChatGoogleGenerativeAI } from "@langchain/google-genai"

export const isValidGeminiApiKey = async (apiKey: string) => {
  const chat = new ChatGoogleGenerativeAI({
    apiKey: apiKey,
    maxOutputTokens: 10,
    maxRetries:0
  })

  const response = await chat.invoke("Hello, world!")

  if (!response) {
    throw new Error("Invalid API key")
  }

  return true
}
