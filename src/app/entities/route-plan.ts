import {Route} from './route';

export interface RoutePlan {
  listRoute: Route[];
  distanceKm: number;
}

export class RoutePlan {
  constructor() {
    this.listRoute = [];
  }
}
