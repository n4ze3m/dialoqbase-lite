import { getProviderByKey } from "@/db/provider"
import { dialoqEmbeddingModel } from "@/libs/embedding-model"
import { dialoqChatModel } from "@/libs/model"

export const isValidModel = async ({
  name,
  model_id,
  provider,
  vision
}: {
  model_id: string
  provider: string
  name: string
  vision: boolean
}) => {
  const providerInfo = await getProviderByKey(provider)
  console.log(providerInfo, "providerInfo")
  console.log(model_id, "model_id")
  console.log(name, "name")
  const chat = await dialoqChatModel({
    modelName: model_id?.trim(),
    provider: provider,
    config: providerInfo
  })

  const response = await chat.invoke("Hello, world!")

  if (!response) {
    throw new Error("Unable to validate model")
  }

  return {
    name,
    model_id,
    provider,
    vision
  }
}

export const isValidEmbeddingModel = async ({
  name,
  model_id,
  provider
}: {
  model_id: string
  provider: string
  name: string
}) => {
  const providerInfo = await getProviderByKey(provider)
  const embed = await dialoqEmbeddingModel({
    modelName: model_id?.trim(),
    provider: provider,
    config: providerInfo
  })

  const response = await embed.embedQuery("Hello, world!")

  if (!response) {
    throw new Error("Unable to validate model")
  }

  return {
    name,
    model_id,
    provider
  }
}
