export interface AuthPost {
  email?: string;
  password?: string;
}

export interface AuthPostWithKeys extends Omit< AuthPost, 'password_confirm'> {
  public_key: string;
  private_key: string;
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
  id: number,
  first_name: string,
  last_name: string,
  avatar: string,
  connection_status: 'online',
}

export type UpdateMePayload =
  | FormData
  | {
      first_name?: string;
      last_name?: string;
      connection_status?: string;
    };


