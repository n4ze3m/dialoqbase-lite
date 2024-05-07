import { upsertProvider } from "@/db/provider"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Form, Input, Modal, message } from "antd"
import { useTranslation } from "react-i18next"

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
}

export const AddNewProvider: React.FC<Props> = ({ open, setOpen }) => {
  const { t } = useTranslation("modelProvider")
  const client = useQueryClient()
  const [form] = Form.useForm()
  const { mutate: saveProvider, isPending } = useMutation({
    mutationFn: async ({
      apiKey,
      baseUrl,
      name
    }: {
      name: string
      baseUrl: string
      apiKey: string
    }) => {
      const key =
        name.toLowerCase().replace(" ", "-").trim() +
        "-" +
        new Date().getTime().toString()
      await upsertProvider({
        apiKey,
        key,
        name,
        baseUrl
      })
      await client.invalidateQueries({
        queryKey: ["fetchProviders"]
      })
      return key
    },
    onSuccess: async (key) => {
      await client.invalidateQueries({
        queryKey: ["fetchProviders"]
      })
      form.resetFields()
      setOpen(false)
    },
    onError: () => {
      message.error(t("form.error"))
    }
  })

  return (
    <Modal
      title={t("addProvider")}
      open={open}
      footer={null}
      onOk={() => setOpen(false)}
      onCancel={() => setOpen(false)}>
      <Form
        onFinish={async (values) => {
          saveProvider(values)
        }}
        form={form}
        layout="vertical">
        <Form.Item
          name="name"
          rules={[{ required: true, message: t("form.name.required") }]}
          label={t("form.name.label")}>
          <Input placeholder={t("form.name.placeholder")} size="large" />
        </Form.Item>
        <Form.Item
          name="baseUrl"
          rules={[{ required: true, message: t("form.baseUrl.required") }]}
          label={t("form.baseUrl.label")}>
          <Input
            type="url"
            placeholder={t("form.baseUrl.placeholder")}
            size="large"
          />
        </Form.Item>

        <Form.Item name="apiKey" label={t("form.apiKey.label")}>
          <Input.Password
            placeholder={t("form.apiKey.placeholder")}
            size="large"
          />
        </Form.Item>

        <Form.Item>
          <button
            disabled={isPending}
            className="bg-black w-full dark:bg-white text-white dark:text-black px-4 py-2 rounded-md text-center inline-block">
            {!isPending ? t("form.submit") : t("form.submitting")}
          </button>
        </Form.Item>
      </Form>
    </Modal>
  )
}
