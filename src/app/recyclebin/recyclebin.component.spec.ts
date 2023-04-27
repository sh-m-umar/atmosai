import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecyclebinComponent } from './recyclebin.component';

describe('RecyclebinComponent', () => {
  let component: RecyclebinComponent;
  let fixture: ComponentFixture<RecyclebinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecyclebinComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecyclebinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
