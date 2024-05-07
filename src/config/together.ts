import { ModelConfig } from "@/types/models"

export const DEFAULT_TOGETHER_MODELS: ModelConfig[] = [
  {
    model_id: "cognitivecomputations/dolphin-2.5-mixtral-8x7b-dialoq",
    name: "Dolphin 2.5 Mixtral 8x7B",
    fucntion_call: false,
    provider: "together",
    type: "chat",
    context_size: 32_768
  },
  {
    model_id: "databricks/dbrx-instruct-dialoq",
    name: "DBRX Instruct",
    fucntion_call: false,
    provider: "together",
    type: "chat",
    context_size: 32_768 
  },
  {
    model_id: "togethercomputer/m2-bert-80M-8k-retrieval",
    name: "togethercomputer M2 BERT 80M 8k",
    fucntion_call: false,
    provider: "together",
    type: "embedding",
    context_size: 8_000
  }
]
