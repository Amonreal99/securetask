import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SignupRequest {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  private apiUrl = '/api/users/signup';

  constructor(private http: HttpClient) { }

  signup(data: SignupRequest): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}
