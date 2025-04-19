export interface AuthPost {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  confirm_password?: string;
}

export interface AuthResponseDto {
  expireIn: number;
  id: number;
  token: string;
  privateKey: string;
  publicKey: string;
  email: string;
}

export type UpdatedUserDto = {
  id: 1,
  first_name: 'Salim',
  last_name: 'Hassan',
  avatar: 'avatar',
  connection_status: 'online',
}

export type UpdateMePayload =
  | FormData
  | {
      first_name?: string;
      last_name?: string;
      connection_status?: string;
    };


