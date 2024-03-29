import { SettingsLayout } from "~/components/Layouts/SettingsOptionLayout"
import OptionLayout from "~/components/Layouts/Layout"
import { SettingsModelProviders } from "@/components/Option/Settings/model-providers"

export const OptionOllamaSettings = () => {
  return (
    <OptionLayout>
      <SettingsLayout>
        <SettingsModelProviders />
      </SettingsLayout>
    </OptionLayout>
  )
}
