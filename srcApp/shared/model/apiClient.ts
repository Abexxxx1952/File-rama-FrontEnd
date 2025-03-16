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
  baseUrl: string;
  method: HttpMethod;
  abortControllerRef: React.RefObject<AbortController | null>;
  condition?: Record<string, unknown>;
  additionalHeaders?: Record<string, string>;
  bodyData?: Record<string, unknown>;
  cacheTags?: string[];
  revalidateTime?: number;
}

export async function apiClient({
  baseUrl,
  method,
  abortControllerRef,
  condition,
  additionalHeaders,
  bodyData,
  cacheTags,
  revalidateTime,
}: apiClientArgs): Promise<Response> {
  if (abortControllerRef.current) {
    abortControllerRef.current.abort();
  }

  abortControllerRef.current = new AbortController();
  const { signal } = abortControllerRef.current;

  let queryParam: string;
  const url = new URL(baseUrl);

  if (condition) {
    queryParam = encodeURIComponent(JSON.stringify(condition));
    url.searchParams.append("condition", queryParam);
  }

  const response = await fetch(url.toString(), {
    method: method,
    headers: {
      "Content-Type": "application/json",
      ...additionalHeaders,
    },
    ...(bodyData && { body: JSON.stringify(bodyData) }),
    ...(cacheTags && {
      next: {
        tags: cacheTags,
        ...(revalidateTime && { revalidate: revalidateTime }),
      },
    }),
    signal,
  });

  return response;
}
