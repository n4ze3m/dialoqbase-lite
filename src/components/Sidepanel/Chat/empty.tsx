import { ProviderIcons } from "@/components/Common/ProviderIcons"
import { getAllModels } from "@/db/model"
import { useQuery } from "@tanstack/react-query"
import { Select } from "antd"
import { RotateCcw } from "lucide-react"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useMessage } from "~/hooks/useMessage"

export const EmptySidePanel = () => {
  const { t } = useTranslation(["playground", "common"])
  const { data, status, refetch, isRefetching } = useQuery({
    queryKey: ["dialoqStatus"],
    queryFn: async () => {
      const models = await getAllModels({ type: "chat" })

      return {
        models
      }
    }
  })

  const { setSelectedModel, selectedModel, chatMode, setChatMode } =
    useMessage()

  return (
    <div className="mx-auto sm:max-w-md px-4 mt-10">
      <div className="rounded-lg justify-center items-center flex flex-col border dark:border-gray-700 p-8 bg-white dark:bg-[#262626] shadow-sm">
        {(status === "pending" || isRefetching) && (
          <div className="inline-flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
            <p className="dark:text-gray-400 text-gray-900">
              {t("dialoqState.searching")}
            </p>
          </div>
        )}
        {status === "success" && (
          <div className="mt-4">
            <Select
              value={selectedModel?.model_id}
              onChange={(e) => {
                const model = data?.models?.find(
                  (model) => model.model_id === e
                )
                setSelectedModel(model!)
              }}
              size="large"
              filterOption={(input, option) =>
                option.label.key.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              showSearch
              placeholder={t("common:selectAModel")}
              className="w-64 "
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

            <div className="mt-4">
              <div className="inline-flex items-center">
                <label
                  className="relative flex items-center p-3 rounded-full cursor-pointer"
                  htmlFor="check">
                  <input
                    type="checkbox"
                    checked={chatMode === "rag"}
                    onChange={(e) => {
                      setChatMode(e.target.checked ? "rag" : "normal")
                    }}
                    className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity"
                    id="check"
                  />
                  <span className="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100 ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      stroke="currentColor"
                      stroke-width="1">
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"></path>
                    </svg>
                  </span>
                </label>
                <label
                  className="mt-px font-light  cursor-pointer select-none text-gray-900 dark:text-gray-400"
                  htmlFor="check">
                  {t("common:chatWithCurrentPage")}
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
