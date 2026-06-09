export interface LoginCredentials {
  username: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  token: string;
}

export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  role: string;
  token: string;
}