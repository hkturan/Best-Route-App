import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepSelectEndPointComponent } from './step-select-end-point.component';

describe('StepSelectEndPointComponent', () => {
  let component: StepSelectEndPointComponent;
  let fixture: ComponentFixture<StepSelectEndPointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StepSelectEndPointComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepSelectEndPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
