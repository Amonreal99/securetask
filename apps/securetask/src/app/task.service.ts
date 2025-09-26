import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private baseUrl = '/api/tasks';

  constructor(private http: HttpClient) { }
  createTask(data: {
    title: string;
    subject: string;
    body: string;
    project_id: number;
    team_id: number;
    attachments?: string[];
    visibility?: string;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/createTask`, data);
  }


  getTasks(project_id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}?project_id=${project_id}`);
  }
}
