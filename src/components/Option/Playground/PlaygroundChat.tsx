import React from "react"
import { useMessageOption } from "~/hooks/useMessageOption"
import { PlaygroundEmpty } from "./PlaygroundEmpty"
import { PlaygroundMessage } from "~/components/Common/Playground/Message"
import { useScrollAnchor } from "@/hooks/use-scroll-anchor"

export const PlaygroundChat = () => {
  const {
    messages,
    streaming,
    regenerateLastMessage,
    isSearchingInternet,
    editMessage
  } = useMessageOption()
  const { messagesRef, scrollRef, visibilityRef } = useScrollAnchor()
  // const divRef = React.useRef<HTMLDivElement>(null)
  // React.useEffect(() => {
  //   if (divRef.current) {
  //     divRef.current.scrollIntoView({ behavior: "smooth" })
  //   }
  // })
  return (
    <div
      ref={scrollRef}
      className="grow flex flex-col md:translate-x-0 transition-transform duration-300 ease-in-out">
      <div ref={messagesRef}>
        {messages.length === 0 && (
          <div className="mt-32">
            <PlaygroundEmpty />
          </div>
        )}
        {/* {messages.length > 0 && <div className="w-full h-16 flex-shrink-0"></div>} */}
        {messages.map((message, index) => (
          <PlaygroundMessage
            key={index}
            isBot={message.isBot}
            message={message.message}
            name={message.name}
            images={message.images || []}
            currentMessageIndex={index}
            totalMessages={messages.length}
            onRengerate={regenerateLastMessage}
            isProcessing={streaming}
            isSearchingInternet={isSearchingInternet}
            sources={message.sources}
            onEditFormSubmit={(value) => {
              editMessage(index, value, !message.isBot)
            }}
          />
        ))}
        {messages.length > 0 && (
          <div className="w-full h-32 md:h-48 flex-shrink-0"></div>
        )}
        <div ref={visibilityRef} />
      </div>
    </div>
  )
}
