export const isValidFireworksApiKey = async ({
  apiKey
}: {
  apiKey: string
}) => {
  const response = await fetch("https://api.fireworks.ai/inference/v1/models", {
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
