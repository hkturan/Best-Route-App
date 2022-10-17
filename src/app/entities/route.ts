import {Line} from './line';
import {MarkerEntity} from './marker.entity';
import {Constants} from '../helper/constants';

export interface Route {
  id: number;
  name: string;
  listLine: Line[];
  startMarker: MarkerEntity;
  endMarker: MarkerEntity;
  selected: boolean;
  distanceKm: number;
  originalRouteId: number;
}

export class Route {
  constructor(id: number, startMarker: MarkerEntity, endMarker: MarkerEntity) {
    this.id = id;
    this.name = Constants.ROUTE_NAME + ' ' + id;
    this.startMarker = startMarker;
    this.endMarker = endMarker;
    this.selected = false;
  }
}
