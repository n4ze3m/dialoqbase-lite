import { ChatGroq } from "@langchain/groq"

export const isValidGroqApiKey = async ({ apiKey }: { apiKey: string }) => {
  const chat = new ChatGroq({
    apiKey: apiKey,
    maxRetries: 0,
    modelName: "llama3-70b-8192"
  })

  const response = await chat.invoke("Hello, world!")

  if (!response) {
    throw new Error("Invalid API key")
  }

  return true
}
