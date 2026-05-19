"use server";

type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "PATCH"
  | "HEAD"
  | "OPTIONS";

export interface apiClientArgs {
  baseUrl: string | URL;
  method?: HttpMethod;
  condition?: Record<string, unknown>;
  additionalHeaders?: Record<string, string>;
  bodyData?: Record<string, unknown> | FormData;
  cacheTags?: string[];
  revalidateTime?: number;
  abortControllerRef?: React.RefObject<AbortController | null>;
}

export async function apiClient({
  baseUrl,
  method,
  condition,
  additionalHeaders,
  bodyData,
  cacheTags,
  revalidateTime = 600,
  abortControllerRef,
}: apiClientArgs): Promise<Response> {
  let signal: AbortSignal;
  let abortController: AbortController;
  if (abortControllerRef && abortControllerRef.current) {
    abortControllerRef.current.abort();
    abortController = new AbortController();
    abortControllerRef.current = abortController;
    signal = abortController.signal;
  } else {
    abortController = new AbortController();
    signal = abortController.signal;
  }

  const timeout = Number(process.env.FETCH_TIMEOUT) || 30000;
  const timeoutId = setTimeout(() => abortController.abort(), timeout);

  let queryParam: string;

  const url = new URL(baseUrl);

  if (condition) {
    queryParam = encodeURIComponent(JSON.stringify(condition));
    url.searchParams.append("condition", queryParam);
  }

  try {
    const response = await fetch(url.toString(), {
      method: method || "GET",
      headers: {
        ...(bodyData &&
          !(bodyData instanceof FormData) && {
            "Content-Type": "application/json",
          }),
        ...additionalHeaders,
      },
      ...(bodyData && {
        body:
          bodyData instanceof FormData ? bodyData : JSON.stringify(bodyData),
      }),
      ...(cacheTags && {
        next: {
          tags: cacheTags,
          revalidate: revalidateTime || 0,
        },
      }),
      ...{ signal },
    });

    clearTimeout(timeoutId);

    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}
