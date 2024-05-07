import { ModelConfig } from "@/types/models"

export const DEFAULT_ANTHROPIC_MODELS: ModelConfig[] = [
  {
    model_id: "claude-3-opus-20240229-dialoq",
    name: "Claude 3 Opus",
    fucntion_call: false,
    provider: "anthropic",
    vision: true,
    type: "chat",
    context_size: 200_000
  },
  {
    model_id: "claude-3-sonnet-20240229-dialoq",
    name: "Claude 3 Sonnet",
    fucntion_call: false,
    provider: "anthropic",
    vision: true,
    type: "chat",
    context_size: 200_000
  },
  {
    model_id: "claude-3-haiku-20240307-dialoq",
    name: "Claude 3 Haiku",
    fucntion_call: false,
    provider: "anthropic",
    vision: true,
    type: "chat",
    context_size: 200_000
  }
]
