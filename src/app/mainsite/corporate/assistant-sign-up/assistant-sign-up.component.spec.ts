import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistantSignUpComponent } from './assistant-sign-up.component';

describe('AssistantSignUpComponent', () => {
  let component: AssistantSignUpComponent;
  let fixture: ComponentFixture<AssistantSignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssistantSignUpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistantSignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
