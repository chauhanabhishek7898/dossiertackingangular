import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitTimeChargesComponent } from './wait-time-charges.component';

describe('WaitTimeChargesComponent', () => {
  let component: WaitTimeChargesComponent;
  let fixture: ComponentFixture<WaitTimeChargesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WaitTimeChargesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitTimeChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
