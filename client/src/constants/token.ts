let access_token: string;

export function setToken(token: string): void {
  access_token = token;
}

export async function getToken(): Promise<string> {
  return access_token;
}
