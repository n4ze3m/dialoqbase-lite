import { BrainIcon } from "lucide-react"
import { TogtherMonoIcon } from "../Icons/TogtherMono"
import { OpenRouterIcon } from "../Icons/OpenRouter"
import { OpenAiMonoIcon } from "../Icons/OpenAIMono"
import { AnthropicMonoIcon } from "../Icons/AnthropicMono"
import { FireworksMonoIcon } from "../Icons/FireworksMono"
import { GeminiMonoIcon } from "../Icons/GeminiMono"
import { GroqMonoIcon } from "../Icons/GroqMono"

export const ProviderIcons = ({
  provider,
  model
}: {
  provider: string
  model: string
}) => {
  switch (provider) {
    case "openai":
      return <OpenAiMonoIcon className="w-5 h-5" />

    case "together":
      return <TogtherMonoIcon className="w-5 h-5" />

    case "anthropic":
      return <AnthropicMonoIcon className="w-5 h-5" />

    case "fireworks":
      return <FireworksMonoIcon className="w-5 h-5" />

    case "openrouter":
      return <OpenRouterIcon className="w-5 h-5" />

    case "google":
      return <GeminiMonoIcon className="w-5 h-5" />

    case "groq":
      return <GroqMonoIcon className="w-5 h-5" />

    default:
      return <BrainIcon className="w-5 h-5" />
  }
}
