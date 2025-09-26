import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AddUserRequest {
  email: string;
  project_id: number;
  role?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectBoardService {
  private baseUrl = '/api/projects';
  private otherUrl = '/api/teams'

  constructor(private http: HttpClient) { }

  addUserToProject(data: AddUserRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/addUser`, data);
  }

  removeUser(data: { email: string; project_id: number }): Observable<any> {
    return this.http.post(`${this.baseUrl}/removeUser`, data);
  }

  changeRole(data: { project_id: number; user_id: number; role: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/changeRole`, data);
  }
  createTeam(data: { name: string; project_id: number }): Observable<any> {
    return this.http.post(`${this.otherUrl}/createTeam`, data);
  }
}
