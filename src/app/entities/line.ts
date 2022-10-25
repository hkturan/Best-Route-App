import {LngLat} from '@tomtom-international/web-sdk-maps';
import {MarkerEntity} from './marker.entity';
import {LineOptions} from './line-options';

export interface Line {
  id: string;
  routeId: string;
  startCoordinates: LngLat;
  endCoordinates: LngLat;
  lineOptions: LineOptions;
  marker: MarkerEntity;
  distanceKm: number;
}

export class Line {
  constructor() {
  }
}
