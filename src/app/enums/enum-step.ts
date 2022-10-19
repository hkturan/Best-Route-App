import {Enum, EnumType} from 'ts-jenum';

@Enum('name')
export class EnumStep extends EnumType<EnumStep>() {

  static readonly SELECT_START_POINT = new EnumStep('select-start-point', 'Select Start Point');
  static readonly MARKER_SELECTION = new EnumStep('marker-selection', 'Marker Selection');
  static readonly PREVIEW_ROUTE_PLAN = new EnumStep('preview-route-plan', 'Preview Route Plan');

  private constructor(readonly name: string, readonly text: string) {
    super();
  }
}
