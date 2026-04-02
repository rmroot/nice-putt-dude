import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGolfCourse } from './create-golf-course';

describe('CreateGolfCourse', () => {
  let component: CreateGolfCourse;
  let fixture: ComponentFixture<CreateGolfCourse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateGolfCourse],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateGolfCourse);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
