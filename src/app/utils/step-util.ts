import {Step} from '../entities/step';
import {EnumStep} from '../enums/enum-step';

export class StepUtil {

  static steps: Step[] = [];

  /**
   * get All Steps
   * @returns Step[] : Step List
   */
  static getSteps(): Step[] {
    if (this.steps.length === 0) {
      this.createSteps();
    }
    return this.steps;
  }

  /**
   * Creates steps for route plan
   */
  static createSteps(): void {
    this.steps = [
      {label: 'Step 1', header: 'Select Start Point', index: 0, successMessage: 'You selected Start Point', infoMessage: '', value: EnumStep.SELECT_START_POINT},
      {label: 'Step 2', header: 'Select Marker(s) for Route', index: 1, successMessage: 'You selected Marker(s)', infoMessage: '', value: EnumStep.MARKER_SELECTION},
      {label: 'Step 3', header: 'You can select End Point (Optional)', index: 2, successMessage: '', infoMessage: '', value: EnumStep.SELECT_END_POINT},
      {label: 'Step 4', header: 'Choose Route Plan', index: 3, successMessage: 'Route Plan is Ready', infoMessage: 'You can reorder', value: EnumStep.PREVIEW_ROUTE_PLAN}
    ];
  }

  /**
   * get Step with Index
   * @param index : index to search
   * @returns Step : Finding step
   */
  static getStepWithIndex(index: number): Step {
    const step = this.steps.find(e => e.index === index) as Step;
    if (!step) {
      // TODO : ERROR
    }
    return step;
  }

  /**
   * get Next Step
   * @param currentStep : Current step
   * @returns Step : next of current step
   */
  static getNextStep(currentStep: Step): Step {
    const nextStep = this.steps.find(e => e.index === currentStep.index + 1) as Step;
    if (!nextStep) {
      // TODO : ERROR
    }
    return nextStep;
  }

  /**
   * get Back Step
   * @param currentStep : Current step
   * @returns Step : back of current step
   */
  static getBackStep(currentStep: Step): Step {
    const backStep = this.steps.find(e => e.index === currentStep.index - 1) as Step;
    if (!backStep) {
      // TODO : ERROR
    }
    return backStep;
  }

}
