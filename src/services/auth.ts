import { isValidEmail, isValidPhoneNumber } from "../utils/validation";

type LoggedUser = { id: number; name: string; email: string; isAdmin: boolean };

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
let registrationSubmitted = false;
let loggedUser: LoggedUser | null = null;
let authToken: string | null = null;

export async function login(email: string, password: string) {
  if (!email.trim() || !password) {
    throw new Error("Preencha e-mail e senha");
  }

  if (!isValidEmail(email)) {
    throw new Error("Informe um e-mail válido");
  }

  const response = await fetch("https://localhost:7272/api/user/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim(), password }),
  });

  if (!response.ok) {
    throw new Error(
      await getResponseErrorMessage(response, "E-mail ou senha inválidos"),
    );
  }

  const body: unknown = await response.json();
  if (typeof body !== "object" || body === null) {
    throw new Error("Resposta inválida do servidor ao entrar");
  }

  const success = readProperty(body, "success", "Success");
  const message = readProperty(body, "message", "Message");
  if (success !== true) {
    throw new Error(
      typeof message === "string" && message
        ? message
        : "Não foi possível entrar",
    );
  }

  const user = readProperty(body, "user", "User");
  if (
    typeof user !== "object" ||
    user === null ||
    !("id" in user) ||
    typeof user.id !== "number" ||
    !("name" in user) ||
    typeof user.name !== "string" ||
    !("email" in user) ||
    typeof user.email !== "string"
  ) {
    throw new Error("Resposta inválida do servidor ao entrar");
  }

  const token = readProperty(body, "token", "Token");
  authToken = typeof token === "string" ? token : null;
  const isAdmin = 'isAdmin' in user && user.isAdmin === true;
  loggedUser = { id: user.id, name: user.name, email: user.email, isAdmin };
  return loggedUser;
}

export function saveRegistrationDetails(details: RegistrationDetails) {
  if (
    !details.name.trim() ||
    !details.email.trim() ||
    !details.password ||
    !details.phoneNumber.trim()
  ) {
    throw new Error("Preencha todos os campos");
  }

  if (!isValidEmail(details.email)) {
    throw new Error("Informe um e-mail válido");
  }

  if (!isValidPhoneNumber(details.phoneNumber)) {
    throw new Error("Informe um telefone válido com DDD");
  }

  if (details.password.length < 6) {
    throw new Error("A senha precisa ter pelo menos 6 caracteres");
  }

  if (!Number.isInteger(details.age) || details.age < 1 || details.age > 120) {
    throw new Error("Informe uma idade válida");
  }

  registrationDraft = {
    ...details,
    name: details.name.trim(),
    email: details.email.trim(),
    phoneNumber: details.phoneNumber.trim(),
  };
  registrationSubmitted = false;
}

export async function register(healthProfile: HealthProfileRequest) {
  if (!registrationDraft) {
    throw new Error(
      "Os dados do cadastro não foram encontrados. Recomece o cadastro.",
    );
  }

  const details = registrationDraft;
  if (!registrationSubmitted) {
    const request: RegisterRequest = { ...details, healthProfile };
    const response = await fetch("https://localhost:7272/api/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(
        await getResponseErrorMessage(
          response,
          `Não foi possível cadastrar (HTTP ${response.status})`,
        ),
      );
    }

    registrationSubmitted = true;
  }

  await login(details.email, details.password);
  registrationDraft = null;
  registrationSubmitted = false;
}

function readProperty(
  value: object,
  camelCase: string,
  pascalCase: string,
): unknown {
  if (camelCase in value) {
    return (value as Record<string, unknown>)[camelCase];
  }

  return pascalCase in value
    ? (value as Record<string, unknown>)[pascalCase]
    : undefined;
}

async function getResponseErrorMessage(response: Response, fallback: string) {
  const responseText = await response.text();
  if (!responseText) {
    return fallback;
  }

  try {
    const body: unknown = JSON.parse(responseText);
    if (typeof body === "object" && body !== null) {
      const message = readProperty(body, "message", "Message");
      if (typeof message === "string") {
        return message;
      }
    }
  } catch {
    return responseText;
  }

  return responseText;
}

export function getLoggedUser() {
  return loggedUser;
}

export function getAuthToken() {
  if (!authToken) {
    throw new Error("Sessão expirada. Faça login novamente.");
  }
  return authToken;
}

export function logout() {
  loggedUser = null;
  authToken = null;
}

export function setLoggedUser(user: LoggedUser) {
  loggedUser = user;
}
