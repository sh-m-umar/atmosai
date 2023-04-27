import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarCommonComponent } from './calendar-common.component';

describe('CalendarCommonComponent', () => {
  let component: CalendarCommonComponent;
  let fixture: ComponentFixture<CalendarCommonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalendarCommonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
