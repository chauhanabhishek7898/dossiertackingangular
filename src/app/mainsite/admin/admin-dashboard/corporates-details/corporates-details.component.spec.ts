import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporatesDetailsComponent } from './corporates-details.component';

describe('CorporatesDetailsComponent', () => {
  let component: CorporatesDetailsComponent;
  let fixture: ComponentFixture<CorporatesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorporatesDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorporatesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
