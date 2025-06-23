export type FileWithOptions = {
  file: File;
  id: string;
  uploadStatus: UploadStatus;
};

export type UploadStatus = "queued" | "uploading" | "completed" | "error";
