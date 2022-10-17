import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepSelectStartPointComponent } from './step-select-start-point.component';

describe('StepSelectStartPointComponent', () => {
  let component: StepSelectStartPointComponent;
  let fixture: ComponentFixture<StepSelectStartPointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StepSelectStartPointComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepSelectStartPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
