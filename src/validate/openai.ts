import { cleanUrl } from "@/libs/clean-url"

export const isValidOpenAiApiKey = async ({
  apiKey,
  baseUrl
}: {
  baseUrl: string
  apiKey: string
}) => {
  const response = await fetch(`${cleanUrl(baseUrl)}/models`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`
    }
  })
  if (!response.ok) {
    throw new Error("Invalid API key")
  }
  return true
}
