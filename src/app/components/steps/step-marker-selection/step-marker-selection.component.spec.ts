import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepMarkerSelectionComponent } from './step-marker-selection.component';

describe('StepMarkerSelectionComponent', () => {
  let component: StepMarkerSelectionComponent;
  let fixture: ComponentFixture<StepMarkerSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StepMarkerSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepMarkerSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
