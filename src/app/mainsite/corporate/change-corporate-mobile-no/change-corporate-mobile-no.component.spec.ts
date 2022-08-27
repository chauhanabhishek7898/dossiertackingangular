import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeCorporateMobileNoComponent } from './change-corporate-mobile-no.component';

describe('ChangeCorporateMobileNoComponent', () => {
  let component: ChangeCorporateMobileNoComponent;
  let fixture: ComponentFixture<ChangeCorporateMobileNoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeCorporateMobileNoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeCorporateMobileNoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
