import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  user: any;
  projectForm: FormGroup;
  projects: any[] = [];

  username = localStorage.getItem('username') || 'Guest';
  constructor(private router: Router, private http: HttpClient, private fb: FormBuilder) {
    this.projectForm = this.fb.group({
      project_name: ['', [Validators.required, Validators.minLength(3)]],
      num_teams: [1, [Validators.required, Validators.min(1)]]
    });
  }
  ngOnInit(): void {
    this.http.get('/api/users/me').subscribe({
      next: (res) => {
        this.user = res;
        this.getProject();
      },
      error: (err) => {
        console.error('Failed to fetch user profile', err);
      }
    });
  }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');

    this.router.navigate(['/login']);
  }

  createProject() {
    if (this.projectForm.valid) {
      const payload = {
        ...this.projectForm.value,

        owner_id: this.user?.id
      };

      this.http.post('/api/projects/create', payload).subscribe({
        next: (res) => {
          console.log('Project created:', res);
          alert(`Project "${payload.project_name}" created successfully!`);
          this.getProject();
        },
        error: (err) => {
          console.error('Failed to create project', err);
          alert('Error creating project');
        }
      });
    }
  }

  deleteProject(projectId: number) {
    this.http.delete(`/api/projects/${projectId}`).subscribe({
      next: () => {
        alert('Project deleted successfully');

        this.projects = this.projects.filter(p => p.id !== projectId);
      },
      error: (err) => console.error('Delete failed:', err),
    });
  }


  getProject() {
    this.http.get<any[]>('/api/projects/myProject').subscribe({
      next: (res) => {
        this.projects = res;
        console.log("Projects:", this.projects);
      },
      error: (err) => {
        console.error('Failed to get projects', err);
      }
    })
  }
}
