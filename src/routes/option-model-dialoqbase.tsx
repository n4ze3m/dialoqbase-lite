import { SettingsLayout } from "~/components/Layouts/SettingsOptionLayout"
import OptionLayout from "~/components/Layouts/Layout"
import { DialoqbaseSettings } from "@/components/Option/Settings/dialoqbase"

export const OptionSettingDialoqbase = () => {
  return (
    <OptionLayout>
      <SettingsLayout>
        <DialoqbaseSettings />
      </SettingsLayout>
    </OptionLayout>
  )
}
