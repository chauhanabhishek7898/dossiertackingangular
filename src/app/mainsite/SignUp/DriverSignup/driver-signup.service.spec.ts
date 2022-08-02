import { TestBed } from '@angular/core/testing';

import { DriverSignupService } from './driver-signup.service';

describe('DriverSignupService', () => {
  let service: DriverSignupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DriverSignupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
