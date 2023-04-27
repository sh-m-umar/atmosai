import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupEnrollmentComponent } from './group-enrollment.component';

describe('GroupEnrollmentComponent', () => {
  let component: GroupEnrollmentComponent;
  let fixture: ComponentFixture<GroupEnrollmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupEnrollmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupEnrollmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
