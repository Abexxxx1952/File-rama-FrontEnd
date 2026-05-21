import { type Dispatch, type SetStateAction } from "react";

import { fetchWithAuth } from "@/srcApp/shared/model/fetchWithAuth";

import { fetchEmailConfirmation } from "../api/fetchEmailConfirmation";

export async function emailConfirmation(
  setLoading: Dispatch<SetStateAction<boolean>>,
  abortControllerRef?: React.RefObject<AbortController | null | undefined>
): Promise<{ message: string } | null> {
  return await fetchWithAuth<
    { message: string },
    { abortControllerRef?: React.RefObject<AbortController | null | undefined> }
  >(
    fetchEmailConfirmation,
    { abortControllerRef },
    (data) => `${data.message}`,
    setLoading
  );
}
