import { saveHistory, saveMessage } from "@/db"
import { ChatHistory } from "@/store/option"

export const saveMessageOnError = async (
    { e,
        history,
        setHistory,
        image,
        userMessage,
        botMessage,
        historyId,
        selectedModel,
        setHistoryId,
        isRegenerating
    }: {
        e: any,
        setHistory: (history: ChatHistory) => void,
        history: ChatHistory,
        userMessage: string,
        image: string
        botMessage: string,
        historyId: string | null,
        selectedModel: string,
        setHistoryId: (historyId: string) => void,
        isRegenerating: boolean
    }
) => {
    if (e?.name === "AbortError" || e?.message === "AbortError") {
        setHistory([
            ...history,
            {
                role: "user",
                content: userMessage,
                image
            },
            {
                role: "assistant",
                content: botMessage,
            }
        ])

        if (historyId) {
            if (!isRegenerating) {
                await saveMessage(historyId, selectedModel, "user", userMessage, [image])
            }
            await saveMessage(historyId, selectedModel, "assistant", botMessage, [])
        } else {
            const newHistoryId = await saveHistory(userMessage)
            if (!isRegenerating) {
                await saveMessage(newHistoryId.id, selectedModel, "user", userMessage, [
                    image
                ])
            }
            await saveMessage(
                newHistoryId.id,
                selectedModel,
                "assistant",
                botMessage,
                []
            )
            setHistoryId(newHistoryId.id)
        }

        return true
    }

    return false
}