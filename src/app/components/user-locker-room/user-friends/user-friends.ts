import { Component, computed, inject, signal } from '@angular/core';
import { FriendshipsFirestoreService } from '../../../services/friendships-firestore.service';
import { IFriendship } from '../../../models/friendship.model';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatError } from '@angular/material/form-field';
import { UserService } from '../../../services/user.service';
import { PublicUsersFirestoreService } from '../../../services/public-users-firestore.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-user-friends',
  imports: [RouterLink, MatCardModule, MatListModule, MatProgressSpinnerModule, MatError, MatIcon],
  templateUrl: './user-friends.html',
  styleUrl: './user-friends.css',
})
export class UserFriends {
  private readonly friendshipsService = inject(FriendshipsFirestoreService);
  private readonly publicUsersService = inject(PublicUsersFirestoreService);
  readonly friendships = signal<IFriendship[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  private readonly userService = inject(UserService);
  readonly user = computed(() => this.userService.user());
  // Map of userId to displayName
  readonly friendNames = signal<Record<string, string>>({});

  constructor() {
    this.friendshipsService.getFriendshipsForCurrentUser()
      .then(async friendships => {
        this.friendships.set(friendships);
        // For each friendship, get the other user's id
        const userId = this.user()?.uid;
        if (!userId) {
          this.loading.set(false);
          return;
        }
        const ids = friendships.map(f => f.user1Id === userId ? f.user2Id : f.user1Id);
        // Remove duplicates
        const uniqueIds = Array.from(new Set(ids));
        const names: Record<string, string> = {};
        await Promise.all(uniqueIds.map(async id => {
          const user = await this.publicUsersService.getPublicUserByUserId(id);
          if (user) names[id] = user.displayName;
        }));
        this.friendNames.set(names);
        this.loading.set(false);
      })
      .catch(err => {
        this.error.set('Failed to load friends');
        this.loading.set(false);
      });
  }
}
