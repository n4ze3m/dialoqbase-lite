import { ChatGroq } from "@langchain/groq"

export const isValidGroqApiKey = async (apiKey: string) => {
  const chat = new ChatGroq({
    apiKey: apiKey,
    maxRetries:0,
  })

  const response = await chat.invoke("Hello, world!")

  if (!response) {
    throw new Error("Invalid API key")
  }

  return true
}
