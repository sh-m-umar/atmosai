import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEmailSequenceComponent } from './edit-email-sequence.component';

describe('EditEmailSequenceComponent', () => {
  let component: EditEmailSequenceComponent;
  let fixture: ComponentFixture<EditEmailSequenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditEmailSequenceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditEmailSequenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
