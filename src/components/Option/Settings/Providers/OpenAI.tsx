import { SaveButton } from "@/components/Common/SaveButton"
import { DEFAULT_OPENAI_MODELS } from "@/config/openai"
import { upsertModels } from "@/db/model"
import { AiProvider, upsertProvider } from "@/db/provider"
import { cleanUrl } from "@/libs/clean-url"
import { isValidOpenAiApiKey } from "@/validate/openai"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { App, Form, Input } from "antd"
import { useTranslation } from "react-i18next"

type Props = {
  provider: AiProvider
}

export const ConfigOpenAI = ({ provider }: Props) => {
  const { t } = useTranslation("modelProvider")
  const { message } = App.useApp()
  const queryClient = useQueryClient()
  const [form] = Form.useForm()
  const { mutate: validateApiKey, isPending } = useMutation({
    mutationFn: ({ apiKey, baseUrl }: { apiKey: string; baseUrl: string }) =>
      isValidOpenAiApiKey({ baseUrl, apiKey }),
    onSuccess: async () => {
      await upsertProvider({
        apiKey: form.getFieldValue("apiKey"),
        baseUrl: cleanUrl(form.getFieldValue("baseUrl")),
        key: "openai",
        name: "OpenAI"
      })
      await upsertModels(DEFAULT_OPENAI_MODELS)
      queryClient.invalidateQueries({
        queryKey: ["fetchModel"]
      })
      message.success(t("openai.apiKey.valid"))
    },
    onError: () => {
      message.error(t("openai.apiKey.invalid"))
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
        baseUrl: provider?.baseUrl || "https://api.openai.com/v1"
      }}>
      <Form.Item
        name="baseUrl"
        label={t("openai.baseUrl.label")}
        help={t("openai.baseUrl.help")}>
        <Input placeholder={t("openai.baseUrl.placeholder")} size="large" />
      </Form.Item>

      <Form.Item
        name="apiKey"
        label={t("openai.apiKey.label")}
        help={t("openai.apiKey.help")}>
        <Input.Password
          placeholder={t("openai.apiKey.placeholder")}
          size="large"
        />
      </Form.Item>
      <div className="flex justify-end">
        <SaveButton loading={isPending} btnType="submit" />
      </div>
    </Form>
  )
}
