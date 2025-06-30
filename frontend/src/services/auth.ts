// Funções mock para autenticação

export async function login({ username, password }: { username: string; password: string }) {
  // Simule um login bem-sucedido
  localStorage.setItem('token', 'fake-token');
  return Promise.resolve();
}

export function logout() {
  localStorage.removeItem('token');
}

export function isAuthenticated() {
  return !!localStorage.getItem('token');
}

export async function getCurrentUser() {
  // Simule um usuário autenticado
  return Promise.resolve({
    id: 1,
    username: 'demo',
    email: 'demo@demo.com',
    first_name: 'Demo',
    last_name: 'User',
  });
}