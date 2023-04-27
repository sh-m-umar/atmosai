import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RightSidebarTrayComponent } from './right-sidebar-tray.component';

describe('RightSidebarTrayComponent', () => {
  let component: RightSidebarTrayComponent;
  let fixture: ComponentFixture<RightSidebarTrayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RightSidebarTrayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RightSidebarTrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
