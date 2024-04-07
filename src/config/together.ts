import { ModelConfig } from "@/types/models"

export const DEFAULT_TOGETHER_MODELS: ModelConfig[] = [
  {
    model_id: "mistralai/Mistral-7B-Instruct-v0.2-dialoq",
    name: "Mistral 7B Instruct v0.2",
    fucntion_call: false,
    provider: "together",
    type: "chat"
  },
  {
    model_id: "codellama/CodeLlama-70b-Python-hf-dialoq",
    name: "CodeLlama 70B Python",
    fucntion_call: false,
    provider: "together",
    type: "chat"
  }
]
