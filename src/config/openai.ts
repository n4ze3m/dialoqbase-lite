import { ModelConfig } from "@/types/models"

export const DEFAULT_OPENAI_MODELS: ModelConfig[] = [
  {
    model_id: "gpt-3.5-turbo-dialoq",
    name: "GPT-3.5 Turbo",
    fucntion_call: true,
    provider: "openai",
    type: "chat",
    context_size: 16_385
  },
  {
    model_id: "gpt-4-turbo-preview-dialoq",
    name: "GPT-4 Turbo Preview",
    fucntion_call: true,
    provider: "openai",
    type: "chat",
    context_size: 128_000
  },
  {
    model_id: "gpt-4-vision-preview-dialoq",
    name: "GPT-4 Vision Preview",
    fucntion_call: true,
    provider: "openai",
    vision: true,
    type: "chat",
    context_size: 128_000
  },
  {
    model_id: "text-embedding-3-large-dialoq",
    name: "Text Embedding 3 Large",
    fucntion_call: false,
    provider: "openai",
    vision: false,
    type: "embedding"
  },
  {
    model_id: "text-embedding-3-small-dialoq",
    name: "Text Embedding 3 Small",
    fucntion_call: false,
    provider: "openai",
    vision: false,
    type: "embedding"
  },
  {
    model_id: "text-embedding-ada-002-dialoq",
    name: "Text Embedding Ada 002",
    fucntion_call: false,
    provider: "openai",
    vision: false,
    type: "embedding"
  }
]
