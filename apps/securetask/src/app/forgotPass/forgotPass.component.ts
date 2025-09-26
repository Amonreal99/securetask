import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ForgotPassService, resetRequest } from '../forgot-pass.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-pass',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './forgotPass.component.html',
  styleUrl: './forgotPass.component.css',
})
export class ForgotPassComponent {
  step = 1;
  forgotForm: FormGroup;
  resetForm: FormGroup;

  constructor(private fb: FormBuilder, private forgotService: ForgotPassService, private router: Router) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      code: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onForgotSubmit() {
    if (this.forgotForm.valid) {
      this.forgotService.forgotPass(this.forgotForm.value.email).subscribe({
        next: () => {
          alert('Verification code sent to your email!');

          this.resetForm.patchValue({ email: this.forgotForm.value.email });
          this.step = 2;
        },
        error: (err) => console.error(err),
      });
    }
  }

  onResetSubmit() {
    if (this.resetForm.valid) {
      const data: resetRequest = this.resetForm.value;
      this.forgotService.resetPass(data).subscribe({
        next: () => {
          alert('Password reset successfully. Please login.');
          this.router.navigate(['/login']);
        },
        error: (err) => console.error(err),
      });
    }
  }
}
