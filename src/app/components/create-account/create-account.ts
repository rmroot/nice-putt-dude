import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AbstractControl, FormGroup, FormControl, ValidationErrors, Validators, ReactiveFormsModule } from '@angular/forms';
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

function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  if (password && confirmPassword && password !== confirmPassword) {
    return { passwordsMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-create-account',
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
  templateUrl: './create-account.html',
  styleUrl: './create-account.css',
})
export class CreateAccount {
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  readonly form = new FormGroup(
    {
      email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
      password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
      confirmPassword: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    },
    { validators: passwordsMatchValidator },
  );

  readonly isLoading = signal(false);
  readonly isGoogleLoading = signal(false);
  readonly showPassword = signal(false);
  readonly showConfirmPassword = signal(false);
  readonly errorMessage = signal<string | null>(null);

  get email() {
    return this.form.get('email') as FormControl<string>;
  }

  get password() {
    return this.form.get('password') as FormControl<string>;
  }

  get confirmPassword() {
    return this.form.get('confirmPassword') as FormControl<string>;
  }

  togglePasswordVisibility() {
    this.showPassword.update(v => !v);
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword.update(v => !v);
  }

  async onSubmit() {
    if (this.form.invalid) return;
    this.errorMessage.set(null);
    this.isLoading.set(true);
    try {
      await this.userService.createAccountWithEmail(this.email.value, this.password.value);
      this.router.navigateByUrl('/');
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === 'auth/email-already-in-use') {
        this.errorMessage.set('An account with this email already exists.');
      } else if (code === 'auth/invalid-email') {
        this.errorMessage.set('The email address is invalid.');
      } else {
        this.errorMessage.set('Something went wrong. Please try again.');
      }
    } finally {
      this.isLoading.set(false);
    }
  }

  async signUpWithGoogle() {
    this.errorMessage.set(null);
    this.isGoogleLoading.set(true);
    try {
      await this.userService.signInWithGoogle();
      this.router.navigateByUrl('/');
    } catch {
      this.errorMessage.set('Google sign-up failed. Please try again.');
    } finally {
      this.isGoogleLoading.set(false);
    }
  }
}
