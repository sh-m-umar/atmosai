import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSmsSequenceComponent } from './edit-sms-sequence.component';

describe('EditSmsSequenceComponent', () => {
  let component: EditSmsSequenceComponent;
  let fixture: ComponentFixture<EditSmsSequenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSmsSequenceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSmsSequenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
