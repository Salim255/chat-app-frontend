import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Account } from "../models/account.model";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

export type FetchAccountDto = {
    status: string,
    data: { profile: Account  }
}
@Injectable({providedIn: 'root'})

export class AccountHttpService {
  private ENV = environment;
  baseUrl = `${this.ENV.apiUrl}/profiles`;

  constructor(private http:  HttpClient){}
  getAccount(): Observable<FetchAccountDto>{
    return this.http.get<FetchAccountDto>(`${this.baseUrl}`)
  }
}
