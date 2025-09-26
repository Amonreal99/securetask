import { Component } from '@angular/core';
import { SignupService } from '../signup.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  signupForm: FormGroup;


  constructor(private fb: FormBuilder, private signupService: SignupService) {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
  onSubmit() {
    if (this.signupForm.valid) {
      this.signupService.signup(this.signupForm.value).subscribe({
        next: (res) => console.log('Signup success:', res),
        error: (err) => console.error(' Signup failed:', err)
      });
    }
  }
}
