import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivateRevokeAssistantsComponent } from './activate-revoke-assistants.component';

describe('ActivateRevokeAssistantsComponent', () => {
  let component: ActivateRevokeAssistantsComponent;
  let fixture: ComponentFixture<ActivateRevokeAssistantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivateRevokeAssistantsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivateRevokeAssistantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
