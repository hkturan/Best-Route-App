import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Constants} from '../helper/constants';
import {LngLat} from '@tomtom-international/web-sdk-maps';

@Injectable()
export class MapService {

  constructor(private httpClient: HttpClient) {
  }

  /**
   * Tomtom api : waypointoptimization
   * Link : https://developer.tomtom.com/routing-api/documentation/waypoint-optimization/waypoint-optimization
   * @param body : body of request
   * @returns any : Ordered List
   */
  getWaypointOptimizatedOrder(body: any): any {
    return this.httpClient.post('https://api.tomtom.com/routing/waypointoptimization/1?key=' + Constants.TOMTOM_API_KEY + '', body);
  }

  /**
   * Tomtom api : calculateRoute
   * Link : https://developer.tomtom.com/routing-api/documentation/routing/calculate-route
   * @param startPoint : Start Point
   * @param endPoint : End Point
   * @returns any : calculated Route Infos
   */
  calculateRoute(startPoint: LngLat, endPoint: LngLat): any {
    return this.httpClient.get('https://api.tomtom.com/routing/1/calculateRoute/' + startPoint.lat + ',' + startPoint.lng + ':' + endPoint.lat + ',' + endPoint.lng + '/json?key=' + Constants.TOMTOM_API_KEY + '');
  }

}
