import { SaveButton } from "@/components/Common/SaveButton"
import { DEFAULT_TOGETHER_MODELS } from "@/config/together"
import { upsertModels } from "@/db/model"
import { AiProvider, upsertProvider } from "@/db/provider"
import { isValidTogetherApiKey } from "@/validate/together"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { App, Form, Input } from "antd"
import { useTranslation } from "react-i18next"

type Props = {
  provider: AiProvider
}

export const ConifgTogether = ({ provider }: Props) => {
  const { t } = useTranslation("modelProvider")
  const { message } = App.useApp()
  const [form] = Form.useForm()
  const queryClient = useQueryClient()
  const { mutate: validateApiKey, isPending } = useMutation({
    mutationFn: isValidTogetherApiKey,
    onSuccess: async () => {
      await upsertProvider({
        apiKey: form.getFieldValue("apiKey"),
        key: "together",
        name: "together"
      })
      await upsertModels(DEFAULT_TOGETHER_MODELS)
      queryClient.invalidateQueries({
        queryKey: ["fetchModel"]
      })
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
        apiKey: provider?.apiKey
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
