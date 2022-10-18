import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepPreviewRoutePlanComponent } from './step-preview-route-plan.component';

describe('StepPreviewRoutePlanComponent', () => {
  let component: StepPreviewRoutePlanComponent;
  let fixture: ComponentFixture<StepPreviewRoutePlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StepPreviewRoutePlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepPreviewRoutePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
