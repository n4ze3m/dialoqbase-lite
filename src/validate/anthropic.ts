import { cleanUrl } from "@/libs/clean-url"
import { ChatAnthropic } from "@langchain/anthropic";


export const isValidAnthropicApiKey = async ({apiKey,baseUrl}:{baseUrl: string, apiKey: string}) => {
    const chat = new ChatAnthropic({
        anthropicApiKey: apiKey,
        anthropicApiUrl: cleanUrl(baseUrl),
        streaming: false,
        maxRetries: 0,
        maxTokens: 10,
    })

    const response = await chat.invoke("Hello, world!")

    if (!response) {
        throw new Error("Invalid API key")
    }

    return true
}