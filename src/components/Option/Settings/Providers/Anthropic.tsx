import { SaveButton } from "@/components/Common/SaveButton"
import { DEFAULT_ANTHROPIC_MODELS } from "@/config/anthropic"
import { upsertModels } from "@/db/model"
import { AiProvider, upsertProvider } from "@/db/provider"
import { cleanUrl } from "@/libs/clean-url"
import { isValidAnthropicApiKey } from "@/validate/anthropic"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { App, Form, Input } from "antd"
import { useTranslation } from "react-i18next"

type Props = {
  provider: AiProvider
}

export const ConfigAnthropic = ({ provider }: Props) => {
  const { t } = useTranslation("modelProvider")
  const { message } = App.useApp()
  const queryClient = useQueryClient()
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
      queryClient.invalidateQueries({
        queryKey: ["fetchModel"]
      })
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
        apiKey: provider?.apiKey,
        baseUrl: provider?.baseUrl || "https://api.anthropic.com"
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
