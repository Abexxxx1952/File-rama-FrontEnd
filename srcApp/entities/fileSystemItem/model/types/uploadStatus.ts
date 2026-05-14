export const UploadStatusView = {
  uploading: "Uploading...",
  cancelled: "Cancelled",
  completed: "Completed",
} as const;

export type UploadStatusViewType =
  (typeof UploadStatusView)[keyof typeof UploadStatusView];
