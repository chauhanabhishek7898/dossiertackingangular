import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryAndShippingPloicyComponent } from './delivery-and-shipping-ploicy.component';

describe('DeliveryAndShippingPloicyComponent', () => {
  let component: DeliveryAndShippingPloicyComponent;
  let fixture: ComponentFixture<DeliveryAndShippingPloicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryAndShippingPloicyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryAndShippingPloicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
