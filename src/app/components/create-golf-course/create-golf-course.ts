import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { MatFormField, MatHint, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatDivider } from '@angular/material/divider';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { GolfCoursesFirestoreService } from '../../services/golf-courses-firestore.service';
import { IGolfCourse } from '../../models/golf-course.model';

@Component({
  selector: 'app-create-golf-course',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormField,
    MatLabel,
    MatError,
    MatHint,
    MatInput,
    MatButton,
    MatIconButton,
    MatIcon,
    MatProgressSpinner,
    MatDivider,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
  ],
  templateUrl: './create-golf-course.html',
  styleUrl: './create-golf-course.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateGolfCourse {
  private readonly router = inject(Router);
  private readonly golfCoursesService = inject(GolfCoursesFirestoreService);

  readonly submitting = signal(false);
  readonly submitError = signal<string | null>(null);

  readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(50)] }),
    holes: new FormGroup({
      hole1: new FormControl(4, { nonNullable: true, validators: [Validators.required, Validators.min(3), Validators.max(6)] }),
      hole2: new FormControl(4, { nonNullable: true, validators: [Validators.required, Validators.min(3), Validators.max(6)] }),
      hole3: new FormControl(4, { nonNullable: true, validators: [Validators.required, Validators.min(3), Validators.max(6)] }),
      hole4: new FormControl(4, { nonNullable: true, validators: [Validators.required, Validators.min(3), Validators.max(6)] }),
      hole5: new FormControl(4, { nonNullable: true, validators: [Validators.required, Validators.min(3), Validators.max(6)] }),
      hole6: new FormControl(4, { nonNullable: true, validators: [Validators.required, Validators.min(3), Validators.max(6)] }),
      hole7: new FormControl(4, { nonNullable: true, validators: [Validators.required, Validators.min(3), Validators.max(6)] }),
      hole8: new FormControl(4, { nonNullable: true, validators: [Validators.required, Validators.min(3), Validators.max(6)] }),
      hole9: new FormControl(4, { nonNullable: true, validators: [Validators.required, Validators.min(3), Validators.max(6)] }),
      hole10: new FormControl(4, { nonNullable: true, validators: [Validators.required, Validators.min(3), Validators.max(6)] }),
      hole11: new FormControl(4, { nonNullable: true, validators: [Validators.required, Validators.min(3), Validators.max(6)] }),
      hole12: new FormControl(4, { nonNullable: true, validators: [Validators.required, Validators.min(3), Validators.max(6)] }),
      hole13: new FormControl(4, { nonNullable: true, validators: [Validators.required, Validators.min(3), Validators.max(6)] }),
      hole14: new FormControl(4, { nonNullable: true, validators: [Validators.required, Validators.min(3), Validators.max(6)] }),
      hole15: new FormControl(4, { nonNullable: true, validators: [Validators.required, Validators.min(3), Validators.max(6)] }),
      hole16: new FormControl(4, { nonNullable: true, validators: [Validators.required, Validators.min(3), Validators.max(6)] }),
      hole17: new FormControl(4, { nonNullable: true, validators: [Validators.required, Validators.min(3), Validators.max(6)] }),
      hole18: new FormControl(4, { nonNullable: true, validators: [Validators.required, Validators.min(3), Validators.max(6)] }),
    })
  });

  //front 9 and back 9 hole counts for template iteration
  front9: Array<number> = Array.from({ length: 9 }, (_, i) => i + 1);
  back9: Array<number> = Array.from({ length: 9 }, (_, i) => i + 10);

  get name() {
    return this.form.get('name') as FormControl<string>;
  }

  get holes() {
    return this.form.get('holes') as FormGroup;
  }

  getHoleControl(hole: string) {
    return this.holes.get(hole) as FormControl<number>;
  }

  incrementPar(hole: string) {
    const control = this.getHoleControl(hole);
    if (control.value < 6) control.setValue(control.value + 1);
  }

  decrementPar(hole: string) {
    const control = this.getHoleControl(hole);
    if (control.value > 3) control.setValue(control.value - 1);
  }

  async onSubmit() {
    if (this.form.invalid || this.submitting()) return;
    const holesRaw = this.holes.value;
    const holes = {
      hole1: { par: holesRaw?.hole1 ?? 4 },
      hole2: { par: holesRaw?.hole2 ?? 4 },
      hole3: { par: holesRaw?.hole3 ?? 4 },
      hole4: { par: holesRaw?.hole4 ?? 4 },
      hole5: { par: holesRaw?.hole5 ?? 4 },
      hole6: { par: holesRaw?.hole6 ?? 4 },
      hole7: { par: holesRaw?.hole7 ?? 4 },
      hole8: { par: holesRaw?.hole8 ?? 4 },
      hole9: { par: holesRaw?.hole9 ?? 4 },
      hole10: { par: holesRaw?.hole10 ?? 4 },
      hole11: { par: holesRaw?.hole11 ?? 4 },
      hole12: { par: holesRaw?.hole12 ?? 4 },
      hole13: { par: holesRaw?.hole13 ?? 4 },
      hole14: { par: holesRaw?.hole14 ?? 4 },
      hole15: { par: holesRaw?.hole15 ?? 4 },
      hole16: { par: holesRaw?.hole16 ?? 4 },
      hole17: { par: holesRaw?.hole17 ?? 4 },
      hole18: { par: holesRaw?.hole18 ?? 4 },
    };
    const course: IGolfCourse = {
      id: '',
      name: this.name.value ?? '',
      holes,
    };
    this.submitting.set(true);
    this.submitError.set(null);
    try {
      await this.golfCoursesService.addGolfCourse(course);
      this.router.navigate(['/new-match']);
    } catch {
      this.submitError.set('Failed to create golf course. Please try again.');
      this.submitting.set(false);
    }
  }
  get front9Total(): number {
    return this.front9.reduce((sum, n) => sum + (this.getHoleControl('hole' + n).value ?? 4), 0);
  }

  get back9Total(): number {
    return this.back9.reduce((sum, n) => sum + (this.getHoleControl('hole' + n).value ?? 4), 0);
  }

  get totalPar(): number {
    return this.front9Total + this.back9Total;
  }
}
