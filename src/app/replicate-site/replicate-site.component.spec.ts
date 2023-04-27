import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplicateSiteComponent } from './replicate-site.component';

describe('ReplicateSiteComponent', () => {
  let component: ReplicateSiteComponent;
  let fixture: ComponentFixture<ReplicateSiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReplicateSiteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReplicateSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
