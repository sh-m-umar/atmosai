import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectedAccountsComponent } from './connected-accounts.component';

describe('ConnectedAccountsComponent', () => {
  let component: ConnectedAccountsComponent;
  let fixture: ComponentFixture<ConnectedAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnectedAccountsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectedAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
