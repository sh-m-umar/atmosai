import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSequenceComponent } from './edit-sequence.component';

describe('EditSequenceComponent', () => {
  let component: EditSequenceComponent;
  let fixture: ComponentFixture<EditSequenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSequenceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSequenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
