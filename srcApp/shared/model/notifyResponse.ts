import { toast } from "react-toastify";
import { isErrorData } from "./isErrorData";
import { NotifyParams } from "./types/notifyParams";

export function notifyResponse(params: NotifyParams, message?: string): void {
  if (params.isError) {
    if (isErrorData(params.responseResult)) {
      toast.error(
        `Error:  ${
          params.responseResult.error ? params.responseResult.error : ""
        }. Massage: ${
          params.responseResult.message ? params.responseResult.message : ""
        }`,

        {
          position: "top-right",
        },
      );
      return;
    }
    if (message) {
      toast.error(message, {
        position: "top-right",
      });
      return;
    }

    toast.error(`Unexpected error`, {
      position: "top-right",
    });
    return;
  }

  toast.success(params.successMessage, {
    position: "top-right",
  });
}
