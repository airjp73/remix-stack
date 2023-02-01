import { FilePlus, FolderOpen, Loader2 } from "lucide-react";
import { useId } from "react";
import { useDropzone, DropzoneOptions } from "react-dropzone";
import { useTranslation } from "react-i18next";
import invariant from "tiny-invariant";
import { cn } from "./cn";

export type FileUploadAreaProps =
  React.InputHTMLAttributes<HTMLInputElement> & {
    dropzoneOptions?: DropzoneOptions;
    isLoading?: boolean;
    loadingLabel?: string;
  };

export const FileUploadArea = ({
  className,
  dropzoneOptions,
  isLoading,
  loadingLabel,
  ...rest
}: FileUploadAreaProps) => {
  const { t } = useTranslation();
  const {
    getInputProps,
    getRootProps,
    isDragActive,
    acceptedFiles,
    isFileDialogActive,
  } = useDropzone(dropzoneOptions);

  const file = acceptedFiles.length === 1 ? acceptedFiles[0] : undefined;
  invariant(
    acceptedFiles.length <= 1,
    "Only one file can be handled by the drop zone."
  );

  const inputId = useId();

  return (
    <div
      {...getRootProps({
        className: cn(
          "mt-1 sm:col-span-2 sm:mt-0",
          "focus-within:ring-2 focus-within:ring-brand-500 focus-within:ring-offset-2 rounded-md",
          className
        ),
      })}
    >
      <div
        className={cn(
          "relative flex max-w-lg justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6 dark:border-gray-600",
          isDragActive &&
            "border-brand-300 bg-brand-100 dark:border-brand-600 dark:bg-brand-800"
        )}
      >
        {isDragActive && (
          <FilePlus className="absolute inset-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 text-brand-600 dark:text-brand-400" />
        )}
        {isFileDialogActive && (
          <FolderOpen className="absolute inset-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
        )}
        {isLoading && (
          <div
            className={cn(
              "absolute inset-1/2 flex w-12 -translate-x-1/2 -translate-y-1/2 flex-col items-center space-y-2 text-gray-400 dark:text-gray-500",
              !loadingLabel && "h-12",
              !!loadingLabel && "h-20"
            )}
          >
            <div>
              <Loader2 className="h-12 w-12 animate-spin" />
            </div>
            {loadingLabel && <p aria-live="polite">{loadingLabel}</p>}
          </div>
        )}
        <div
          className={cn(
            "display-none space-y-1 text-center",
            (isDragActive || isFileDialogActive || isLoading) && "invisible"
          )}
        >
          {file && (
            <h4
              className={cn(
                "text-l mb-4 font-semibold tracking-tight",
                "text-center text-gray-500",
                isDragActive && "text-brand-400"
              )}
            >
              {file.name}
            </h4>
          )}
          {!file && (
            <svg
              className={cn(
                "mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
              )}
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          <div
            className={cn(
              "flex justify-center text-sm text-gray-600",
              isDragActive && "text-brand-600"
            )}
          >
            <label
              htmlFor={inputId}
              className={cn(
                "relative cursor-pointer text-center font-medium text-brand-600 hover:text-brand-500"
              )}
            >
              <span>
                {file
                  ? t("fileUploadArea.chooseAnother")
                  : t("fileUploadArea.uploadText")}
              </span>
              <input
                {...getInputProps({
                  id: inputId,
                  type: "file",
                  className: "sr-only",
                  ...rest,
                })}
              />
            </label>
            <p className="pl-1">{t("fileUploadArea.orDragAndDrop")}</p>
          </div>
          <p
            className={cn(
              "text-xs text-gray-500",
              isDragActive && "text-brand-600"
            )}
          >
            {t("fileUploadArea.constraintText", { maxMegabytes: 10 })}
          </p>
        </div>
      </div>
    </div>
  );
};
