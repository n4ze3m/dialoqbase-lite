import { useTranslation } from "react-i18next"
import logoImage from "~/assets/icon.png"

export const PlaygroundEmpty = () => {
  const { t } = useTranslation("playground")
  return (
    <div className="mx-auto sm:max-w-xl px-4 mt-10">
      <div className="rounded-lg justify-center items-center flex flex-col border p-8 bg-gray-50 dark:bg-[#262626]  dark:border-gray-600">
        <div className="flex flex-col items-center space-y-4">
          <p className="dark:text-gray-400 text-lg text-gray-900">
            {t("intro")}
          </p>
        </div>
      </div>
    </div>
  )
}
