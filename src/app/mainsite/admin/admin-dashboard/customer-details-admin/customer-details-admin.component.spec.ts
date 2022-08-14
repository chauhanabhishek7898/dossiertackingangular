import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDetailsAdminComponent } from './customer-details-admin.component';

describe('CustomerDetailsAdminComponent', () => {
  let component: CustomerDetailsAdminComponent;
  let fixture: ComponentFixture<CustomerDetailsAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerDetailsAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerDetailsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
