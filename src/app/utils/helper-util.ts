import {Constants} from '../helper/constants';

export class HelperUtil {

  /**
   * Get image from assets folder (image path)
   * @param fileName : File name
   * @returns string : image full url
   */
  static getImageFromAssets(fileName: string): string {
    return 'url(\'' + Constants.IMAGE_PATH + fileName + '\')';
  }

}
