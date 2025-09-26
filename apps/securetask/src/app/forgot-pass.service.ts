import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface resetRequest {
  email: string;
  code: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class ForgotPassService {

  private baseUrl = '/api/users';

  constructor(private http: HttpClient) { }

  forgotPass(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/forgotPassword`, { email })
  }

  resetPass(data: resetRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/resetPassword`, data)
  }
}
