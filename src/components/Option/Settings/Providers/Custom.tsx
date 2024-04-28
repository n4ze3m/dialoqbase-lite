import { SaveButton } from "@/components/Common/SaveButton"
import { AiProvider, deleteProvider, upsertProvider } from "@/db/provider"
import { useStorage } from "@plasmohq/storage/hook"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { App, Form, Input } from "antd"
import { Trash2 } from "lucide-react"
import { useTranslation } from "react-i18next"

type Props = {
  provider: AiProvider
}

export const ConfigCustomProvider = ({ provider }: Props) => {
  const { t } = useTranslation("modelProvider")
  const [selectedModel, setSelectedModel] = useStorage("selectedModel")
  const client = useQueryClient()

  const { message } = App.useApp()
  const [form] = Form.useForm()
  const { mutate: validateApiKey, isPending } = useMutation({
    mutationFn: async (values: { apiKey: string; baseUrl: string }) => {
      await upsertProvider({
        ...provider,
        apiKey: values.apiKey,
        baseUrl: values.baseUrl
      })
      return "Ok"
    },
    onSuccess: async () => {
      message.success(t("custom.apiKey.valid"))
    },
    onError: () => {
      message.error(t("custom.apiKey.invalid"))
    }
  })

  const { mutate: mutateDeleteProvider, isPending: isDeletePending } =
    useMutation({
      mutationFn: deleteProvider,
      onSuccess: async () => {
        if (provider?.key === selectedModel?.provider) {
          setSelectedModel(null)
        }
        client.invalidateQueries({
          queryKey: ["fetchModel"]
        })
        client.invalidateQueries({
          queryKey: ["fetchModels"]
        })
        client.invalidateQueries({
          queryKey: ["fetchProviders"]
        })
        message.success(t("delete.success"))
      },
      onError: () => {
        message.error(t("delete.error"))
      }
    })
  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={async (values) => {
        validateApiKey(values)
      }}
      initialValues={{
        apiKey: provider?.apiKey,
        baseUrl: provider?.baseUrl
      }}>
      <Form.Item name="baseUrl" label={t("custom.baseUrl.label")}>
        <Input
          type="url"
          placeholder={t("custom.baseUrl.placeholder")}
          size="large"
        />
      </Form.Item>
      <Form.Item
        name="apiKey"
        label={t("custom.apiKey.label")}
        help={t("custom.apiKey.help")}>
        <Input.Password
          placeholder={t("custom.apiKey.placeholder")}
          size="large"
        />
      </Form.Item>
      <div className="flex justify-end gap-3">
        <button
          type="button"
          disabled={isDeletePending}
          onClick={() => {
            if (window.confirm(t("delete.confirm"))) {
              mutateDeleteProvider(provider.key)
            }
          }}
          className={`inline-flex mt-4 items-center rounded-md border border-transparent bg-red-500 px-2 py-2 text-sm font-medium leading-4 text-white shadow-sm dark:bg-red-600 disabled:opacity-50`}>
          <Trash2 className="h-4 w-4 mr-2" />
          {!isDeletePending ? t("delete") : t("deleting")}
        </button>
        <SaveButton loading={isPending} btnType="submit" />
      </div>
    </Form>
  )
}
