import { TestBed, inject } from '@angular/core/testing';

import { UserDataServiceService } from './user-data-service.service';

describe('UserDataServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserDataServiceService]
    });
  });

  it('should be created', inject([UserDataServiceService], (service: UserDataServiceService) => {
    expect(service).toBeTruthy();
  }));
});
