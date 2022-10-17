import {Enum, EnumType} from 'ts-jenum';

@Enum('text')
export class EnumCounterType extends EnumType<EnumCounterType>() {

  static readonly ROUTE = new EnumCounterType(1, 'Route');
  static readonly LINE = new EnumCounterType(2, 'Line');

  private constructor(readonly code: number, readonly text: string) {
    super();
  }
}
