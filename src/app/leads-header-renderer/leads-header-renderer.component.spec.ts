import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsHeaderRendererComponent } from './leads-header-renderer.component';

describe('LeadsHeaderRendererComponent', () => {
  let component: LeadsHeaderRendererComponent;
  let fixture: ComponentFixture<LeadsHeaderRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadsHeaderRendererComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadsHeaderRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
