import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerStatementsComponent } from './customer-statements.component';

describe('CustomerStatementsComponent', () => {
  let component: CustomerStatementsComponent;
  let fixture: ComponentFixture<CustomerStatementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerStatementsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerStatementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
