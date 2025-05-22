"use server";

import { CACHE_TAG } from "@/srcApp/shared/constants/cacheTag";
import { fetchEntity } from "@/srcApp/shared/model/fetchEntity";
import { ErrorData } from "@/srcApp/shared/model/types/errorData";
import { Stat } from "../model/types/stat";

export async function fetchStat(
  access_token: string,
): Promise<Stat | ErrorData> {
  const url: string = `${process.env.GET_STAT_URL}`;

  return fetchEntity<Stat>(url, access_token, [CACHE_TAG.STAT]);
}
