import { SaveButton } from "@/components/Common/SaveButton"
import { DEFAULT_GROQ_MODELS } from "@/config/groq"
import { upsertModels } from "@/db/model"
import { AiProvider, upsertProvider } from "@/db/provider"
import { isValidGroqApiKey } from "@/validate/groq"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { App, Form, Input } from "antd"
import { useTranslation } from "react-i18next"

type Props = {
  provider: AiProvider
}

export const ConifgGroq = ({ provider }: Props) => {
  const { t } = useTranslation("modelProvider")
  const { message } = App.useApp()
  const queryClient = useQueryClient()
  const [form] = Form.useForm()
  const { mutate: validateApiKey, isPending } = useMutation({
    mutationFn: isValidGroqApiKey,
    onSuccess: async () => {
      await upsertProvider({
        apiKey: form.getFieldValue("apiKey"),
        key: "groq",
        name: "Groq"
      })
      await upsertModels(DEFAULT_GROQ_MODELS)
      queryClient.invalidateQueries({
        queryKey: ["fetchModel"]
      })
      message.success(t("groq.apiKey.valid"))
    },
    onError: () => {
      message.error(t("groq.apiKey.invalid"))
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
        apiKey: provider?.apiKey
      }}>
      <Form.Item
        name="apiKey"
        label={t("groq.apiKey.label")}
        help={t("groq.apiKey.help")}>
        <Input.Password
          placeholder={t("groq.apiKey.placeholder")}
          size="large"
        />
      </Form.Item>
      <div className="flex justify-end">
        <SaveButton loading={isPending} btnType="submit" />
      </div>
    </Form>
  )
}
