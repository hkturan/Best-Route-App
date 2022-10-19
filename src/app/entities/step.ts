import {EnumStep} from '../enums/enum-step';

export interface Step {
  label: string;
  header: string;
  index: number;
  successMessage: string;
  infoMessage: string;
  value: EnumStep;
}

export class Step {
  constructor() {
  }
}
