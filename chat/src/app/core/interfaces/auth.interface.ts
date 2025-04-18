export interface AuthPost {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  confirm_password?: string;
}

export interface AuthResponse {
  expireIn: number;
  id: number;
  token: string;
  privateKey: string;
  publicKey: string;
  email: string;
}
