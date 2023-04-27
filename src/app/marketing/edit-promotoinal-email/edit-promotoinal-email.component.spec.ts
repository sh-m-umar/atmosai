import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPromotoinalEmailComponent } from './edit-promotoinal-email.component';

describe('EditPromotoinalEmailComponent', () => {
  let component: EditPromotoinalEmailComponent;
  let fixture: ComponentFixture<EditPromotoinalEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPromotoinalEmailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPromotoinalEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
