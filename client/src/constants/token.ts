let accessToken: string | null;

export function setToken(token: string | null): void {
  accessToken = token;
}

export async function getToken(): Promise<string | null> {
  return accessToken;
}
