import { SaveButton } from "@/components/Common/SaveButton"
import { DEFAULT_OPENROUTER_MODELS } from "@/config/openrouter"
import { upsertModels } from "@/db/model"
import { upsertProvider } from "@/db/provider"
import { isValidOpenRouterApiKey } from "@/validate/openrouter"
import { useMutation } from "@tanstack/react-query"
import { App, Form, Input } from "antd"
import { useTranslation } from "react-i18next"

type Props = {
  apiKey: string
}

export const ConifgOpenRouter = ({ apiKey }: Props) => {
  const { t } = useTranslation("modelProvider")
  const { message } = App.useApp()
  const [form] = Form.useForm()
  const { mutate: validateApiKey, isPending } = useMutation({
    mutationFn: isValidOpenRouterApiKey,
    onSuccess: async () => {
      await upsertProvider({
        apiKey: form.getFieldValue("apiKey"),
        key: "openrouter",
        name: "Openrouter"
      })
      await upsertModels(DEFAULT_OPENROUTER_MODELS)
      message.success(t("openrouter.apiKey.valid"))
    },
    onError: () => {
      message.error(t("openrouter.apiKey.invalid"))
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
        apiKey
      }}>
      <Form.Item
        name="apiKey"
        label={t("openrouter.apiKey.label")}
        help={t("openrouter.apiKey.help")}>
        <Input.Password
          placeholder={t("openrouter.apiKey.placeholder")}
          size="large"
        />
      </Form.Item>
      <div className="flex justify-end">
        <SaveButton loading={isPending} btnType="submit" />
      </div>
    </Form>
  )
}
