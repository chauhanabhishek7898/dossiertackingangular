import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeCorporateEmailIdComponent } from './change-corporate-email-id.component';

describe('ChangeCorporateEmailIdComponent', () => {
  let component: ChangeCorporateEmailIdComponent;
  let fixture: ComponentFixture<ChangeCorporateEmailIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeCorporateEmailIdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeCorporateEmailIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
