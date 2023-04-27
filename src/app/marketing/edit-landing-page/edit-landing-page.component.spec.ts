import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLandingPageComponent } from './edit-landing-page.component';

describe('EditLandingPageComponent', () => {
  let component: EditLandingPageComponent;
  let fixture: ComponentFixture<EditLandingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditLandingPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
