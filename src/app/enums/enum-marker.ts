import {Enum, EnumType} from 'ts-jenum';

@Enum('code')
export class EnumMarker extends EnumType<EnumMarker>() {

  static readonly GREEN_MARKER = new EnumMarker(1, 'Start Point', 'green-marker.png', '#2e8035', '32px', '32px', true);
  static readonly BLUE_MARKER = new EnumMarker(2, 'Destinations', 'blue-marker.png', '#0091ff', '32px', '32px', true);
  static readonly RED_MARKER = new EnumMarker(3, 'End Point', 'red-marker.png', '#c01f1f', '32px', '32px', true);
  static readonly PURPLE_MARKER = new EnumMarker(4, 'Search Result', 'purple-marker.png', '#9C27B0', '32px', '32px', true);
  static readonly BLUE_DIRECTION_MARKER = new EnumMarker(5, 'Direction', 'blue-direction-marker.png', '#0091ff', '16px', '16px', false);
  static readonly GREEN_DIRECTION_MARKER = new EnumMarker(6, 'Direction', 'green-direction-marker.png', '#2e8035', '16px', '16px', false);

  private constructor(readonly code: number, readonly text: string, readonly imgName: string, readonly color: string, readonly width: string, readonly height: string, readonly isInfo: boolean) {
    super();
  }
}
