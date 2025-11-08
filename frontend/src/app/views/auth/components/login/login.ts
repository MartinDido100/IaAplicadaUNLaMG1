import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Logo } from '../../../../shared/logo/logo';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../../../services/auth';
import { Router, RouterLink } from '@angular/router';
import { Spinner } from '../../../../shared/spinner/spinner';

@Component({
  selector: 'app-login',
  imports: [Logo, ReactiveFormsModule, Spinner, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Login {
  private fb = inject(FormBuilder);
  aS = inject(Auth);
  private router = inject(Router);
  form: FormGroup;
  loading = signal(false);
  loginError = signal('');
  submitted = signal(false);

  constructor() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  login() {
    this.submitted.set(true);
    if (this.form.valid) {
      this.loading.set(true);
      this.aS.login(this.form.value.email, this.form.value.password).subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/']);
        },
        error: (e) => {
          this.loading.set(false);
          this.loginError.set(e?.error?.errors?.error_code || 'Correo electrónico o contraseña incorrectos');
        }
      });
    }
  }
}
