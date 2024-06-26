import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  Skeleton,
  Table,
  Tooltip,
  notification,
  Modal,
  Input,
  Select,
  Form,
  message,
  Switch,
  Radio
} from "antd"
import { useState } from "react"
import { Trash2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import { deleteModel, getAllModels, saveModel } from "@/db/model"
import { getConfiguredProviders } from "@/db/provider"
import { isValidEmbeddingModel, isValidModel } from "@/validate/custom"
import { useStorage } from "@plasmohq/storage/hook"

export const ModelsBody = () => {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [openEmbedding, setOpenEmbedding] = useState(false)

  const { t } = useTranslation(["manageModels", "common"])
  const [selectedModel, setSelectedModel] = useStorage("selectedModel")
  const [modelType, setModelType] = useState<"llm" | "embedding">("llm")

  const [chatForm] = Form.useForm()
  const [embeddingForm] = Form.useForm()

  const { data, status } = useQuery({
    queryKey: ["fetchAllModels"],
    queryFn: async () => {
      const models = await getAllModels({})
      const embeddingModels = await getAllModels({
        type: "embedding"
      })
      const providers = await getConfiguredProviders()
      return {
        models,
        providers,
        embeddingModels
      }
    }
  })

  const { mutate: deleteChatModel } = useMutation({
    mutationFn: deleteModel,
    onSuccess: (model_id) => {
      if (selectedModel?.model_id === model_id) {
        setSelectedModel(null)
      }
      queryClient.invalidateQueries({
        queryKey: ["fetchAllModels"]
      })
      queryClient.invalidateQueries({
        queryKey: ["fetchModel"]
      })
      notification.success({
        message: t("notification.success"),
        description: t("notification.successDeleteDescription")
      })
    },
    onError: (error) => {
      notification.error({
        message: "Error",
        description: error?.message || t("notification.someError")
      })
    }
  })

  const { mutate: saveNewModel, isPending: isSaving } = useMutation({
    mutationFn: isValidModel,
    onSuccess: async (data) => {
      await saveModel({
        fucntion_call: false,
        model_id: data.model_id,
        name: data.name,
        provider: data.provider,
        type: "chat",
        vision: data.vision
      })
      queryClient.invalidateQueries({
        queryKey: ["fetchAllModels"]
      })

      queryClient.invalidateQueries({
        queryKey: ["fetchModel"]
      })
      message.success(t("notification.success"))
      setOpen(false)
      chatForm.resetFields()
    },
    onError: (error) => {
      message.error(error?.message || t("notification.someError"))
    }
  })
  const { mutate: saveNewEmbeddingModel, isPending: isSavingEmbedding } =
    useMutation({
      mutationFn: isValidEmbeddingModel,
      onSuccess: async (data) => {
        await saveModel({
          fucntion_call: false,
          model_id: data.model_id,
          name: data.name,
          provider: data.provider,
          type: "embedding"
        })
        queryClient.invalidateQueries({
          queryKey: ["fetchAllModels"]
        })

        queryClient.invalidateQueries({
          queryKey: ["fetchModel"]
        })
        message.success(t("notification.success"))
        setOpenEmbedding(false)
        embeddingForm.resetFields()
      },
      onError: (error) => {
        message.error(error?.message || t("notification.someError"))
      }
    })

  return (
    <div>
      <div>
        {/* Add new model button */}
        <div className="mb-6">
          <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-end sm:flex-nowrap">
            <div className="ml-4 mt-2 flex-shrink-0">
              {modelType === "llm" ? (
                <button
                  onClick={() => setOpen(true)}
                  className="inline-flex items-center rounded-md border border-transparent bg-black px-2 py-2 text-md font-medium leading-4 text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-white dark:text-gray-800 dark:hover:bg-gray-100 dark:focus:ring-gray-500 dark:focus:ring-offset-gray-100 disabled:opacity-50">
                  {t("addChatModel")}
                </button>
              ) : (
                <button
                  onClick={() => setOpenEmbedding(true)}
                  className="inline-flex items-center rounded-md border border-transparent bg-black px-2 py-2 text-md font-medium leading-4 text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-white dark:text-gray-800 dark:hover:bg-gray-100 dark:focus:ring-gray-500 dark:focus:ring-offset-gray-100 disabled:opacity-50">
                  {t("addEmbeddingModel")}
                </button>
              )}
            </div>
          </div>
        </div>

        {status === "pending" && <Skeleton paragraph={{ rows: 8 }} />}

        {status === "success" && (
          <div>
            <div className="my-3 justify-end flex">
              <Radio.Group
                value={modelType}
                onChange={(e) => setModelType(e.target.value)}>
                <Radio.Button value="llm">Chat Model</Radio.Button>
                <Radio.Button value="embedding">Embedding Model</Radio.Button>
              </Radio.Group>
            </div>
            {modelType === "llm" && (
              <Table
                columns={[
                  {
                    title: t("columns.name"),
                    dataIndex: "name",
                    key: "name"
                  },
                  {
                    title: t("columns.model_id"),
                    dataIndex: "model_id",
                    key: "model_id",
                    render: (model_id) =>
                      model_id
                        .replace("-dialoq", "")
                        .replace(/_dialoqbase_[0-9]+$/, "")
                  },
                  {
                    title: t("columns.provider"),
                    dataIndex: "provider"
                  },
                  {
                    title: t("columns.actions"),
                    render: (_, record) => (
                      <div className="flex gap-4">
                        <Tooltip title={t("tooltip.delete")}>
                          <button
                            onClick={() => {
                              if (window.confirm(t("confirm.delete"))) {
                                deleteChatModel(record.model_id)
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
                dataSource={data.models}
              />
            )}

            {modelType === "embedding" && (
              <Table
                columns={[
                  {
                    title: t("columns.name"),
                    dataIndex: "name",
                    key: "name"
                  },
                  {
                    title: t("columns.model_id"),
                    dataIndex: "model_id",
                    key: "model_id",
                    render: (model_id) =>
                      model_id
                        .replace("-dialoq", "")
                        .replace(/_dialoqbase_[0-9]+$/, "")
                  },
                  {
                    title: t("columns.provider"),
                    dataIndex: "provider"
                  },
                  {
                    title: t("columns.actions"),
                    render: (_, record) => (
                      <div className="flex gap-4">
                        <Tooltip title={t("tooltip.delete")}>
                          <button
                            onClick={() => {
                              if (window.confirm(t("confirm.delete"))) {
                                deleteChatModel(record.model_id)
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
                dataSource={data.embeddingModels}
              />
            )}
          </div>
        )}
      </div>

      <Modal
        footer={null}
        open={open}
        title={t("modal.title")}
        onCancel={() => setOpen(false)}>
        <Form
          layout="vertical"
          form={chatForm}
          onFinish={async (values) => {
            saveNewModel(values)
          }}>
          <Form.Item
            name="name"
            label={t("modal.form.name")}
            rules={[{ required: true, message: t("modal.form.nameError") }]}>
            <Input placeholder={t("modal.form.namePlaceholder")} size="large" />
          </Form.Item>

          <Form.Item
            name="model_id"
            label={t("modal.form.modelId")}
            rules={[{ required: true, message: t("modal.form.modelIdError") }]}>
            <Input
              placeholder={t("modal.form.modelIdPlaceholder")}
              size="large"
            />
          </Form.Item>

          <Form.Item name="vision" label={t("modal.form.vision")}>
            <Switch />
          </Form.Item>

          <Form.Item
            name="provider"
            label={t("modal.form.provider")}
            rules={[
              { required: true, message: t("modal.form.providerError") }
            ]}>
            <Select
              placeholder={t("modal.form.providerPlaceholder")}
              size="large"
              options={data?.providers || []}
            />
          </Form.Item>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex justify-center w-full text-center  items-center rounded-md border border-transparent bg-black px-2 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-white dark:text-gray-800 dark:hover:bg-gray-100 dark:focus:ring-gray-500 dark:focus:ring-offset-gray-100 disabled:opacity-50 ">
            {!isSaving ? t("modal.submit") : t("modal.submitting")}
          </button>
        </Form>
      </Modal>

      <Modal
        footer={null}
        open={openEmbedding}
        title={t("modal.titleEmbedding")}
        onCancel={() => setOpenEmbedding(false)}>
        <Form
          layout="vertical"
          form={embeddingForm}
          onFinish={async (values) => {
            saveNewEmbeddingModel(values)
          }}>
          <Form.Item
            name="name"
            label={t("modal.formEmbedding.name")}
            rules={[
              { required: true, message: t("modal.formEmbedding.nameError") }
            ]}>
            <Input
              placeholder={t("modal.formEmbedding.namePlaceholder")}
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="model_id"
            label={t("modal.formEmbedding.modelId")}
            rules={[
              { required: true, message: t("modal.formEmbedding.modelIdError") }
            ]}>
            <Input
              placeholder={t("modal.formEmbedding.modelIdPlaceholder")}
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="provider"
            label={t("modal.formEmbedding.provider")}
            rules={[
              {
                required: true,
                message: t("modal.formEmbedding.providerError")
              }
            ]}>
            <Select
              placeholder={t("modal.formEmbedding.providerPlaceholder")}
              size="large"
              options={data?.providers || []}
            />
          </Form.Item>

          <button
            type="submit"
            disabled={isSavingEmbedding}
            className="inline-flex justify-center w-full text-center  items-center rounded-md border border-transparent bg-black px-2 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-white dark:text-gray-800 dark:hover:bg-gray-100 dark:focus:ring-gray-500 dark:focus:ring-offset-gray-100 disabled:opacity-50 ">
            {!isSavingEmbedding ? t("modal.submit") : t("modal.submitting")}
          </button>
        </Form>
      </Modal>
    </div>
  )
}
