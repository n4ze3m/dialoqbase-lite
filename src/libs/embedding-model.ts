import { TogetherAIEmbeddings } from "@langchain/community/embeddings/togetherai"
import { FireworksEmbeddings } from "@langchain/community/embeddings/fireworks"
import { OpenAIEmbeddings } from "@langchain/openai"
import { chromeRunTime } from "./runtime"

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

export const dialoqEmbeddingModel = async ({
  config,
  modelName,
  provider
}: Props) => {
  modelName = modelName.replace("-dialoq", "")
  modelName = modelName.replace(/_dialoqbase_[0-9]+$/, "")

  switch (provider) {
    case "fireworks":
      await chromeRunTime("https://api.fireworks.ai")
      return new FireworksEmbeddings({
        modelName,
        apiKey: config.apiKey
      })
    case "openai":
      return new OpenAIEmbeddings({
        modelName,
        openAIApiKey: config.apiKey,
        configuration: {
          baseURL: config.baseUrl
        }
      })
    case "together":
      return new TogetherAIEmbeddings({
        modelName,
        apiKey: config.apiKey
      })
    default:
      return new OpenAIEmbeddings({
        modelName,
        openAIApiKey: config.apiKey,
        configuration: {
          baseURL: config.baseUrl
        }
      })
  }
}
