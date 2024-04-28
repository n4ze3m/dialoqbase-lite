import { ModelConfig } from "@/types/models"

export const DEFAULT_GROQ_MODELS: ModelConfig[] = [
  {
    model_id: "llama3-70b-8192-dialoq",
    name: "Llama 3 70B",
    fucntion_call: false,
    provider: "groq",
    type: "chat",
    context_size: 8192
  },
  {
    model_id: "mixtral-8x7b-32768-dialoq",
    name: "Mixtral 8x7B",
    fucntion_call: false,
    provider: "groq",
    type: "chat",
    context_size: 32_768
  },
  {
    model_id: "llama3-8b-8192-dialoq",
    name: "Llama 3 8B",
    fucntion_call: false,
    provider: "groq",
    type: "chat",
    context_size: 8192
  }
]
