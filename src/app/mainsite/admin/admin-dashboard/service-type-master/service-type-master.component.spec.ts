import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceTypeMasterComponent } from './service-type-master.component';

describe('ServiceTypeMasterComponent', () => {
  let component: ServiceTypeMasterComponent;
  let fixture: ComponentFixture<ServiceTypeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceTypeMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceTypeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
