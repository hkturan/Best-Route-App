import {Enum, EnumType} from 'ts-jenum';

@Enum('text')
export class EnumMarker extends EnumType<EnumMarker>() {

  static readonly Default = new EnumMarker(1, 'Default', 'marker.png', '32px', '32px');
  static readonly Yellow = new EnumMarker(2, 'Yellow', 'marker-yellow.png', '32px', '32px');
  static readonly Red = new EnumMarker(3, 'Red', 'marker-red.png', '32px', '32px');
  static readonly Direction = new EnumMarker(4, 'Direction', 'direction.png', '24px', '24px');
  static readonly Blue = new EnumMarker(5, 'Blue', 'marker-blue.png', '16px', '16px');
  static readonly Green = new EnumMarker(6, 'Green', 'marker-green.png', '16px', '16px');

  private constructor(readonly code: number, readonly text: string, readonly imgName: string, readonly width: string, readonly height: string) {
    super();
  }
}
