export const UploadStatus = {
  queued: "queued",
  uploading: "uploading",
  completed: "completed",
  error: "error",
} as const;

export type UploadStatusType = (typeof UploadStatus)[keyof typeof UploadStatus];

export type FileWithOptions = {
  file: File;
  id: string;
  uploadStatus: UploadStatusType;
};
