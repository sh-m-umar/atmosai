import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesPortalDashboardComponent } from './sales-portal-dashboard.component';

describe('SalesPortalDashboardComponent', () => {
  let component: SalesPortalDashboardComponent;
  let fixture: ComponentFixture<SalesPortalDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesPortalDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesPortalDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
