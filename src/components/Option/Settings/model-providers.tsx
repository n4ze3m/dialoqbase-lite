import { useMutation, useQuery } from "@tanstack/react-query"
import { Collapse, Form, InputNumber, Select, Skeleton } from "antd"
import { useState } from "react"
import { SaveButton } from "~/components/Common/SaveButton"
import { setOllamaURL as saveOllamaURL } from "~/services/ollama"
import { SettingPrompt } from "./prompt"
import { useTranslation } from "react-i18next"
import { OpenAiIcon } from "@/components/Icons/OpenAI"
import { FireworksIcon } from "@/components/Icons/Fireworks"
import { ConifgFireworks } from "./Providers/Fireworks"
import { getAllProviders } from "@/db/provider"
import { ConfigOpenAI } from "./Providers/OpenAI"
import { AnthropicIcon } from "@/components/Icons/Anthropic"
import { ConfigAnthropic } from "./Providers/Anthropic"

export const SettingsModelProviders = () => {
  const { t } = useTranslation("settings")
  const { data, status } = useQuery({
    queryKey: ["fetchProviders"],
    queryFn: getAllProviders
  })

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex flex-col space-y-6">
        <div>
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
              {t("modelProvider.heading")}
            </h2>
            <div className="border border-b border-gray-200 dark:border-gray-600 mt-3 mb-6"></div>
          </div>
          {status === "pending" && <Skeleton paragraph={{ rows: 4 }} active />}
          {status === "success" && (
            <div className="flex flex-col space-y-6">
              <Collapse
                size="large"
                defaultActiveKey={["1"]}
                items={[
                  {
                    key: "1",
                    label: <FireworksIcon className="dark:text-white! h-5" />,
                    children: (
                      <ConifgFireworks apiKey={data?.fireworks?.apiKey || ""} />
                    )
                  }
                ]}
              />
              <Collapse
                size="large"
                defaultActiveKey={["1"]}
                items={[
                  {
                    key: "1",
                    label: <OpenAiIcon className="dark:text-white h-7" />,
                    children: (
                      <ConfigOpenAI
                        baseUrl={
                          data?.openai?.baseUrl || "https://api.openai.com/v1"
                        }
                        apiKey={data?.openai?.apiKey || ""}
                      />
                    )
                  }
                ]}
              />

              <Collapse
                size="large"
                defaultActiveKey={["1"]}
                items={[
                  {
                    key: "1",
                    label: <AnthropicIcon className="dark:text-white h-5" />,
                    children: (
                      <ConfigAnthropic
                        baseUrl={
                          data?.anthropic?.baseUrl ||
                          "https://api.anthropic.com"
                        }
                        apiKey={data?.anthropic?.apiKey || ""}
                      />
                    )
                  }
                ]}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
