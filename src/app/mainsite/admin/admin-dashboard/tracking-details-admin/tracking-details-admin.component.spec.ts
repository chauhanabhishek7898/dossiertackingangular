import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingDetailsAdminComponent } from './tracking-details-admin.component';

describe('TrackingDetailsAdminComponent', () => {
  let component: TrackingDetailsAdminComponent;
  let fixture: ComponentFixture<TrackingDetailsAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackingDetailsAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackingDetailsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
