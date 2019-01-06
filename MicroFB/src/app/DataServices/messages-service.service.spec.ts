import { TestBed, inject } from '@angular/core/testing';

import { MessagesServiceService } from './messages-service.service';

describe('MessagesServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MessagesServiceService]
    });
  });

  it('should be created', inject([MessagesServiceService], (service: MessagesServiceService) => {
    expect(service).toBeTruthy();
  }));
});
