import usersData from '../mocks/users.json';
import { isValidEmail, isValidPhoneNumber } from '../utils/validation';

const users = [...usersData];

type LoggedUser = { id: number; name: string; email: string };

export type HealthProfileRequest = {
  mobilityLevel: number;
  livesAlone: boolean;
  healthConditions: string[];
};

type RegistrationDetails = {
  email: string;
  password: string;
  name: string;
  age: number;
  phoneNumber: string;
};

export type RegisterRequest = RegistrationDetails & {
  healthProfile: HealthProfileRequest;
};

let registrationDraft: RegistrationDetails | null = null;
let loggedUser: LoggedUser | null = null;

export function login(email: string, password: string) {
  if (!email.trim() || !password) {
    throw new Error('Preencha e-mail e senha');
  }

  if (!isValidEmail(email)) {
    throw new Error('Informe um e-mail válido');
  }

  const user = users.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
  );

  if (!user) {
    throw new Error('E-mail ou senha inválidos');
  }

  loggedUser = { id: user.id, name: user.name, email: user.email };
  return loggedUser;
}

export function saveRegistrationDetails(details: RegistrationDetails) {
  if (
    !details.name.trim() ||
    !details.email.trim() ||
    !details.password ||
    !details.phoneNumber.trim()
  ) {
    throw new Error('Preencha todos os campos');
  }

  if (!isValidEmail(details.email)) {
    throw new Error('Informe um e-mail válido');
  }

  if (!isValidPhoneNumber(details.phoneNumber)) {
    throw new Error('Informe um telefone válido com DDD');
  }

  if (details.password.length < 6) {
    throw new Error('A senha precisa ter pelo menos 6 caracteres');
  }

  if (!Number.isInteger(details.age) || details.age < 1 || details.age > 120) {
    throw new Error('Informe uma idade válida');
  }

  registrationDraft = {
    ...details,
    name: details.name.trim(),
    email: details.email.trim(),
    phoneNumber: details.phoneNumber.trim(),
  };
}

export async function register(healthProfile: HealthProfileRequest) {
  if (!registrationDraft) {
    throw new Error('Os dados do cadastro não foram encontrados. Recomece o cadastro.');
  }

  const request: RegisterRequest = { ...registrationDraft, healthProfile };
  const response = await fetch('https://localhost:7272/api/user/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const responseText = await response.text();
    let message = responseText || `Não foi possível cadastrar (HTTP ${response.status})`;

    if (responseText) {
      try {
        const body: unknown = JSON.parse(responseText);
        if (
          typeof body === 'object' &&
          body !== null &&
          'message' in body &&
          typeof body.message === 'string'
        ) {
          message = body.message;
        }
      } catch {
        message = responseText;
      }
    }

    throw new Error(message);
  }

  registrationDraft = null;
}

export function getLoggedUser() {
  return loggedUser;
}

export function logout() {
  loggedUser = null;
}