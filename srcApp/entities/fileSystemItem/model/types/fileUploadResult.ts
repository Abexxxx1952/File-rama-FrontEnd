import { File } from "./file";

export const StatusUpload = {
  FAILED: "FAILED",
  UPLOADING: "UPLOADING",
  COMPLETED: "COMPLETED",
} as const;

export type FileUploadCompleteResult = {
  file: File;
  status: typeof StatusUpload.COMPLETED;
  account: string;
};
export type FileUploadFailedResult = {
  status: typeof StatusUpload.FAILED;
  error: string;
  fileName: string;
};

export type FileUploadResult =
  | FileUploadCompleteResult
  | FileUploadFailedResult;
