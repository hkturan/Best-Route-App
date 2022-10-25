import {MessageService} from 'primeng/api';
import {EnumMessageSeverity} from '../enums/enum-message-severity';
import {HttpErrorResponse} from '@angular/common/http';

export class MessageUtil {

  static messageService: MessageService;

  /**
   * set Message Service to util
   * @param messageService : Message Service
   */
  static setMessageService(messageService: MessageService): void {
    this.messageService = messageService;
  }

  /**
   * show Message on Application
   * @param messageSeverity : Severity of message
   * @param details : Details of message
   * @param summary : Summary of message (Optional)
   */
  static showMessage(messageSeverity: EnumMessageSeverity, details: string, summary?: string): void {
    this.messageService.add({
      key: 'generalToast',
      severity: messageSeverity.severity,
      summary: summary ? summary : messageSeverity.text,
      detail: details
    });
  }

  /**
   * show Error if tomtom api request fails
   * @param messageSeverity : Severity of message
   * @param details : Details of message
   * @param summary : Summary of message (Optional)
   */
  static showHttpError(error: HttpErrorResponse): void {
    this.showMessage(EnumMessageSeverity.ERROR, error.error.detailedError.message, error.status + ' ' + error.error.detailedError.code);
  }

}
