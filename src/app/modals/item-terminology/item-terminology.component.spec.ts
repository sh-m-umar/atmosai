import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemTerminologyComponent } from './item-terminology.component';

describe('ItemTerminologyComponent', () => {
  let component: ItemTerminologyComponent;
  let fixture: ComponentFixture<ItemTerminologyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemTerminologyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemTerminologyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
