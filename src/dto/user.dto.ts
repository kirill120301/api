export class User {
  id: number;
  login: string;
  password?: string;
  role: 'admin' | 'user';
}

export class UpdateUser {
  login: string;
  password?: string;
}
