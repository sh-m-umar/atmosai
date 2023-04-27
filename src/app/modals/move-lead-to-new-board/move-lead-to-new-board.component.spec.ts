import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveLeadToNewBoardComponent } from './move-lead-to-new-board.component';

describe('MoveLeadToNewBoardComponent', () => {
  let component: MoveLeadToNewBoardComponent;
  let fixture: ComponentFixture<MoveLeadToNewBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoveLeadToNewBoardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoveLeadToNewBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
