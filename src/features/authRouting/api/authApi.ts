const API_URL = 'https://api.escuelajs.co/api/v1';

interface LoginResponse {
  access_token: string;
}

interface ApiError {
  message?: string | string[];
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

async function getErrorMessage(response: Response) {
  const data = (await response.json().catch(() => null)) as ApiError | null;

  if (Array.isArray(data?.message)) {
    return data.message.join(', ');
  }

  return data?.message || 'Не удалось выполнить запрос';
}

export async function loginRequest(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  const data = (await response.json()) as LoginResponse;
  return data.access_token;
}

export async function getCurrentUser(token: string) {
  const response = await fetch(`${API_URL}/auth/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return (await response.json()) as AuthUser;
}
