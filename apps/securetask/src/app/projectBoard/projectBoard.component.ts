import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectBoardService } from '../project-board.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TeamService } from '../team.service';

@Component({
  selector: 'app-project-board',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './projectBoard.component.html',
  styleUrl: './projectBoard.component.css',
})
export class ProjectBoardComponent implements OnInit {
  addUserForm: FormGroup;
  removeUserForm: FormGroup;
  changeRoleForm: FormGroup;
  createTeamForm: FormGroup;
  projectId!: number;
  teams: any[] = [];


  constructor(
    private fb: FormBuilder,
    private projectBoardService: ProjectBoardService,
    private teamService: TeamService,
    private route: ActivatedRoute
  ) {

    this.addUserForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      project_id: [0, Validators.required],
      role: ['viewer'],
    });


    this.removeUserForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      project_id: [0, Validators.required],
    });


    this.changeRoleForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      project_id: [0, Validators.required],
      role: ['viewer', Validators.required],
    });
    this.createTeamForm = this.fb.group({
      name: ['', Validators.required],
      project_id: [0, Validators.required],
    });

  }

  ngOnInit() {
    const projectId = Number(this.route.snapshot.paramMap.get('id'));
    if (projectId) {
      this.projectId = projectId;
      this.addUserForm.patchValue({ project_id: projectId });
      this.removeUserForm.patchValue({ project_id: projectId });
      this.changeRoleForm.patchValue({ project_id: projectId });
      this.createTeamForm.patchValue({ project_id: projectId });

      this.teamService.getTeamsByProject(this.projectId).subscribe({
        next: (teams) => this.teams = teams,
        error: (err) => console.error('Failed to load teams', err),
      });
    }
  }

  onAddUser() {
    if (this.addUserForm.valid) {
      this.projectBoardService.addUserToProject(this.addUserForm.value).subscribe({
        next: (res) => {
          alert(`User ${this.addUserForm.value.email} added successfully!`);
          console.log('Response:', res);
        },
        error: (err) => {
          console.error('Failed to add user', err);
          alert('Error adding user to project');
        },
      });
    }
  }

  onRemoveUser() {
    if (this.removeUserForm.valid) {
      this.projectBoardService.removeUser(this.removeUserForm.value).subscribe({
        next: () => alert('User removed successfully'),
        error: (err) => {
          console.error('Error removing user:', err);
          alert('Failed to remove user');
        },
      });
    }
  }

  onChangeRole() {
    if (this.changeRoleForm.valid) {
      this.projectBoardService.changeRole(this.changeRoleForm.value).subscribe({
        next: () => alert('User role updated successfully'),
        error: (err) => {
          console.error('Error changing role:', err);
          alert('Failed to change role');
        },
      });
    }
  }
  createTeam() {
    if (this.createTeamForm.valid) {
      this.projectBoardService.createTeam(this.createTeamForm.value).subscribe({
        next: (res) => alert(`Team created: ${res.name}`),
        error: () => alert('Error creating team'),
      });
    }
  }

}
