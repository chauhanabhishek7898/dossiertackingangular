import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAddressesCorporationComponent } from './manage-addresses-corporation.component';

describe('ManageAddressesCorporationComponent', () => {
  let component: ManageAddressesCorporationComponent;
  let fixture: ComponentFixture<ManageAddressesCorporationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageAddressesCorporationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAddressesCorporationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
