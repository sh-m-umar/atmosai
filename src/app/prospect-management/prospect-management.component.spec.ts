import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProspectManagementComponent } from './prospect-management.component';

describe('ProspectManagementComponent', () => {
  let component: ProspectManagementComponent;
  let fixture: ComponentFixture<ProspectManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProspectManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProspectManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
