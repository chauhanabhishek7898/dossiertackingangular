import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleRateMasterComponent } from './vehicle-rate-master.component';

describe('VehicleRateMasterComponent', () => {
  let component: VehicleRateMasterComponent;
  let fixture: ComponentFixture<VehicleRateMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleRateMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleRateMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
