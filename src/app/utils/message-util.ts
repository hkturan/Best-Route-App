import {MessageService} from 'primeng/api';
import {EnumMessageSeverity} from '../enums/enum-message-severity';
import {HttpErrorResponse} from '@angular/common/http';

export class MessageUtil {

  static messageService: MessageService;

  static setMessageService(messageService: MessageService): void {
    this.messageService = messageService;
  }

  static showMessage(messageSeverity: EnumMessageSeverity, details: string, summary?: string): void {
    this.messageService.add({
      key: 'generalToast',
      severity: messageSeverity.severity,
      summary: summary ? summary : messageSeverity.text,
      detail: details
    });
  }

  static showHttpError(error: HttpErrorResponse): void {
    this.showMessage(EnumMessageSeverity.ERROR, error.error.detailedError.message, error.status + ' ' + error.error.detailedError.code);
  }

}
