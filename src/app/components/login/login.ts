import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    RouterLink,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  readonly form = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
  });

  readonly isLoading = signal(false);
  readonly isGoogleLoading = signal(false);
  readonly showPassword = signal(false);
  readonly errorMessage = signal<string | null>(null);

  get email() {
    return this.form.get('email') as FormControl<string>;
  }

  get password() {
    return this.form.get('password') as FormControl<string>;
  }

  togglePasswordVisibility() {
    this.showPassword.update(v => !v);
  }

  async onSubmit() {
    if (this.form.invalid) return;
    this.errorMessage.set(null);
    this.isLoading.set(true);
    try {
      await this.userService.loginWithEmail(this.email.value, this.password.value);
      this.router.navigateByUrl('/');
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        this.errorMessage.set('Invalid email or password.');
      } else {
        this.errorMessage.set('Something went wrong. Please try again.');
      }
    } finally {
      this.isLoading.set(false);
    }
  }

  async signInWithGoogle() {
    this.errorMessage.set(null);
    this.isGoogleLoading.set(true);
    try {
      await this.userService.signInWithGoogle();
      this.router.navigateByUrl('/');
    } catch {
      this.errorMessage.set('Google sign-in failed. Please try again.');
    } finally {
      this.isGoogleLoading.set(false);
    }
  }
}
