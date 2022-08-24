import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSignupMasterComponent } from './admin-signup-master.component';

describe('AdminSignupMasterComponent', () => {
  let component: AdminSignupMasterComponent;
  let fixture: ComponentFixture<AdminSignupMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminSignupMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSignupMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
