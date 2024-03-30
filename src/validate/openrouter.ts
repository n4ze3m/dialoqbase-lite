import { openRouterModel } from "@/utils/open-router"

export const isValidOpenRouterApiKey = async ({apiKey}:{apiKey: string}) => {
  const chat =  await openRouterModel({
    apiKey: apiKey,
    maxTokens: 10,
    maxRetries:0,
    modelName: "mistralai/mistral-7b-instruct:free"
  })

  const response = await chat.invoke("Hello, world!")

  if (!response) {
    throw new Error("Invalid API key")
  }

  return true
}
