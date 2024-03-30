import { ModelConfig } from "@/types/models"

export const DEFAULT_GOOGLE_GEMINI_MODELS: ModelConfig[] = [
  {
    model_id: "gemini-pro-dialoq",
    name: "Gemini 1.0 Pro",
    fucntion_call: false,
    provider: "google"
  },
  {
    model_id: "gemini-pro-vision-dialoq",
    name: "Gemini 1.0 Pro Vision",
    fucntion_call: false,
    provider: "google",
    vision: true
  }
]
