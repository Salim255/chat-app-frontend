export class User {
  constructor(
    public id: number,
    private _token: string,
    private tokenExpirationDate: Date,
    private _privateKey: string,
    private _publicKey: string,
    private _email: string
  ) {}

  get token() {
    if (!this.tokenExpirationDate || this.tokenExpirationDate <= new Date()) {
      return null;
    }
    return this._token;
  }

  get tokenDuration() {
    if (!this.token) {
      return 0;
    }
    return this.tokenExpirationDate.getTime() - new Date().getTime();
  }
}
