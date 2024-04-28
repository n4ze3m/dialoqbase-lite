import { ChatFireworks } from "@langchain/community/chat_models/fireworks"
import { ChatOpenAI } from "@langchain/openai"
import { ChatAnthropic } from "@langchain/anthropic"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { ChatGroq } from "@langchain/groq"
import { chromeRunTime } from "./runtime"
import { openRouterModel } from "@/utils/open-router"
import { ChatTogetherAI } from "@langchain/community/chat_models/togetherai"

type Props = {
  provider: string
  modelName: string
  config: {
    apiKey: string
    baseUrl?: string
    headers?: Record<string, string>
    temperature?: number
  }
}

export const dialoqChatModel = async ({
  config,
  modelName,
  provider
}: Props) => {
  modelName = modelName.replace("-dialoq", "")
  switch (provider) {
    case "fireworks":
      await chromeRunTime("https://api.fireworks.ai")
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
          baseURL: config.baseUrl
        }
      })
    case "anthropic":
      return new ChatAnthropic({
        modelName,
        temperature: config.temperature,
        anthropicApiKey: config.apiKey,
        anthropicApiUrl: config.baseUrl
      })
    case "google":
      return new ChatGoogleGenerativeAI({
        modelName,
        apiKey: config.apiKey
      })
    case "groq":
      return new ChatGroq({
        modelName,
        apiKey: config.apiKey
      })
    case "openrouter":
      return await openRouterModel({
        apiKey: config.apiKey,
        modelName
      })
    case "together":
      return new ChatTogetherAI({
        modelName,
        togetherAIApiKey: config.apiKey
      })
    default:
      return new ChatOpenAI({
        modelName: modelName,
        openAIApiKey: config.apiKey,
        configuration: {
          baseURL: config.baseUrl,
          apiKey: config.apiKey
        }
      })
  }
}
