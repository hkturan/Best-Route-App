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
      {label: 'Step 2', header: 'Select Destination Point(s)', index: 1, successMessage: 'You selected Destination Point(s)', infoMessage: '', value: EnumStep.MARKER_SELECTION},
      {label: 'Step 3', header: 'You can select End Point (Optional)', index: 2, successMessage: '', infoMessage: '', value: EnumStep.SELECT_END_POINT},
      {label: 'Step 4', header: '', index: 3, successMessage: 'Route Plan is Ready', infoMessage: 'You can reorder', value: EnumStep.PREVIEW_ROUTE_PLAN}
    ];
  }

  /**
   * get Step with Index
   * @param index : index to search
   * @returns Step : Found step
   */
  static getStepWithIndex(index: number): Step {
    const step = this.steps.find(e => e.index === index) as Step;
    if (!step) {
      throw new Error('Step object cannot be empty!');
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
      throw new Error('Next step object cannot be empty!');
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
      throw new Error('Back Step object cannot be empty!');
    }
    return backStep;
  }

}
