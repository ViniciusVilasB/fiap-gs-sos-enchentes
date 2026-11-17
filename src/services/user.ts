import { isValidPhoneNumber } from '../utils/validation';
import { getAuthToken, getLoggedUser, setLoggedUser } from './auth';

const API_URL = 'https://localhost:7272/api';

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

  const response = await fetch(`${API_URL}/user`, {
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

export type UpdateProfileRequest = {
  name: string;
  age: number;
  phoneNumber: string;
  healthProfile: {
    mobilityLevel: number;
    livesAlone: boolean;
    healthConditions: string[];
  };
};

export async function updateProfile(data: UpdateProfileRequest): Promise<UserProfile> {
  if (!data.name.trim()) {
    throw new Error('Informe seu nome');
  }

  if (data.phoneNumber.trim() && !isValidPhoneNumber(data.phoneNumber)) {
    throw new Error('Informe um telefone válido com DDD');
  }

  if (!Number.isInteger(data.age) || data.age < 1 || data.age > 120) {
    throw new Error('Informe uma idade válida');
  }

  if (data.healthProfile.mobilityLevel < 1 || data.healthProfile.mobilityLevel > 4) {
    throw new Error('Selecione seu nível de mobilidade');
  }

  const token = getAuthToken();
  if (!token) {
    throw new Error('Sessão expirada. Faça login novamente.');
  }

const response = await fetch(`${API_URL}/user`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      ...data,
      name: data.name.trim(),
      phoneNumber: data.phoneNumber.trim(),
    }),
  });

  if (response.status === 401) {
    throw new Error('Sessão expirada. Faça login novamente.');
  }

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, 'Não foi possível salvar as alterações'));
  }

  const updated: UserProfile = await response.json();
  setLoggedUser({
    id: updated.id,
    name: updated.name,
    email: updated.email,
    isAdmin: getLoggedUser()?.isAdmin ?? false,
  });
  return updated;
}

async function readErrorMessage(response: Response, fallback: string) {
  try {
    const body = await response.json();
    return typeof body?.message === 'string' ? body.message : fallback;
  } catch {
    return fallback;
  }
}