import { fetchWithAuth } from "@/srcApp/shared/model/fetchWithAuth";

import { fetchStat } from "../api/fetchStat";
import { type Stat } from "./types/stat";

export async function getStat(): Promise<Stat | null> {
  return await fetchWithAuth<Stat>(fetchStat);
}
