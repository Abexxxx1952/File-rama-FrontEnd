"use server";

type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "PATCH"
  | "HEAD"
  | "OPTIONS";

interface apiClientArgs {
  baseUrl: string;
  method: HttpMethod;
  abortControllerRef: React.RefObject<AbortController>;
  condition?: Record<string, unknown>;
  additionalHeaders?: Record<string, string>;
  bodyData?: Record<string, unknown>;
  cacheTags?: string[];
}

export function apiClient<T>({
  baseUrl,
  method,
  abortControllerRef,
  condition,
  additionalHeaders,
  bodyData,
  cacheTags,
}: apiClientArgs): Promise<T> {
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

  const response: Promise<T> = fetch(url.toString(), {
    method: method,
    headers: {
      "Content-Type": "application/json",
      ...additionalHeaders,
    },
    ...(bodyData && { body: JSON.stringify(bodyData) }),
    ...(cacheTags && {
      next: {
        tags: cacheTags,
      },
    }),
    signal,
  })
    .then((response) => response.json())
    .catch((err) => {
      throw err;
    });

  return response;
}
