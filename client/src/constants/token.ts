let accessToken: string;

export function setToken(token: string): void {
  accessToken = token;
}

export async function getToken(): Promise<string> {
  return accessToken;
}
