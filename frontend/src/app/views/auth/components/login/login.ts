import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Logo } from '../../../../shared/logo/logo';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [Logo, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Login {
  private fb = inject(FormBuilder);
  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      username: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }
}
