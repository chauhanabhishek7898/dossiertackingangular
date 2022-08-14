import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherRolesProfileComponent } from './other-roles-profile.component';

describe('OtherRolesProfileComponent', () => {
  let component: OtherRolesProfileComponent;
  let fixture: ComponentFixture<OtherRolesProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtherRolesProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherRolesProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
