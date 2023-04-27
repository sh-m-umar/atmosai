import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialsDashboardComponent } from './financials-dashboard.component';

describe('FinancialsDashboardComponent', () => {
  let component: FinancialsDashboardComponent;
  let fixture: ComponentFixture<FinancialsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinancialsDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
