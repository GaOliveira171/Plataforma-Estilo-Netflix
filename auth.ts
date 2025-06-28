import api from './api';

interface LoginData {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  first_name?: string;
  last_name?: string;
}

interface AuthResponse {
  token: string;
}

interface UserData {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export const login = async (data: LoginData): Promise<string> => {
  const response = await api.post<AuthResponse>('/token/', data);
  const { token } = response.data;
  
  // Salvar token no localStorage
  localStorage.setItem('token', token);
  
  return token;
};

export const register = async (data: RegisterData): Promise<void> => {
  await api.post('/movies/register/', data);
};

export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = async (): Promise<UserData> => {
  const response = await api.get<UserData>('/accounts/me/');
  
  // Salvar dados do usuário no localStorage
  localStorage.setItem('user', JSON.stringify(response.data));
  
  return response.data;
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem('token') !== null;
};

