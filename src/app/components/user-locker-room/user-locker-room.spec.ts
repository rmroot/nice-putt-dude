import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLockerRoom } from './user-locker-room';

describe('UserLockerRoom', () => {
  let component: UserLockerRoom;
  let fixture: ComponentFixture<UserLockerRoom>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserLockerRoom],
    }).compileComponents();

    fixture = TestBed.createComponent(UserLockerRoom);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
