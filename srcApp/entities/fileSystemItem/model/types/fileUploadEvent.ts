import { StatusUpload } from "./fileUploadResult";

export type FileUploadEvent = {
  fileName: string;
  progress: number;
  status: (typeof StatusUpload)[keyof typeof StatusUpload];
  error: string | null;
};
