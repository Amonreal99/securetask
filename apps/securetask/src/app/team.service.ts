import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private baseUrl = '/api/teams';

  constructor(private http: HttpClient) { }


  getTeamsByProject(projectId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/byProject/${projectId}`);
  }


  addToTeam(data: { caller_id: number; project_id: number; email: string; team_id: number; role: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/addToTeam`, data);
  }

  removeFromTeam(data: { project_id: number; team_id: number; email: string }): Observable<any> {
    return this.http.delete(`${this.baseUrl}/removeFromTeam`, { body: data });
  }
}

