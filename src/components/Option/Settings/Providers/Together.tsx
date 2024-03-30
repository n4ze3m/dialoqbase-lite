import { SaveButton } from "@/components/Common/SaveButton"
import { DEFAULT_TOGETHER_MODELS } from "@/config/together"
import { upsertModels } from "@/db/model"
import { upsertProvider } from "@/db/provider"
import { isValidTogetherApiKey } from "@/validate/together"
import { useMutation } from "@tanstack/react-query"
import { App, Form, Input } from "antd"
import { useTranslation } from "react-i18next"

type Props = {
  apiKey: string
}

export const ConifgTogether = ({ apiKey }: Props) => {
  const { t } = useTranslation("modelProvider")
  const { message } = App.useApp()
  const [form] = Form.useForm()
  const { mutate: validateApiKey, isPending } = useMutation({
    mutationFn: isValidTogetherApiKey,
    onSuccess: async () => {
      await upsertProvider({
        apiKey: form.getFieldValue("apiKey"),
        key: "together",
        name: "together"
      })
      await upsertModels(DEFAULT_TOGETHER_MODELS)
      message.success(t("together.apiKey.valid"))
    },
    onError: () => {
      message.error(t("together.apiKey.invalid"))
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
        label={t("together.apiKey.label")}
        help={t("together.apiKey.help")}>
        <Input.Password
          placeholder={t("together.apiKey.placeholder")}
          size="large"
        />
      </Form.Item>
      <div className="flex justify-end">
        <SaveButton loading={isPending} btnType="submit" />
      </div>
    </Form>
  )
}
