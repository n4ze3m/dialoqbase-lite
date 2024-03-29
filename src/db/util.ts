import { getModelById } from "./model"
import { getProviderByKey } from "./provider"

export const generateID = () => {
    return "pa_xxxx-xxxx-xxx-xxxx".replace(/[x]/g, () => {
      const r = Math.floor(Math.random() * 16)
      return r.toString(16)
    })
  }

  
  export const getModelInfo = async (model_id: string) => {
    console.log(model_id)
    const modeInfo = await getModelById(model_id)
    console.log(modeInfo)
    const provider = await getProviderByKey(modeInfo.provider)  
    return {
      ...modeInfo,
      model_provider: provider
    }
}