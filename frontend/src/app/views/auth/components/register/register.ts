import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Logo } from '../../../../shared/logo/logo';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../../../services/auth';
import { Spinner } from '../../../../shared/spinner/spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [Logo,ReactiveFormsModule,Spinner],
  templateUrl: './register.html',
  styleUrl: './register.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Register {
  private fb = inject(FormBuilder);
  private authService = inject(Auth);
  private router = inject(Router);
  loading = signal(false);
  registerForm: FormGroup;


  constructor() {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  register() {
    if (this.registerForm.valid) {
      this.loading.set(true);
      const { email, username } = this.registerForm.value;
      this.authService.register(email, username).subscribe({
        next: (_) => {
          this.loading.set(false);
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Registration error:', error);
          this.loading.set(false);
        }
      });
    }
  }
}
