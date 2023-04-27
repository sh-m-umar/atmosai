import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTrayComponent } from './dashboard-tray.component';

describe('DashboardTrayComponent', () => {
  let component: DashboardTrayComponent;
  let fixture: ComponentFixture<DashboardTrayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardTrayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardTrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
