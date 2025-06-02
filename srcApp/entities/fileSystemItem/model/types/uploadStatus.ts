export const UploadStatus = {
  uploading: "Uploading...",
  cancelled: "Cancelled",
  completed: "Completed",
} as const;

export type UploadStatusType = (typeof UploadStatus)[keyof typeof UploadStatus];
