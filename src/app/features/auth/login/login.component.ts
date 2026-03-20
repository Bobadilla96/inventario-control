import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

interface DemoAccess {
  email: string;
  password: string;
  role: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  readonly form = this.fb.nonNullable.group({
    email: ['admin@inventario.com', [Validators.required, Validators.email]],
    password: ['admin123', [Validators.required, Validators.minLength(6)]]
  });

  readonly demoAccess: DemoAccess[] = [
    { email: 'admin@inventario.com', password: 'admin123', role: 'Admin' },
    { email: 'almacen@inventario.com', password: 'almacen123', role: 'Almacenista' },
    { email: 'analista@inventario.com', password: 'analista123', role: 'Analista' }
  ];

  loading = false;
  error = '';
  selectedEmail = 'admin@inventario.com';

  constructor(
    private readonly fb: FormBuilder,
    private readonly auth: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  fill(access: DemoAccess): void {
    this.selectedEmail = access.email;
    this.form.setValue({ email: access.email, password: access.password });
  }

  submit(): void {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    this.error = '';
    this.loading = true;

    const { email, password } = this.form.getRawValue();
    this.auth
      .login(email, password)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/dashboard';
          this.router.navigateByUrl(returnUrl);
        },
        error: (err: Error) => {
          this.error = err.message;
        }
      });
  }
}
