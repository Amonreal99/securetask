import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectBoardService } from '../project-board.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TeamService } from '../team.service';
import { TaskService } from '../task.service'

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
})
export class TaskComponent implements OnInit {
  createTaskForm: FormGroup;
  addUserToTeamForm: FormGroup;
  removeUserFromTeamForm: FormGroup;
  tasks: any[] = [];
  projectId!: number;
  teamId!: number;

  constructor(
    private fb: FormBuilder,
    private projectBoardService: ProjectBoardService,
    private teamService: TeamService,
    private taskService: TaskService,
    private route: ActivatedRoute
  ) {

    this.createTaskForm = this.fb.group({
      title: ['', Validators.required],
      subject: ['', Validators.required],
      body: ['', Validators.required],
      project_id: [0, Validators.required],
      team_id: ['', Validators.required],
      attachments: [[]],
      visibility: ['viewer'],
    });


    this.addUserToTeamForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      project_id: [0, Validators.required],
      team_id: ['', Validators.required],
      role: ['viewer', Validators.required],
    });

    this.removeUserFromTeamForm = this.fb.group({
      project_id: [0, Validators.required],
      team_id: ['', Validators.required],
      user_id: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.projectId = Number(this.route.snapshot.paramMap.get('projectId'));
    this.teamId = Number(this.route.snapshot.paramMap.get('teamId'));
    if (this.projectId) {
      this.createTaskForm.patchValue({ project_id: this.projectId });
      this.addUserToTeamForm.patchValue({ project_id: this.projectId });
      this.removeUserFromTeamForm.patchValue({ project_id: this.projectId });
      this.loadTasks();
    }
    if (this.teamId) {
      this.createTaskForm.patchValue({ team_id: this.teamId });
    }
  }
  loadTasks() {
    this.taskService.getTasks(this.projectId).subscribe({
      next: (res) => (this.tasks = res),
      error: () => alert('Error loading tasks')
    });
  }


  onCreateTask() {
    if (this.createTaskForm.valid) {
      this.taskService.createTask(this.createTaskForm.value).subscribe({
        next: (res) => {
          alert(`Task created: ${res.title}`);
          this.loadTasks();
        },
        error: () => alert('Error creating task'),
      });
    }
  }


  onAddUserToTeam() {
    if (this.addUserToTeamForm.valid) {
      this.teamService.addToTeam(this.addUserToTeamForm.value).subscribe({
        next: () => alert('User added to team!'),
        error: () => alert('Error adding user to team'),
      });
    }
  }

  onRemoveUserFromTeam() {
    if (this.removeUserFromTeamForm.valid) {
      this.teamService.removeFromTeam(this.removeUserFromTeamForm.value).subscribe({
        next: () => alert('User removed from team!'),
        error: () => alert('Error removing user from team'),
      });
    }
  }
}
