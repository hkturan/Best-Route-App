import {Enum, EnumType} from 'ts-jenum';

@Enum('severity')
export class EnumMessageSeverity extends EnumType<EnumMessageSeverity>() {

  static readonly SUCCESS = new EnumMessageSeverity('success', 'Success');
  static readonly INFO = new EnumMessageSeverity('info', 'Info');
  static readonly WARNING = new EnumMessageSeverity('warn', 'Warning');
  static readonly ERROR = new EnumMessageSeverity('error', 'Error');

  private constructor(readonly severity: string, readonly text: string) {
    super();
  }
}
