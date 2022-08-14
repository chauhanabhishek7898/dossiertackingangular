import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceSubTypeMasterComponent } from './service-sub-type-master.component';

describe('ServiceSubTypeMasterComponent', () => {
  let component: ServiceSubTypeMasterComponent;
  let fixture: ComponentFixture<ServiceSubTypeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceSubTypeMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceSubTypeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
