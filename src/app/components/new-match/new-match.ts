import { Component, signal, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { MatchesFirestoreService } from '../../services/matches-firestore.service';
import { GolfCoursesFirestoreService } from '../../services/golf-courses-firestore.service';
import { IGolfCourse } from '../../models/golf-course.model';
import { Router, RouterLink } from '@angular/router';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-new-match',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIcon,
    RouterLink
],
  templateUrl: './new-match.html',
  styleUrl: './new-match.css',
})
export class NewMatch {
  private readonly matchesFirestore = inject(MatchesFirestoreService);
  private readonly golfCoursesService = inject(GolfCoursesFirestoreService);
  private readonly router = inject(Router);

  readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(50)] }),
    golfCourseId: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });

  get name() {
    return this.form.get('name') as FormControl<string>;
  }

  get golfCourseId() {
    return this.form.get('golfCourseId') as FormControl<string>;
  }

  readonly golfCourses = signal<IGolfCourse[]>([]);
  readonly loadingCourses = signal(true);
  readonly coursesError = signal<string | null>(null);

  constructor() {
    // Fetch golf courses for dropdown
    this.golfCoursesService.getAllGolfCourses()
      .then(courses => {
        this.golfCourses.set(courses);
        this.loadingCourses.set(false);
      })
      .catch(() => {
        this.coursesError.set('Failed to load golf courses');
        this.loadingCourses.set(false);
      });
  }

  async onSubmit() {
    if (this.form.invalid) return;
    try {
      let matchId: string = await this.matchesFirestore.addMatch(this.name.value ?? '', this.golfCourseId.value ?? '');
      this.router.navigate(['/play-match', matchId]);
    } catch (err) {
      // TODO: show error to user
      console.error('Failed to create match:', err);
    }
  }
}
