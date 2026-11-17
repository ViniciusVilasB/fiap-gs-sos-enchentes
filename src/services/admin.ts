import { getAuthToken } from './auth';

const API_URL = 'https://localhost:7272';

export type RescueSummary = {
  userId: number;
  name: string;
  age: number;
  phoneNumber: string;
  score: number;
  priority: 'Alta' | 'Média' | 'Baixa';
  tags: string[];
};

export async function getRescueQueue(): Promise<RescueSummary[]> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Sessão expirada. Faça login novamente.');
  }

  const response = await fetch(`${API_URL}/api/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.status === 401) {
    throw new Error('Sessão expirada. Faça login novamente.');
  }

  if (response.status === 403) {
    throw new Error('Acesso restrito à equipe de resgate.');
  }

  if (!response.ok) {
    throw new Error('Não foi possível carregar a fila de resgate');
  }

  return response.json();
}