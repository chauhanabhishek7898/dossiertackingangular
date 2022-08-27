import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveCorporatesComponent } from './approve-corporates.component';

describe('ApproveCorporatesComponent', () => {
  let component: ApproveCorporatesComponent;
  let fixture: ComponentFixture<ApproveCorporatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveCorporatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveCorporatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
