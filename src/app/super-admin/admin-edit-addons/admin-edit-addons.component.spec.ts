import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditAddonsComponent } from './admin-edit-addons.component';

describe('AdminEditAddonsComponent', () => {
  let component: AdminEditAddonsComponent;
  let fixture: ComponentFixture<AdminEditAddonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminEditAddonsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEditAddonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
