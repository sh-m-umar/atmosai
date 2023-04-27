import { TestBed } from '@angular/core/testing';

import { GlobalFunctionService } from './global-function.service';

describe('GlobalFunctionService', () => {
  let service: GlobalFunctionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalFunctionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
