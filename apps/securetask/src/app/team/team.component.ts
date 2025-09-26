import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectBoardService } from '../project-board.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TeamService } from '../team.service';


@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './team.component.html',
  styleUrl: './team.component.css',
})
export class TeamComponent implements OnInit {

  addUserForm: FormGroup;
  removeUserForm: FormGroup;
  projectId!: number;

  constructor(private fb: FormBuilder, private teamService: TeamService, private route: ActivatedRoute) {


    this.addUserForm = this.fb.group({
      caller_id: [localStorage.getItem('userId') || '', Validators.required],
      project_id: [0, Validators.required],
      email: ['', [Validators.required, Validators.email]],
      team_id: ['', Validators.required],
      role: ['viewer', Validators.required],
    });

    this.removeUserForm = this.fb.group({
      project_id: [0, Validators.required],
      team_id: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {
    const projectId = Number(this.route.snapshot.paramMap.get('projectId'));
    console.log('Resolved projectId:', projectId);
    if (projectId) {

      this.addUserForm.patchValue({ project_id: projectId });
      this.removeUserForm.patchValue({ project_id: projectId });
    }
  }


  addUser() {
    if (this.addUserForm.valid) {
      this.teamService.addToTeam(this.addUserForm.value).subscribe({
        next: () => alert('User added to team!'),
        error: () => alert('Error adding user')
      });
    }
  }

  removeUser() {
    if (this.removeUserForm.valid) {
      this.teamService.removeFromTeam(this.removeUserForm.value).subscribe({
        next: () => alert('User removed from team!'),
        error: () => alert('Error removing user')
      });
    }
  }
}