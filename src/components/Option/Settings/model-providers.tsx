import { useQuery } from "@tanstack/react-query"
import { Collapse, Skeleton } from "antd"
import { useTranslation } from "react-i18next"
import { OpenAiIcon } from "@/components/Icons/OpenAI"
import { FireworksIcon } from "@/components/Icons/Fireworks"
import { ConifgFireworks } from "./Providers/Fireworks"
import { getAllProviders } from "@/db/provider"
import { ConfigOpenAI } from "./Providers/OpenAI"
import { AnthropicIcon } from "@/components/Icons/Anthropic"
import { ConfigAnthropic } from "./Providers/Anthropic"
import { GeminiIcon } from "@/components/Icons/Gemini"
import { ConifgGemini } from "./Providers/Gemini"
import { GroqIcon } from "@/components/Icons/Groq"
import { ConifgGroq } from "./Providers/Groq"
import { OpenRouterIcon } from "@/components/Icons/OpenRouter"
import { ConifgOpenRouter } from "./Providers/OpenRouter"
import { TogtherIcon } from "@/components/Icons/Togther"
import { ConifgTogether } from "./Providers/Together"
import { AddNewProvider } from "./Providers/AddProvider"
import { useState } from "react"
import { CpuIcon } from "lucide-react"
import { ConfigCustomProvider } from "./Providers/Custom"

export const SettingsModelProviders = () => {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation("modelProvider")
  const { data, status } = useQuery({
    queryKey: ["fetchProviders"],
    queryFn: getAllProviders
  })

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex flex-col space-y-6">
        <div>
          <div className="flex flex-row justify-between items-center">
            <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
              {t("heading")}
            </h2>
            <button
              onClick={() => setOpen(true)}
              className={`inline-flex mt-4 items-center rounded-md border border-transparent bg-black px-2 py-2 text-sm font-medium leading-4 text-white shadow-sm dark:bg-white dark:text-gray-800 disabled:opacity-50 `}>
              {t("customModelProvider")}
            </button>
          </div>
          <div className="border border-b border-gray-200 dark:border-gray-600 mt-3 mb-6"></div>
          {status === "pending" && <Skeleton paragraph={{ rows: 4 }} active />}
          {status === "success" && (
            <div className="flex flex-col space-y-6">
              <Collapse
                size="large"
                items={[
                  {
                    key: "1",
                    label: <OpenAiIcon className="dark:text-white h-7" />,
                    children: (
                      <ConfigOpenAI provider={data?.defaultProviders?.openai} />
                    )
                  }
                ]}
              />
              <Collapse
                size="large"
                items={[
                  {
                    key: "1",
                    label: <FireworksIcon className="dark:text-white! h-5" />,
                    children: (
                      <ConifgFireworks
                        provider={data?.defaultProviders?.fireworks}
                      />
                    )
                  }
                ]}
              />

              <Collapse
                size="large"
                items={[
                  {
                    key: "1",
                    label: <AnthropicIcon className="dark:text-white h-4" />,
                    children: (
                      <ConfigAnthropic
                        provider={data?.defaultProviders?.anthropic}
                      />
                    )
                  }
                ]}
              />

              <Collapse
                size="large"
                items={[
                  {
                    key: "1",
                    label: <GeminiIcon className="dark:text-white h-7" />,
                    children: (
                      <ConifgGemini provider={data?.defaultProviders?.google} />
                    )
                  }
                ]}
              />

              <Collapse
                size="large"
                items={[
                  {
                    key: "1",
                    label: (
                      <div className="inline-flex gap-2 items-center">
                        <OpenRouterIcon className="dark:text-white h-7" />
                        <span className="text-lg">OpenRouter</span>
                      </div>
                    ),
                    children: (
                      <ConifgOpenRouter
                        provider={data?.defaultProviders?.openrouter}
                      />
                    )
                  }
                ]}
              />

              <Collapse
                size="large"
                items={[
                  {
                    key: "1",
                    label: <TogtherIcon className="dark:text-white h-7" />,
                    children: (
                      <ConifgTogether
                        provider={data?.defaultProviders?.together}
                      />
                    )
                  }
                ]}
              />

              <Collapse
                size="large"
                items={[
                  {
                    key: "1",
                    label: <GroqIcon className="dark:text-white h-7" />,
                    children: (
                      <ConifgGroq provider={data?.defaultProviders?.groq} />
                    )
                  }
                ]}
              />

              {data?.thirdPartyProviders.map((provider, idx) => (
                <Collapse
                  key={idx}
                  size="large"
                  items={[
                    {
                      key: "1",
                      label: (
                        <div className="inline-flex gap-2 items-center">
                          <CpuIcon className="dark:text-white h-7" />
                          <span className="text-lg">{provider.name}</span>
                        </div>
                      ),
                      children: <ConfigCustomProvider provider={provider} />
                    }
                  ]}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <AddNewProvider open={open} setOpen={setOpen} />
    </div>
  )
}
