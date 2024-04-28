import { Model, ModelConfig } from "@/types/models"

export class DialoqAiModel {
  db: chrome.storage.StorageArea

  constructor() {
    this.db = chrome.storage.local
  }

  async getModels(): Promise<Model[]> {
    return new Promise((resolve, reject) => {
      this.db.get("models", (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError)
        } else {
          resolve(result.models || [])
        }
      })
    })
  }

  async getModelById(model_id: string): Promise<Model | undefined> {
    const models = await this.getModels()
    return models.find((m) => m.model_id === model_id)
  }

  async setModels(models: Model[]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.set({ models }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError)
        } else {
          resolve()
        }
      })
    })
  }

  async setModelsOrIgnore(models: Model[]): Promise<void> {
    const existingModels = await this.getModels()
    const newModels = models.filter(
      (m) => !existingModels.some((em) => em.model_id === m.model_id)
    )
    return this.setModels([...existingModels, ...newModels])
  }

  async addModel(model: Model): Promise<void> {
    const models = await this.getModels()
    models.push(model)
    return this.setModels(models)
  }

  async updateModel(model_id: string, model: Model): Promise<void> {
    const models = await this.getModels()
    const index = models.findIndex((m) => m.model_id === model_id)
    models[index] = model
    return this.setModels(models)
  }

  async deleteModel(model_id: string): Promise<void> {
    const models = await this.getModels()
    const index = models.findIndex((m) => m.model_id === model_id)
    models.splice(index, 1)
    return this.setModels(models)
  }

  async toogleModel(model_id: string): Promise<void> {
    const models = await this.getModels()
    const index = models.findIndex((m) => m.model_id === model_id)
    models[index].hidden = !models[index].hidden
    return this.setModels(models)
  }

  async deleteModelByProvider(provider: string): Promise<void> {
    const models = await this.getModels()
    const updatedModels = models.filter((m) => m.provider !== provider)
    return this.setModels(updatedModels)
  }
}

export const getAllModels = async ({
  hidden,
  type = "chat"
}: {
  hidden?: boolean
  type?: string
}) => {
  const model = new DialoqAiModel()
  const models = await model.getModels()
  if (hidden === undefined) {
    return models.filter((m) => m.type === type)
  }
  return models
    .filter((m) => m.hidden === hidden)
    .filter((m) => m.type === type)
}

export const getModelById = async (model_id: string) => {
  const model = new DialoqAiModel()
  return model.getModelById(model_id)
}

export const upsertModels = async (models: ModelConfig[]) => {
  const model = new DialoqAiModel()
  return model.setModelsOrIgnore(
    models.map((m) => ({
      ...m,
      createdAt: new Date().toISOString(),
      hidden: false
    }))
  )
}

export const saveModel = async (model: ModelConfig) => {
  const modelDb = new DialoqAiModel()
  return modelDb.addModel({
    ...model,
    createdAt: new Date().toISOString(),
    hidden: false,
    model_id: model.model_id.trim() + `_dialoqbase_${new Date().getTime()}`
  })
}

export const deleteModel = async (model_id: string) => {
  const model = new DialoqAiModel()
  await model.deleteModel(model_id)
  return model_id
}

export const deleteModelByProvider = async (provider: string) => {
  const model = new DialoqAiModel()
  await model.deleteModelByProvider(provider)
  return provider
}
