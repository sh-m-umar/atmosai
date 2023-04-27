import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteMembersModalComponent } from './invite-members-modal.component';

describe('InviteMembersModalComponent', () => {
  let component: InviteMembersModalComponent;
  let fixture: ComponentFixture<InviteMembersModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InviteMembersModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InviteMembersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
