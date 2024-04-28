import { ModelConfig } from "@/types/models"

export const DEFAULT_GOOGLE_GEMINI_MODELS: ModelConfig[] = [
  {
    model_id: "gemini-pro-dialoq",
    name: "Gemini 1.0 Pro",
    fucntion_call: false,
    provider: "google",
    type: "chat",
    context_size: 32_000
  },
  {
    model_id: "gemini-pro-vision-dialoq",
    name: "Gemini 1.0 Pro Vision",
    fucntion_call: false,
    provider: "google",
    vision: true,
    type: "chat",
    context_size: 32_000
  },
  {
    model_id: "gemini-1.5-pro-latest-dialoq",
    name: "Gemini 1.5 Pro",
    fucntion_call: false,
    provider: "google",
    vision: true,
    type: "chat",
    context_size: 1_000_000
  },
]
