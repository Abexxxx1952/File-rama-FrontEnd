import { getCookies } from "@/srcApp/features/cookies/model/getCookies";

export async function userIsLogged(): Promise<Boolean> {
  try {
    const { access_token, refresh_token } = await getCookies();

    if (access_token || refresh_token) {
      return true;
    }

    return false;
  } catch (error: unknown) {
    console.log("error", error);
    return false;
  }
}
