import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemValueModalComponent } from './item-value-modal.component';

describe('ItemValueModalComponent', () => {
  let component: ItemValueModalComponent;
  let fixture: ComponentFixture<ItemValueModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemValueModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemValueModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
