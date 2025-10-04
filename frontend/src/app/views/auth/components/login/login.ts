import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Logo } from '../../../../shared/logo/logo';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../../../services/auth';
import { Router } from '@angular/router';
import { Spinner } from '../../../../shared/spinner/spinner';

@Component({
  selector: 'app-login',
  imports: [Logo, ReactiveFormsModule, Spinner],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Login {
  private fb = inject(FormBuilder);
  private aS = inject(Auth);
  private router = inject(Router);
  form: FormGroup;
  loading = signal(false);
  loginError = signal('');

  constructor() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  login() {
    if (this.form.valid) {
      this.loading.set(true);
      this.aS.login(this.form.value.email).subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/']);
        },
        error: (e) => {
          this.loading.set(false);
          if (e.error.code === 404) {
            this.loginError.set('No se encontró un usuario con ese correo electrónico.');
          }
        }
      });
    }
  }
}
