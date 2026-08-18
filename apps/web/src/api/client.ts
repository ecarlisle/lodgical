const API_URL =
  import.meta.env.VITE_API_URL ??
  (import.meta.env.PROD ? "/api" : "http://localhost:4000");

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function createRequestInit(init?: RequestInit): RequestInit {
  return {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  };
}

async function createApiError(response: Response, path: string) {
  const body = await response.json().catch(() => null);
  const message = body?.message ?? `Request to ${path} failed`;

  return new ApiError(message, response.status);
}

export async function apiRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, createRequestInit(init));

  if (!response.ok) {
    throw await createApiError(response, path);
  }

  return response.json() as Promise<T>;
}
