import { TestBed } from '@angular/core/testing';

import { ModuleItemsService } from './module-items.service';

describe('ModuleItemsService', () => {
  let service: ModuleItemsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModuleItemsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
