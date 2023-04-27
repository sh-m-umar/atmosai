import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingResourcesComponent } from './marketing-resources.component';

describe('MarketingResourcesComponent', () => {
  let component: MarketingResourcesComponent;
  let fixture: ComponentFixture<MarketingResourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketingResourcesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketingResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
