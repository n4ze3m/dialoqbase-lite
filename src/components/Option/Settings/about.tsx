import { useTranslation } from "react-i18next"
import { Descriptions } from "antd"

export const AboutApp = () => {
  const { t } = useTranslation("settings")

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex flex-col space-y-4">
        <Descriptions
          title={t("about.heading")}
          column={1}
          size="middle"
          items={[
            {
              key: 1,
              label: t("about.chromeVersion"),
              children: chrome?.runtime?.getManifest()?.version
            }
          ]}
        />
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {t("about.intro")}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {t("about.support")}
          </p>

          <div className="flex gap-2">
            <a
              href="https://ko-fi.com/n4ze3m"
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 dark:text-blue-400 border dark:border-gray-600 px-2.5 py-2 rounded-md">
              {t("about.koFi")}
            </a>

            <a
              href="https://github.com/sponsors/n4ze3m"
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 dark:text-blue-400 border dark:border-gray-600 px-2.5 py-2 rounded-md">
              {t("about.githubSponsor")}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
