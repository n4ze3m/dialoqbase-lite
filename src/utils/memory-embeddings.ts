import { PageAssistHtmlLoader } from "~/loader/html"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { MemoryVectorStore } from "langchain/vectorstores/memory"
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama"
import {
  defaultEmbeddingChunkOverlap,
  defaultEmbeddingChunkSize
} from "@/services/dialoqbase"
import { PageAssistPDFLoader } from "@/loader/pdf"
import { FireworksEmbeddings } from "@langchain/community/embeddings/fireworks"
import { OpenAIEmbeddings } from "@langchain/openai"
import { TogetherAIEmbeddings } from "@langchain/community/embeddings/togetherai"

export const getLoader = ({
  html,
  pdf,
  type,
  url
}: {
  url: string
  html: string
  type: string
  pdf: { content: string; page: number }[]
}) => {
  if (type === "pdf") {
    return new PageAssistPDFLoader({
      pdf,
      url
    })
  } else {
    return new PageAssistHtmlLoader({
      html,
      url
    })
  }
}

export const memoryEmbedding = async ({
  html,
  keepTrackOfEmbedding,
  embeddingModel,
  pdf,
  setIsEmbedding,
  setKeepTrackOfEmbedding,
  type,
  url
}: {
  url: string
  html: string
  type: string
  pdf: { content: string; page: number }[]
  keepTrackOfEmbedding: Record<string, MemoryVectorStore>
  embeddingModel: FireworksEmbeddings | OpenAIEmbeddings | TogetherAIEmbeddings
  setIsEmbedding: (value: boolean) => void
  setKeepTrackOfEmbedding: (value: Record<string, MemoryVectorStore>) => void
}) => {
  setIsEmbedding(true)

  const loader = getLoader({ html, pdf, type, url })
  const docs = await loader.load()
  const chunkSize = await defaultEmbeddingChunkSize()
  const chunkOverlap = await defaultEmbeddingChunkOverlap()
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize,
    chunkOverlap
  })

  const chunks = await textSplitter.splitDocuments(docs)

  const store = new MemoryVectorStore(embeddingModel)

  await store.addDocuments(chunks)
  setKeepTrackOfEmbedding({
    ...keepTrackOfEmbedding,
    [url]: store
  })
  setIsEmbedding(false)
  return store
}
