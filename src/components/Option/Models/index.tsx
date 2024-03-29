import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Skeleton, Table, Tooltip, notification, Modal, Input } from "antd"
import { deleteModel } from "~/services/ollama"
import { useState } from "react"
import { useForm } from "@mantine/form"
import { Download, RotateCcw, Trash2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import { getAllModels } from "@/db/model"

export const ModelsBody = () => {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const { t } = useTranslation(["settings", "common"])

  const form = useForm({
    initialValues: {
      model: ""
    }
  })

  const { data, status } = useQuery({
    queryKey: ["fetchAllModels"],
    queryFn: async () => {
      const models = await getAllModels({})
      console.log(models)
      return models
    }
  })

  const { mutate: deleteOllamaModel } = useMutation({
    mutationFn: deleteModel,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fetchAllModels"]
      })
      notification.success({
        message: t("manageModels.notification.success"),
        description: t("manageModels.notification.successDeleteDescription")
      })
    },
    onError: (error) => {
      notification.error({
        message: "Error",
        description: error?.message || t("manageModels.notification.someError")
      })
    }
  })

  const pullModel = async (modelName: string) => {
    notification.info({
      message: t("manageModels.notification.pullModel"),
      description: t("manageModels.notification.pullModelDescription", {
        modelName
      })
    })

    setOpen(false)

    form.reset()

    chrome.runtime.sendMessage({
      type: "pull_model",
      modelName
    })

    return true
  }

  const { mutate: pullOllamaModel } = useMutation({
    mutationFn: pullModel
  })

  return (
    <div>
      <div>
        {/* Add new model button */}
        <div className="mb-6">
          <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-end sm:flex-nowrap">
            <div className="ml-4 mt-2 flex-shrink-0">
              <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center rounded-md border border-transparent bg-black px-2 py-2 text-md font-medium leading-4 text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-white dark:text-gray-800 dark:hover:bg-gray-100 dark:focus:ring-gray-500 dark:focus:ring-offset-gray-100 disabled:opacity-50">
                {t("manageModels.addBtn")}
              </button>
            </div>
          </div>
        </div>

        {status === "pending" && <Skeleton paragraph={{ rows: 8 }} />}

        {status === "success" && (
          <Table
            columns={[
              {
                title: t("manageModels.columns.name"),
                dataIndex: "name",
                key: "name"
              },
              {
                title: t("manageModels.columns.model_id"),
                dataIndex: "model_id",
                key: "model_id",
                render: (model_id) => model_id.replace("-dialoq", "")
              },
              {
                title: t("manageModels.columns.provider"),
                dataIndex: "provider"
              },
              {
                title: t("manageModels.columns.actions"),
                render: (_, record) => (
                  <div className="flex gap-4">
                    <Tooltip title={t("manageModels.tooltip.delete")}>
                      <button
                        onClick={() => {
                          if (
                            window.confirm(t("manageModels.confirm.delete"))
                          ) {
                            // deleteOllamaModel(record.model)
                          }
                        }}
                        className="text-red-500 dark:text-red-400">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </Tooltip>
                  </div>
                )
              }
            ]}
            bordered
            dataSource={data}
          />
        )}
      </div>

      <Modal
        footer={null}
        open={open}
        title={t("manageModels.modal.title")}
        onCancel={() => setOpen(false)}>
        <form
          onSubmit={form.onSubmit((values) => pullOllamaModel(values.model))}>
          <Input
            {...form.getInputProps("model")}
            placeholder={t("manageModels.modal.placeholder")}
            size="large"
          />

          <button
            type="submit"
            className="inline-flex justify-center w-full text-center mt-4 items-center rounded-md border border-transparent bg-black px-2 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-white dark:text-gray-800 dark:hover:bg-gray-100 dark:focus:ring-gray-500 dark:focus:ring-offset-gray-100 disabled:opacity-50 ">
            <Download className="w-5 h-5 mr-3" />
            {t("manageModels.modal.pull")}
          </button>
        </form>
      </Modal>
    </div>
  )
}
