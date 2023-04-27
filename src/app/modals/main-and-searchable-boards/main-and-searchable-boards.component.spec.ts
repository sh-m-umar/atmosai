import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainAndSearchableBoardsComponent } from './main-and-searchable-boards.component';

describe('MainAndSearchableBoardsComponent', () => {
  let component: MainAndSearchableBoardsComponent;
  let fixture: ComponentFixture<MainAndSearchableBoardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainAndSearchableBoardsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainAndSearchableBoardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
