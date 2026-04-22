import { Component, inject, computed, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatError, MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
// import { MatHintsModule } from '@angular/material/form-field';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-manage-profile',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatButton,
    MatIcon,
    MatCard,
    MatProgressSpinner,
    RouterLink,
    MatHint,
    MatError,
    MatCardContent,
    MatLabel,
    MatCardTitle,
    MatCardHeader

  ],
  templateUrl: './manage-profile.html',
  styleUrl: './manage-profile.css',
})
export class ManageProfile {
  private readonly userService = inject(UserService);
  readonly user = computed(() => this.userService.user());
  readonly isSubmitting = signal(false);
  readonly successMessage = signal<string | null>(null);

  readonly form = new FormGroup({
    displayName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(50)],
    }),
  });

  get displayName() {
    return this.form.get('displayName') as FormControl<string>;
  }

  ngOnInit() {
    // Pre-fill display name if available
    const user = this.user();
    if (user && user.displayName) {
      this.displayName.setValue(user.displayName);
    }
  }

  clearSuccessMessage() {
    this.successMessage.set(null);
  }

  async onSubmit() {
    if (this.form.invalid) return;
    this.isSubmitting.set(true);
    try {
      await this.userService.updateProfile(this.displayName.value ?? '', null);
      this.successMessage.set('Profile updated successfully!');
      setTimeout(() => this.clearSuccessMessage(), 3000);
    } catch (err) {
      // TODO: handle error (show message to user)
      console.error('Failed to update profile:', err);
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
