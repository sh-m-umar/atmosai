import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditSubscriptionsComponent } from './admin-edit-subscriptions.component';

describe('AdminEditSubscriptionsComponent', () => {
  let component: AdminEditSubscriptionsComponent;
  let fixture: ComponentFixture<AdminEditSubscriptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminEditSubscriptionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEditSubscriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
