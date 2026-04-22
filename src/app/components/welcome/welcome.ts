
import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../services/user.service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-welcome',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
],
  templateUrl: './welcome.html',
  styleUrl: './welcome.css',
})
export class Welcome {
  private readonly userService = inject(UserService);
  readonly user = computed(() => this.userService.user());

  login() {
    void this.userService.signInWithGoogle();
  }
}
