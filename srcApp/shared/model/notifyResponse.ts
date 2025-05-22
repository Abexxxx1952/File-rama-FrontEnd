import { ErrorData } from "@/srcApp/shared/model/types/types";
import { toast } from "react-toastify";

export function notifyResponse<T>(
  responseResult: T | ErrorData,
  isError: boolean,
  successMessage?: string,
): void {
  if (isError) {
    const errorData = responseResult as ErrorData;
    toast.error(
      /*  `Error: status code: ${errorData.status ? errorData.status : errorData.statusCode} ${
        errorData.statusText ? errorData.statusText : ""
      }, massage: ${JSON.stringify(errorData.message)}`, */
      `Error:\n${JSON.stringify(errorData, null, 2)}`,
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
