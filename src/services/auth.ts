import usersData from '../mocks/users.json';

const users = [...usersData];

type LoggedUser = { id: number; name: string; email: string };

let loggedUser: LoggedUser | null = null;

export function login(email: string, password: string) {
  const user = users.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
  );

  if (!user) {
    throw new Error('E-mail ou senha inválidos');
  }

  loggedUser = { id: user.id, name: user.name, email: user.email };
  return loggedUser;
}

export function register(name: string, email: string, phone: string, password: string) {
  if (!name.trim() || !email.trim() || !password) {
    throw new Error('Preencha nome, e-mail e senha');
  }

  if (password.length < 6) {
    throw new Error('A senha precisa ter pelo menos 6 caracteres');
  }

  const alreadyExists = users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (alreadyExists) {
    throw new Error('Este e-mail já está cadastrado');
  }

  const newUser = {
    id: users.length + 1,
    name: name.trim(),
    email: email.trim(),
    phone,
    password,
  };
  users.push(newUser);

  return { id: newUser.id, name: newUser.name, email: newUser.email };
}

export function getLoggedUser() {
  return loggedUser;
}

export function logout() {
  loggedUser = null;
}