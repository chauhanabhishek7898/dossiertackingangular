import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverDetailsAdminComponent } from './driver-details-admin.component';

describe('DriverDetailsAdminComponent', () => {
  let component: DriverDetailsAdminComponent;
  let fixture: ComponentFixture<DriverDetailsAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverDetailsAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverDetailsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
