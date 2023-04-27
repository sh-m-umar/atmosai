import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftNotificationTrayComponent } from './left-notification-tray.component';

describe('LeftNotificationTrayComponent', () => {
  let component: LeftNotificationTrayComponent;
  let fixture: ComponentFixture<LeftNotificationTrayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeftNotificationTrayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeftNotificationTrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
