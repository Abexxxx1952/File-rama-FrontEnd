import { isErrorData } from "@/srcApp/shared/model/isErrorData";
import { ErrorData } from "@/srcApp/shared/model/types";
import { toast } from "react-toastify";

export function notifyResponse<T>(
  responseResult: T | ErrorData,
  successMessage: string,
): void {
  if (isErrorData(responseResult)) {
    toast.error(
      `Error: ${responseResult.status} ${
        responseResult.statusText
      }. Massage: ${JSON.stringify(responseResult.message)}`,
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
