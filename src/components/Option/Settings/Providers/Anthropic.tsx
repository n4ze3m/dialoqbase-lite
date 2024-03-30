import { SaveButton } from "@/components/Common/SaveButton"
import { DEFAULT_ANTHROPIC_MODELS } from "@/config/anthropic"
import { upsertModels } from "@/db/model"
import { upsertProvider } from "@/db/provider"
import { cleanUrl } from "@/libs/clean-url"
import { isValidAnthropicApiKey } from "@/validate/anthropic"
import { useMutation } from "@tanstack/react-query"
import { App, Form, Input } from "antd"
import { useTranslation } from "react-i18next"

type Props = {
  apiKey: string
  baseUrl: string
}

export const ConfigAnthropic = ({ apiKey, baseUrl }: Props) => {
  const { t } = useTranslation("modelProvider")
  const { message } = App.useApp()
  const [form] = Form.useForm()
  const { mutate: validateApiKey, isPending } = useMutation({
    mutationFn: ({ apiKey, baseUrl }: { apiKey: string; baseUrl: string }) =>
      isValidAnthropicApiKey({ baseUrl, apiKey }),
    onSuccess: async () => {
      await upsertProvider({
        apiKey: form.getFieldValue("apiKey"),
        baseUrl: cleanUrl(form.getFieldValue("baseUrl")),
        key: "anthropic",
        name: "Anthropic"
      })
      await upsertModels(DEFAULT_ANTHROPIC_MODELS)
      message.success(t("anthropic.apiKey.valid"))
    },
    onError: () => {
      message.error(t("anthropic.apiKey.invalid"))
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
        apiKey,
        baseUrl
      }}>
      <Form.Item
        name="baseUrl"
        label={t("anthropic.baseUrl.label")}
        help={t("anthropic.baseUrl.help")}>
        <Input placeholder={t("anthropic.baseUrl.placeholder")} size="large" />
      </Form.Item>

      <Form.Item
        name="apiKey"
        label={t("anthropic.apiKey.label")}
        help={t("anthropic.apiKey.help")}>
        <Input.Password
          placeholder={t("anthropic.apiKey.placeholder")}
          size="large"
        />
      </Form.Item>
      <div className="flex justify-end">
        <SaveButton loading={isPending} btnType="submit" />
      </div>
    </Form>
  )
}
