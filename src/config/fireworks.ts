import { ModelConfig } from "@/types/models"

export const DEFAULT_FIREWORKS_MODELS: ModelConfig[] = [
  {
    model_id: "accounts/fireworks/models/llama-v2-70b-chat-dialoq",
    name: "Llama v2 70B",
    fucntion_call: true,
    provider: "fireworks"
  },
  {
    model_id: "accounts/fireworks/models/mixtral-8x7b-instruct-dialoq",
    name: "Mixtral 8x7B",
    fucntion_call: true,
    provider: "fireworks"
  },
  {
    model_id: "accounts/fireworks/models/firellava-13b-dialoq",
    name: "Firellava 13B",
    fucntion_call: true,
    provider: "fireworks",
    vision: true
  }
]
