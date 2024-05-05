import { Message } from "@/types/message"
import React, { Dispatch, SetStateAction, createContext } from "react"

interface DialoqContext {
  messages: Message[]
  setMessages: Dispatch<SetStateAction<Message[]>>

  controller: AbortController | null
  setController: Dispatch<SetStateAction<AbortController>>

  embeddingController: AbortController | null
  setEmbeddingController: Dispatch<SetStateAction<AbortController>>
}

export const DialoqContext = createContext<DialoqContext>({
  messages: [],
  setMessages: () => {},

  controller: null,
  setController: () => {},

  embeddingController: null,
  setEmbeddingController: () => {}
})

export const useDialoq = () => {
  const context = React.useContext(DialoqContext)
  if (!context) {
    throw new Error("useDialoq must be used within a DialoqProvider")
  }
  return context
}
