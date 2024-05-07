import { useMutation, useQuery } from "@tanstack/react-query"
import { Form, InputNumber, Select, Skeleton } from "antd"
import { SaveButton } from "~/components/Common/SaveButton"
import {
  defaultEmbeddingChunkOverlap,
  defaultEmbeddingChunkSize,
  defaultEmbeddingModelForRag,
  saveForRag
} from "@/services/dialoqbase"
import { SettingPrompt } from "./prompt"
import { useTranslation } from "react-i18next"
import { getAllModels } from "@/db/model"
import { ProviderIcons } from "@/components/Common/ProviderIcons"

export const DialoqbaseSettings = () => {
  const { t } = useTranslation("settings")

  const { data, status } = useQuery({
    queryKey: ["fetchConfig"],
    queryFn: async () => {
      const [allModels, chunkOverlap, chunkSize, defaultEM] = await Promise.all(
        [
          getAllModels({ type: "embedding" }),
          defaultEmbeddingChunkOverlap(),
          defaultEmbeddingChunkSize(),
          defaultEmbeddingModelForRag()
        ]
      )
      return {
        models: allModels,
        chunkOverlap,
        chunkSize,
        defaultEM
      }
    }
  })

  const { mutate: saveRAG, isPending: isSaveRAGPending } = useMutation({
    mutationFn: async (data: {
      model: string
      chunkSize: number
      overlap: number
    }) => {
      await saveForRag(data.model, data.chunkSize, data.overlap)
    }
  })

  return (
    <div className="flex flex-col space-y-3">
      {status === "pending" && <Skeleton paragraph={{ rows: 4 }} active />}
      {status === "success" && (
        <div className="flex flex-col space-y-6">
          <div>
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                {t("dialoqbaseSettings.settings.ragSettings.label")}
              </h2>
              <div className="border border-b border-gray-200 dark:border-gray-600 mt-3 mb-6"></div>
            </div>
            <Form
              layout="vertical"
              onFinish={(data) => {
                saveRAG({
                  model: data.defaultEM,
                  chunkSize: data.chunkSize,
                  overlap: data.chunkOverlap
                })
              }}
              initialValues={{
                chunkSize: data?.chunkSize,
                chunkOverlap: data?.chunkOverlap,
                defaultEM: data?.defaultEM
              }}>
              <Form.Item
                name="defaultEM"
                label={t("dialoqbaseSettings.settings.ragSettings.model.label")}
                rules={[
                  {
                    required: true,
                    message: t(
                      "dialoqbaseSettings.settings.ragSettings.model.required"
                    )
                  }
                ]}>
                <Select
                  size="large"
                  placeholder={t(
                    "dialoqbaseSettings.settings.ragSettings.model.placeholder"
                  )}
                  style={{ width: "100%" }}
                  className="mt-4"
                  filterOption={(input, option) =>
                    option.label.key
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  showSearch
                  options={data?.models?.map((model) => ({
                    label: (
                      <span
                        key={model.name}
                        className="flex flex-row gap-3 items-center">
                        <ProviderIcons
                          model={model.name}
                          provider={model.provider}
                        />
                        {model.name}
                      </span>
                    ),
                    value: model.model_id
                  }))}
                />
              </Form.Item>

              <Form.Item
                name="chunkSize"
                label={t(
                  "dialoqbaseSettings.settings.ragSettings.chunkSize.label"
                )}
                rules={[
                  {
                    required: true,
                    message: t(
                      "dialoqbaseSettings.settings.ragSettings.chunkSize.required"
                    )
                  }
                ]}>
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder={t(
                    "dialoqbaseSettings.settings.ragSettings.chunkSize.placeholder"
                  )}
                />
              </Form.Item>
              <Form.Item
                name="chunkOverlap"
                label={t(
                  "dialoqbaseSettings.settings.ragSettings.chunkOverlap.label"
                )}
                rules={[
                  {
                    required: true,
                    message: t(
                      "dialoqbaseSettings.settings.ragSettings.chunkOverlap.required"
                    )
                  }
                ]}>
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder={t(
                    "dialoqbaseSettings.settings.ragSettings.chunkOverlap.placeholder"
                  )}
                />
              </Form.Item>

              <div className="flex justify-end">
                <SaveButton disabled={isSaveRAGPending} btnType="submit" />
              </div>
            </Form>
          </div>

          <div>
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                {t("dialoqbaseSettings.settings.prompt.label")}
              </h2>
              <div className="border border-b border-gray-200 dark:border-gray-600 mt-3 mb-6"></div>
            </div>
            <SettingPrompt />
          </div>
        </div>
      )}
    </div>
  )
}
