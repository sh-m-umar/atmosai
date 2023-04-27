import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesBrokerDashboardComponent } from './sales-broker-dashboard.component';

describe('SalesBrokerDashboardComponent', () => {
  let component: SalesBrokerDashboardComponent;
  let fixture: ComponentFixture<SalesBrokerDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesBrokerDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesBrokerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
