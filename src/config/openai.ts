import { ModelConfig } from "@/types/models"

export const DEFAULT_OPENAI_MODELS: ModelConfig[] = [
  {
    model_id: "gpt-3.5-turbo-dialoq",
    name: "GPT-3.5 Turbo",
    fucntion_call: true,
    provider: "openai",
    type: "chat"
  },
  {
    model_id: "gpt-4-turbo-preview-dialoq",
    name: "GPT-4 Turbo Preview",
    fucntion_call: true,
    provider: "openai",
    type: "chat"
  },
  {
    model_id: "gpt-4-vision-preview-dialoq",
    name: "GPT-4 Vision Preview",
    fucntion_call: true,
    provider: "openai",
    vision: true,
    type: "chat"
  }
]
