import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsCommonRendererComponent } from './leads-common-renderer.component';

describe('LeadsCommonRendererComponent', () => {
  let component: LeadsCommonRendererComponent;
  let fixture: ComponentFixture<LeadsCommonRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadsCommonRendererComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadsCommonRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
