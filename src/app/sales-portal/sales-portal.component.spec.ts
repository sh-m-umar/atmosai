import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesPortalComponent } from './sales-portal.component';

describe('SalesPortalComponent', () => {
  let component: SalesPortalComponent;
  let fixture: ComponentFixture<SalesPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesPortalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
