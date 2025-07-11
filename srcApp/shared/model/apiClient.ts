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
  let signal: AbortSignal | undefined;
  if (abortControllerRef) {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    signal = abortControllerRef.current.signal;
  }

  let queryParam: string;

  const url = new URL(baseUrl);

  if (condition) {
    queryParam = encodeURIComponent(JSON.stringify(condition));
    url.searchParams.append("condition", queryParam);
  }

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
      body: bodyData instanceof FormData ? bodyData : JSON.stringify(bodyData),
    }),
    ...(cacheTags && {
      next: {
        tags: cacheTags,
        revalidate: revalidateTime || 0,
      },
    }),
    ...(signal && { signal }),
  });

  return response;
}
