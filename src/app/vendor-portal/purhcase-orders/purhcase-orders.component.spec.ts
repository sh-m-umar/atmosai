import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurhcaseOrdersComponent } from './purhcase-orders.component';

describe('PurhcaseOrdersComponent', () => {
  let component: PurhcaseOrdersComponent;
  let fixture: ComponentFixture<PurhcaseOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurhcaseOrdersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurhcaseOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
