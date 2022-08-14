import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KMLimitMasterComponent } from './kmlimit-master.component';

describe('KMLimitMasterComponent', () => {
  let component: KMLimitMasterComponent;
  let fixture: ComponentFixture<KMLimitMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KMLimitMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KMLimitMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
