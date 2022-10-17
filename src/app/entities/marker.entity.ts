import {EnumMarker} from '../enums/enum-marker';

export interface MarkerEntity {
  id: string;
  name: string;
  marker: any;
  enumMarker: EnumMarker;
  rotate: number;
}

export class MarkerEntity {
  constructor() {
  }
}
