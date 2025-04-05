import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaMaestraComponent } from './tabla-maestra.component';

describe('TablaMaestraComponent', () => {
  let component: TablaMaestraComponent;
  let fixture: ComponentFixture<TablaMaestraComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TablaMaestraComponent]
    });
    fixture = TestBed.createComponent(TablaMaestraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
