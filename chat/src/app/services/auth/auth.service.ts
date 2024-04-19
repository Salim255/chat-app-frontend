import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthPost } from '../../interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 private ENV = environment;

  constructor(private http: HttpClient) { }

  authenticate(mode: string, userInput: AuthPost){
      return this.http
      .post<any>(`${this.ENV.apiUrl}/users/${mode}`, userInput)
  }
}
