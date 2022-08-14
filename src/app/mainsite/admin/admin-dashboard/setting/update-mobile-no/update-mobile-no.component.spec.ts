import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateMobileNoComponent } from './update-mobile-no.component';

describe('UpdateMobileNoComponent', () => {
  let component: UpdateMobileNoComponent;
  let fixture: ComponentFixture<UpdateMobileNoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateMobileNoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateMobileNoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
