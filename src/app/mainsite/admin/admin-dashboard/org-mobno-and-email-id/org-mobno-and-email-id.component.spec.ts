import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgMobnoAndEmailIdComponent } from './org-mobno-and-email-id.component';

describe('OrgMobnoAndEmailIdComponent', () => {
  let component: OrgMobnoAndEmailIdComponent;
  let fixture: ComponentFixture<OrgMobnoAndEmailIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrgMobnoAndEmailIdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgMobnoAndEmailIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
