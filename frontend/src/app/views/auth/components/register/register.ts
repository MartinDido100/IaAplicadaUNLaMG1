import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Logo } from '../../../../shared/logo/logo';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../../../services/auth';
import { Spinner } from '../../../../shared/spinner/spinner';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [Logo,ReactiveFormsModule,Spinner, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Register {
  private fb = inject(FormBuilder);
  authService = inject(Auth);
  private router = inject(Router);
  loading = signal(false);
  submitted = signal(false);
  registerForm: FormGroup;
  errorMessage = signal<string>('');


  constructor() {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  register() {
    this.submitted.set(true);
    if (this.registerForm.valid) {
      this.loading.set(true);
      const { email, username, password } = this.registerForm.value;
      this.authService.register(email, username, password).subscribe({
        next: (_) => {
          this.loading.set(false);
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Registration error:', error);
          this.errorMessage.set(error?.error?.errors?.error_code ?? 'Error en el registro, Inténtalo de nuevo.');
          this.loading.set(false);
        }
      });
    }
  }
}
