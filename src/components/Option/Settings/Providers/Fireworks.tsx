import { SaveButton } from "@/components/Common/SaveButton"
import { DEFAULT_FIREWORKS_MODELS } from "@/config/fireworks"
import { upsertModels } from "@/db/model"
import { upsertProvider } from "@/db/provider"
import { isValidFireworksApiKey } from "@/validate/fireworks"
import { useMutation } from "@tanstack/react-query"
import { App, Form, Input } from "antd"
import { useTranslation } from "react-i18next"

type Props = {
  apiKey: string
}

export const ConifgFireworks = ({ apiKey }: Props) => {
  const { t } = useTranslation("modelProvider")
  const { message } = App.useApp()
  const [form] = Form.useForm()
  const { mutate: validateApiKey, isPending } = useMutation({
    mutationFn: isValidFireworksApiKey,
    onSuccess: async () => {
      await upsertProvider({
        apiKey: form.getFieldValue("apiKey"),
        key: "fireworks",
        name: "Fireworks"
      })
      await upsertModels(DEFAULT_FIREWORKS_MODELS)
      message.success(t("fireworks.apiKey.valid"))
    },
    onError: () => {
      message.error(t("fireworks.apiKey.invalid"))
    }
  })

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={async (values) => {
        validateApiKey(values.apiKey)
      }}
      initialValues={{
        apiKey
      }}>
      <Form.Item
        name="apiKey"
        label={t("fireworks.apiKey.label")}
        help={t("fireworks.apiKey.help")}>
        <Input.Password
          placeholder={t("fireworks.apiKey.placeholder")}
          size="large"
        />
      </Form.Item>
      <div className="flex justify-end">
        <SaveButton loading={isPending} btnType="submit" />
      </div>
    </Form>
  )
}
