import { getAuthToken } from './auth';

const API_URL = 'https://localhost:7272';

export type HealthProfile = {
  id: number;
  mobilityLevel: number;
  livesAlone: boolean;
  healthConditions: string[];
};

export type UserProfile = {
  id: number;
  email: string;
  name: string;
  age: number;
  phoneNumber: string;
  healthProfile: HealthProfile | null;
};

export async function getProfile(): Promise<UserProfile> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Sessão expirada. Faça login novamente.');
  }

  const response = await fetch(`${API_URL}/api/user/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.status === 401) {
    throw new Error('Sessão expirada. Faça login novamente.');
  }

  if (!response.ok) {
    throw new Error('Não foi possível carregar o perfil');
  }

  return response.json();
}