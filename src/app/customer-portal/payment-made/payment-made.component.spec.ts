import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentMadeComponent } from './payment-made.component';

describe('PaymentMadeComponent', () => {
  let component: PaymentMadeComponent;
  let fixture: ComponentFixture<PaymentMadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentMadeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentMadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
