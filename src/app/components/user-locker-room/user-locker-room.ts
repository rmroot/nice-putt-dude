import { Component, computed, inject } from '@angular/core';
import { UserFriends } from "./user-friends/user-friends";
import { UserService } from '../../services/user.service';
import { MatCard, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-user-locker-room',
  imports: [MatCardHeader, MatCard, MatCardTitle, UserFriends, MatIcon],
  templateUrl: './user-locker-room.html',
  styleUrl: './user-locker-room.css',
})
export class UserLockerRoom {
  private readonly userService = inject(UserService);
  readonly user = computed(() => this.userService.user());
}
