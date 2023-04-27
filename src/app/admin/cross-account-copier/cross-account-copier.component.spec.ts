import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrossAccountCopierComponent } from './cross-account-copier.component';

describe('CrossAccountCopierComponent', () => {
  let component: CrossAccountCopierComponent;
  let fixture: ComponentFixture<CrossAccountCopierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrossAccountCopierComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrossAccountCopierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
