import { ErrorData } from "@/srcApp/shared/model/types";
import { toast } from "react-toastify";

export function notifyResponse<T>(
  responseResult: T | ErrorData,
  isError: boolean,
  successMessage?: string,
): void {
  if (isError) {
    const errorData = responseResult as ErrorData;
    toast.error(
      `Error: ${errorData.status} ${
        errorData.statusText
      }. Massage: ${JSON.stringify(errorData.message)}`,
      {
        position: "top-right",
      },
    );
    return;
  }

  toast.success(successMessage, {
    position: "top-right",
  });
}
