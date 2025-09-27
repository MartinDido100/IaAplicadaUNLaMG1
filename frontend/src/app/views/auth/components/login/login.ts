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
        error: () => {
          this.loading.set(false);
        }
      });
    }
  }
}
