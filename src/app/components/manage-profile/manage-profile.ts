import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-manage-profile',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    RouterLink,
  ],
  templateUrl: './manage-profile.html',
  styleUrl: './manage-profile.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageProfile implements OnInit {
  private readonly userService = inject(UserService);
  readonly user = computed(() => this.userService.user());

  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);

  readonly form = new FormGroup({
    displayName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(50)],
    }),
    photoURL: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(500)],
    }),
  });

  get displayName() {
    return this.form.get('displayName') as FormControl<string>;
  }

  get photoURL() {
    return this.form.get('photoURL') as FormControl<string>;
  }

  ngOnInit() {
    const user = this.user();
    if (user) {
      if (user.displayName) this.displayName.setValue(user.displayName);
      if (user.photoURL) this.photoURL.setValue(user.photoURL);
    }
  }

  async onSubmit() {
    if (this.form.invalid || this.isLoading()) return;
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);
    try {
      await this.userService.updateProfile(
        this.displayName.value || null,
        this.photoURL.value || null,
      );
      this.successMessage.set('Profile updated successfully.');
    } catch {
      this.errorMessage.set('Failed to update profile. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }

  getInitials(): string {
    const name = this.user()?.displayName;
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }
}
