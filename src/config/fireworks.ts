import { ModelConfig } from "@/types/models"

export const DEFAULT_FIREWORKS_MODELS: ModelConfig[] = [
  {
    model_id: "accounts/fireworks/models/llama-v3-70b-instruct-dialoq",
    name: "Llama 3 70B",
    fucntion_call: true,
    provider: "fireworks",
    type: "chat",
    context_size: 8192
  },
  {
    model_id: "accounts/fireworks/models/mixtral-8x7b-instruct-dialoq",
    name: "Mixtral 8x7B",
    fucntion_call: true,
    provider: "fireworks",
    type: "chat",
    context_size: 32_768
  },
  {
    model_id: "accounts/fireworks/models/firellava-13b-dialoq",
    name: "Firellava 13B",
    fucntion_call: true,
    provider: "fireworks",
    vision: true,
    type: "chat",
    context_size: 4096
  },
  {
    model_id: "nomic-ai/nomic-embed-text-v1.5-dialoq",
    name: "Nomic Embed Text v1.5",
    fucntion_call: false,
    provider: "fireworks",
    type: "embedding"
  }
]
