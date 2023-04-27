import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailMarketingDashboardComponent } from './email-marketing-dashboard.component';

describe('EmailMarketingDashboardComponent', () => {
  let component: EmailMarketingDashboardComponent;
  let fixture: ComponentFixture<EmailMarketingDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailMarketingDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailMarketingDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
