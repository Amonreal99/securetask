import { Route } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ForgotPassComponent } from './forgotPass/forgotPass.component';
import { ProjectBoardComponent } from './projectBoard/projectBoard.component';
import { TeamComponent } from './team/team.component';
import { AuthGuard } from './auth.guard';
import { LoginGuard } from './login.guard';
import { TaskComponent } from './task/task.component';

export const appRoutes: Route[] = [
    { path: 'signup', component: SignupComponent, canActivate: [LoginGuard] },
    { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'forgotPassword', component: ForgotPassComponent, canActivate: [LoginGuard] },
    { path: 'projectBoard/:id', component: ProjectBoardComponent, canActivate: [AuthGuard] },
    { path: 'teams/:projectId', component: TeamComponent, canActivate: [AuthGuard] },
    { path: 'tasks/:projectId/:teamId', component: TaskComponent, canActivate: [AuthGuard] },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
];
