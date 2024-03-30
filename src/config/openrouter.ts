import { ModelConfig } from "@/types/models"

export const DEFAULT_OPENROUTER_MODELS: ModelConfig[] = [
  {
    model_id: "mistralai/mistral-7b-instruct:free-dialoq",
    name: "Mistral 7B Instruct (free)",
    fucntion_call: false,
    provider: "openrouter"
  },
  {
    model_id: "nousresearch/nous-capybara-7b:free-dialoq",
    name: "Nous Capybara 7B (free)",
    fucntion_call: true,
    provider: "openrouter"
  }
]
