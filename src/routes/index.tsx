import { Route, Routes } from "react-router-dom"
import { SidepanelChat } from "./sidepanel-chat"
import { useDarkMode } from "~/hooks/useDarkmode"
import { SidepanelSettings } from "./sidepanel-settings"
import { OptionIndex } from "./option-index"
import { OptionModal } from "./option-settings-model"
import { OptionPrompt } from "./option-settings-prompt"
import { OptionsModelProvider } from "./options-model-provider"
import { OptionSettings } from "./option-settings"
import { OptionShare } from "./option-settings-share"
import { OptionSettingDialoqbase } from "./option-model-dialoqbase"

export const OptionRouting = () => {
  const { mode } = useDarkMode()

  return (
    <div className={mode === "dark" ? "dark" : "light"}>
      <Routes>
        <Route path="/" element={<OptionIndex />} />
        <Route path="/settings" element={<OptionSettings />} />
        <Route path="/settings/model" element={<OptionModal />} />
        <Route
          path="/settings/dialoqbase"
          element={<OptionSettingDialoqbase />}
        />
        <Route path="/settings/prompt" element={<OptionPrompt />} />
        <Route path="/settings/provider" element={<OptionsModelProvider />} />
        <Route path="/settings/share" element={<OptionShare />} />
      </Routes>
    </div>
  )
}

export const SidepanelRouting = () => {
  const { mode } = useDarkMode()

  return (
    <div className={mode === "dark" ? "dark" : "light"}>
      <Routes>
        <Route path="/" element={<SidepanelChat />} />
        <Route path="/settings" element={<SidepanelSettings />} />
      </Routes>
    </div>
  )
}
