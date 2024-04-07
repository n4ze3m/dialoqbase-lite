import { ModelConfig } from "@/types/models"

export const DEFAULT_GROQ_MODELS: ModelConfig[] = [
  {
    model_id: "llama2-70b-4096-dialoq",
    name: "Llama 2 70B",
    fucntion_call: false,
    provider: "groq",
    type: "chat"
  },
  {
    model_id: "mixtral-8x7b-32768-dialoq",
    name: "Mixtral 8x7B",
    fucntion_call: false,
    provider: "groq",
    type: "chat"
  },
  {
    model_id: "gemma-7b-it-dialoq",
    name: "Gemma 7B",
    fucntion_call: false,
    provider: "groq",
    type: "chat"
  }
]
