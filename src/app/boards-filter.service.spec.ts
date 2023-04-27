import { TestBed } from '@angular/core/testing';

import { BoardsFilterService } from './boards-filter.service';

describe('BoardsFilterService', () => {
  let service: BoardsFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoardsFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
