import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaFilesComponent } from './media-files.component';

describe('MediaFilesComponent', () => {
  let component: MediaFilesComponent;
  let fixture: ComponentFixture<MediaFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediaFilesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
