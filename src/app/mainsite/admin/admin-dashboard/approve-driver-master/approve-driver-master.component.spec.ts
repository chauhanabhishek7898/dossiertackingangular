import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveDriverMasterComponent } from './approve-driver-master.component';

describe('ApproveDriverMasterComponent', () => {
  let component: ApproveDriverMasterComponent;
  let fixture: ComponentFixture<ApproveDriverMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveDriverMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveDriverMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
