import { SaveButton } from "@/components/Common/SaveButton"
import { DEFAULT_GOOGLE_GEMINI_MODELS } from "@/config/gemini"
import { upsertModels } from "@/db/model"
import { upsertProvider } from "@/db/provider"
import { isValidGeminiApiKey } from "@/validate/gemini"
import { useMutation } from "@tanstack/react-query"
import { App, Form, Input } from "antd"
import { useTranslation } from "react-i18next"

type Props = {
  apiKey: string
}

export const ConifgGemini = ({ apiKey }: Props) => {
  const { t } = useTranslation("modelProvider")
  const { message } = App.useApp()
  const [form] = Form.useForm()
  const { mutate: validateApiKey, isPending } = useMutation({
    mutationFn: isValidGeminiApiKey,
    onSuccess: async () => {
      await upsertProvider({
        apiKey: form.getFieldValue("apiKey"),
        key: "google",
        name: "google"
      })
      await upsertModels(DEFAULT_GOOGLE_GEMINI_MODELS)
      message.success(t("google.apiKey.valid"))
    },
    onError: () => {
      message.error(t("google.apiKey.invalid"))
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
        label={t("google.apiKey.label")}
        help={t("google.apiKey.help")}>
        <Input.Password
          placeholder={t("google.apiKey.placeholder")}
          size="large"
        />
      </Form.Item>
      <div className="flex justify-end">
        <SaveButton loading={isPending} btnType="submit" />
      </div>
    </Form>
  )
}
