import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicateBoardModalComponent } from './duplicate-board-modal.component';

describe('DuplicateBoardModalComponent', () => {
  let component: DuplicateBoardModalComponent;
  let fixture: ComponentFixture<DuplicateBoardModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DuplicateBoardModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DuplicateBoardModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
