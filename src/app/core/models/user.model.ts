export type UserRole = 'admin' | 'almacenista' | 'analista';

export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export type PublicUser = Omit<User, 'password'>;
