import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomersSavedAddressesMasterComponent } from './customers-saved-addresses-master.component';

describe('CustomersSavedAddressesMasterComponent', () => {
  let component: CustomersSavedAddressesMasterComponent;
  let fixture: ComponentFixture<CustomersSavedAddressesMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomersSavedAddressesMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomersSavedAddressesMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
