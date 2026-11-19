import { getAuthToken } from "./auth";

const API_URL = "https://localhost:7272/api/user/dependents";

export type Dependent = {
  name: string;
  age: number;
};

export type AddDependentRequest = {
  DependentEmail: string;
};

export async function getDependents(): Promise<Dependent[]> {
  const token = getAuthToken();
  const response = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.status === 401) {
    throw new Error("Sessão expirada. Faça login novamente.");
  }

  if (!response.ok) {
    throw new Error("Não foi possível carregar os dependentes");
  }

  const data: unknown = await response.json();
  if (!Array.isArray(data)) {
    throw new Error("Resposta inválida ao carregar os dependentes");
  }

  return data.map((item: unknown) => {
    if (typeof item !== "object" || item === null) {
      throw new Error("Resposta inválida ao carregar os dependentes");
    }

    const record = item as Record<string, unknown>;
    const name = record.name ?? record.Name;
    const age = record.age ?? record.Age;
    if (typeof name !== "string" || typeof age !== "number") {
      throw new Error("Resposta inválida ao carregar os dependentes");
    }

    return { name, age };
  });
}

export async function addDependentUser(
  body: AddDependentRequest,
): Promise<void> {
  const token = getAuthToken();

  const response = await fetch(`${API_URL}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (response.status === 401) {
    throw new Error("Sessão expirada. Faça login novamente.");
  }

  console.log(response);
  if (!response.ok) {
    throw new Error("Nãooooo foi possível adicionar o dependente");
  }
}
