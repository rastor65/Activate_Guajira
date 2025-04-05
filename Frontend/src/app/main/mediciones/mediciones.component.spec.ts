import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicionesComponent } from './mediciones.component';

describe('MedicionesComponent', () => {
  let component: MedicionesComponent;
  let fixture: ComponentFixture<MedicionesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MedicionesComponent]
    });
    fixture = TestBed.createComponent(MedicionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
