import { AVAILABLE_PROVIDERS } from "@/db/provider"
import { ChatFireworks } from "@langchain/community/chat_models/fireworks";
import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic"
import { chromeRunTime } from "./runtime";


type Props = {
    provider: typeof AVAILABLE_PROVIDERS[number],
    modelName: string
    config: {
        apiKey: string
        baseUrl?: string
        headers?: Record<string, string>
        temperature?: number
    }
}

export const dialoqChatModel = async ({ config, modelName, provider, }: Props) => {
    modelName = modelName.replace("-dialoq", "")
    switch (provider) {
        case "fireworks":
            await chromeRunTime('https://api.fireworks.ai')
            return new ChatFireworks({
                modelName,
                temperature: config.temperature,
                fireworksApiKey: config.apiKey
            })
        case "openai":
            return new ChatOpenAI({
                modelName,
                temperature: config.temperature,
                openAIApiKey: config.apiKey,
                configuration: {
                    baseURL: config.baseUrl,
                }
            })
        case "anthropic":
            return new ChatAnthropic({
                modelName,
                temperature: config.temperature,
                anthropicApiKey: config.apiKey,
                anthropicApiUrl: config.baseUrl,
            })
        default:
            throw new Error(`Provider ${provider} not supported`)
    }
}