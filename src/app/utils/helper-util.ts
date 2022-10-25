import {Constants} from '../helper/constants';
import {CounterService} from '../services/counter.service';
import {EnumCounterType} from '../enums/enum-counter-type';

export class HelperUtil {

  static counterService: CounterService;

  /**
   * set Counter Service to util
   * @param counterService : Counter Service
   */
  static setCounterService(counterService: CounterService): void {
    this.counterService = counterService;
  }

  /**
   * Get image from assets folder (image path)
   * @param fileName : File name
   * @returns string : image full url
   */
  static getImageFromAssets(fileName: string): string {
    return 'url(\'' + Constants.IMAGE_PATH + fileName + '\')';
  }

  static getMarkerNextIdFromHtml(): string {
    return this.getNextId(document.querySelectorAll(`[id^="markerId"]`), Constants.MARKER_ID);
  }

  static getLineMarkerNextIdFromHtml(): string {
    return this.getNextId(document.querySelectorAll(`[id^="lineMarkerId"]`), Constants.LINE_MARKER_ID);
  }

  static getLineNextIdFromHtml(): string {
    return Constants.LINE_ID + this.counterService.getCounterValue(EnumCounterType.LINE);
  }

  static getNextId(elements: any, startsWith: string): string {
    let maxValue = 0;
    if (elements && elements instanceof NodeList && elements.length > 0) {
      for (const element of elements as unknown as any[]) {
        const id = element.id.replace(startsWith, '');
        if (Number(id) > maxValue) {
          maxValue = Number(id);
        }
      }
    }
    return startsWith + (++maxValue);
  }

}
