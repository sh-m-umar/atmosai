import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDuplicateModalComponent } from './manage-duplicate-modal.component';

describe('ManageDuplicateModalComponent', () => {
  let component: ManageDuplicateModalComponent;
  let fixture: ComponentFixture<ManageDuplicateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageDuplicateModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageDuplicateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
