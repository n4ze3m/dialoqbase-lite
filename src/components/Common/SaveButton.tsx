import { useState } from "react"
import { CheckIcon, SaveIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
type Props = {
  onClick?: () => void
  disabled?: boolean
  className?: string
  text?: string
  textOnSave?: string
  btnType?: "button" | "submit" | "reset"
  loading?: boolean
}

export const SaveButton = ({
  onClick,
  disabled,
  className,
  text = "save",
  textOnSave = "saved",
  btnType = "button",
  loading
}: Props) => {
  const [clickedSave, setClickedSave] = useState(false)
  const { t } = useTranslation("common")
  return (
    <button
      type={btnType}
      
      disabled={disabled || clickedSave || loading}
      className={`inline-flex mt-4 items-center rounded-md border border-transparent bg-black px-2 py-2 text-sm font-medium leading-4 text-white shadow-sm dark:bg-white dark:text-gray-800 disabled:opacity-50 ${className}`}>
      {loading ? (
        <div className="flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            className="animate-spin mr-3 h-5 w-5 text-white dark:text-gray-800"
            viewBox="0 0 24 24">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              className="opacity-25"></circle>
            <path
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              className="opacity-75"></path>
          </svg>{" "}
        </div>
      ) : clickedSave ? (
        <CheckIcon className="w-4 h-4 mr-2" />
      ) : (
        <SaveIcon className="w-4 h-4 mr-2" />
      )}

      {clickedSave ? t(textOnSave) : t(text)}
    </button>
  )
}
