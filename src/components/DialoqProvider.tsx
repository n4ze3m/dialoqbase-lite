import { DialoqContext } from "@/context"
import { Message } from "@/types/message"
import React from "react"

export const DialoqProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = React.useState<Message[]>([])
  const [controller, setController] = React.useState<AbortController | null>(
    null
  )
  const [embeddingController, setEmbeddingController] =
    React.useState<AbortController | null>(null)

  return (
    <DialoqContext.Provider
      value={{
        messages,
        setMessages,

        controller,
        setController,

        embeddingController,
        setEmbeddingController
      }}>
      {children}
    </DialoqContext.Provider>
  )
}
