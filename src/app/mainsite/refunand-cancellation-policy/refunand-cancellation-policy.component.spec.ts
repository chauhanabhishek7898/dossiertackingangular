import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefunandCancellationPolicyComponent } from './refunand-cancellation-policy.component';

describe('RefunandCancellationPolicyComponent', () => {
  let component: RefunandCancellationPolicyComponent;
  let fixture: ComponentFixture<RefunandCancellationPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefunandCancellationPolicyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RefunandCancellationPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
