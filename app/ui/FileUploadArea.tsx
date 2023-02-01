import { FolderOpen } from "lucide-react";
import { useId } from "react";
import { useDropzone } from "react-dropzone";
import invariant from "tiny-invariant";
import { cn } from "./cn";

export type FileUploadAreaProps = React.InputHTMLAttributes<HTMLInputElement>;

export const FileUploadArea = ({ className, ...rest }: FileUploadAreaProps) => {
  const {
    getInputProps,
    getRootProps,
    isDragActive,
    acceptedFiles,
    isFileDialogActive,
  } = useDropzone();

  const file = acceptedFiles.length === 1 ? acceptedFiles[0] : undefined;
  invariant(
    acceptedFiles.length <= 1,
    "Only one file can be handled by the drop zone."
  );

  const inputId = useId();

  return (
    <div
      {...getRootProps({
        className: cn("mt-1 sm:col-span-2 sm:mt-0", className),
      })}
    >
      <div
        className={cn(
          "flex max-w-lg justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6 dark:border-gray-600",
          isDragActive && "border-brand-300 bg-brand-100 dark:border-brand-600"
        )}
      >
        <div className="space-y-1 text-center">
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
          {!file && !isFileDialogActive && (
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
          {isFileDialogActive && (
            <FolderOpen
              className={cn(
                "mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
              )}
            />
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
                "relative cursor-pointer rounded-md text-center font-medium text-brand-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-brand-500 focus-within:ring-offset-2 hover:text-brand-500"
              )}
            >
              <span>{file ? "Choose another file" : "Upload a file"}</span>
              <input
                {...getInputProps({
                  id: inputId,
                  type: "file",
                  className: "sr-only",
                  ...rest,
                })}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p
            className={cn(
              "text-xs text-gray-500",
              isDragActive && "text-brand-600"
            )}
          >
            PNG, JPG, GIF up to 10MB
          </p>
        </div>
      </div>
    </div>
  );
};
