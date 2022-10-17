import * as tt from '@tomtom-international/web-sdk-maps';
import {LngLat} from '@tomtom-international/web-sdk-maps';
import {EnumMarker} from '../enums/enum-marker';
import {HelperUtil} from './helper-util';
import {Constants} from '../helper/constants';
import {MarkerEntity} from '../entities/marker.entity';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Line} from '../entities/line';
import {Route} from '../entities/route';
import {RoutePlan} from '../entities/route-plan';
import {MapService} from '../services/map.service';
import {MessageUtil} from './message-util';
import {EnumMessageSeverity} from '../enums/enum-message-severity';

export class MapUtil {

  static mapService: MapService;

  static setMapService(mapService: MapService): void {
    this.mapService = mapService;
  }

  /**
   * Create Map (Tomtom)
   * @param map : map to be create
   * @returns any : created map
   */
  static createMap(map: any): any {
    map = tt.map({
      key: Constants.TOMTOM_API_KEY,
      container: 'map',
      center: new LngLat(Constants.DEFAULT_LONGITUDE, Constants.DEFAULT_LATITUDE),
      zoom: Constants.MAP_ZOOM
    });
    map.addControl(new tt.NavigationControl());
    return map;
  }

  /**
   * Draw Line on Map
   * @param map : map to draw lines
   * @param line : line to be draw
   * @param enumMarker : Marker type for center of line
   * @returns Line : drawed line
   */
  static drawLine(map: any, line: Line, enumMarker?: EnumMarker): Line {
    // Get Prepared Line Layer
    map.addLayer(this.getLineLayer(line));

    // Create Marker center of line
    const marker = this.drawMarker(map, new LngLat((line.startCoordinates.lng + line.endCoordinates.lng) / 2, (line.startCoordinates.lat + line.endCoordinates.lat) / 2), enumMarker ? enumMarker : EnumMarker.Blue, HelperUtil.getLineMarkerNextIdFromHtml());
    marker.rotate = -45 + this.calculateDegreeOfTwoPoints(line.startCoordinates, line.endCoordinates);
    this.changeDirectionOfMarker(marker);

    // Set Marker to Line Entity
    line.marker = marker;

    // Set Distance
    line.distanceKm = this.getDistanceInKm(line.startCoordinates, line.endCoordinates);

    return line;
  }

  /**
   * Draw Line on Map
   * @param map : map to draw lines
   * @param data : coordinate to draw marker
   * @param enumMarker : Marker type
   * @param markerId : Marker's id (Optional)
   * @returns Line : drawed marker
   */
  static drawMarker(map: any, data: LngLat, enumMarker: EnumMarker, markerId?: string): MarkerEntity {
    const markerElement = document.createElement('div');
    markerElement.className = 'marker';
    markerElement.style.backgroundImage = HelperUtil.getImageFromAssets(enumMarker.imgName);
    markerElement.style.height = enumMarker.height;
    markerElement.style.width = enumMarker.width;
    if (markerId) {
      markerElement.style.visibility = Constants.IS_SHOW_ROUTE_DIRECTIONS ? 'visible' : 'hidden';
    }
    const id = markerId ? markerId : HelperUtil.getMarkerNextIdFromHtml();
    const name = Constants.MARKER_NAME + ' ' + id.replace(Constants.MARKER_ID, '');
    const marker = new tt.Marker({element: markerElement, anchor: 'center', draggable: true}).setLngLat([data.lng, data.lat]);
    marker.getElement().id = id;
    marker.getElement().addEventListener('click', () => {
      // console.log(marker.getElement().id);
    });
    if (!markerId) {
      marker.setPopup(new tt.Popup({offset: 35}).setHTML(name));
    }
    marker.addTo(map);

    const markerEntity = new MarkerEntity();
    markerEntity.marker = marker;
    markerEntity.name = name;
    markerEntity.enumMarker = enumMarker;
    markerEntity.id = marker.getElement().id;
    return markerEntity;
  }

  static async drawRoute(httpClient: HttpClient, map: any, route: Route): Promise<Route> {
    const listLine: Line[] = [];
    const startPoint = route.startMarker.marker.getLngLat();
    const endPoint = route.endMarker.marker.getLngLat();

    await this.mapService.calculateRoute(startPoint, endPoint).toPromise().then((res: any) => {
      for (let i = 0; i < (res as any).routes[0].legs[0].points.length - 1; i++) {
        const points = (res as any).routes[0].legs[0].points;
        const line = new Line();
        line.id = HelperUtil.getLineNextIdFromHtml();
        const data1 = points[i];
        const data2 = points[i + 1];
        line.startCoordinates = new LngLat(data1.longitude, data1.latitude);
        line.endCoordinates = new LngLat(data2.longitude, data2.latitude);
        listLine.push(this.drawLine(map, line));
      }
      route.listLine = listLine;
      route.distanceKm = this.getRouteDistance(route);
    }).catch((error: HttpErrorResponse) => {
      MessageUtil.showHttpError(error);
    });
    return route;
  }

  static removeLine(map: any, id: string): void {
    map.removeLayer(id);
  }

  static removeMarker(id: string): void {
    const element = document.getElementById(id) as HTMLElement;
    if (element) {
      element.remove();
    }
  }

  // Go Anywhere on Map
  static goAnywhereOnMap(map: any, inputLng: any, inputLat: any): void {
    map.flyTo({
      center: new LngLat(Number(inputLng), Number(inputLat))
    });
  }

  // Go Anywhere on Map With Marker
  static goAnywhereOnMapWithMarker(map: any, marker: MarkerEntity, isBlink = true): void {
    map.flyTo({
      center: marker.marker.getLngLat()
    });
    if (isBlink) {
      this.blinkMarker(marker);
    }
  }

  /**
   * Blink Marker Event
   */
  static blinkMarker(markerEntity: MarkerEntity): void {
    const element = document.getElementById(markerEntity.id) as HTMLElement;
    element.classList.add('blink');
    setTimeout(() => { element.classList.remove('blink'); }, 1250);
  }

  static getDistanceInKm(data1: LngLat, data2: LngLat): number {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(data2.lat - data1.lat);  // deg2rad below
    const dLon = this.deg2rad(data2.lng - data1.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(data1.lat)) * Math.cos(this.deg2rad(data2.lat)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  }

  static deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  static calculateDegreeOfTwoPoints(data1: LngLat, data2: LngLat): number {
    const angleDeg = Math.atan2(data2.lng - data1.lng, data2.lat - data1.lat) * 180 / Math.PI;
    return angleDeg;
  }

  static getRouteDistance(route: Route): number {
    let distance = 0;
    for (const line of route.listLine) {
      distance += line.distanceKm;
    }
    return distance;
  }

  static changeDirectionOfMarker(marker: MarkerEntity): void {
    setTimeout(() => {
      const element = document.getElementById(marker.id) as HTMLElement;
      if (!element) {
        return;
      }
      let transform = element.style.transform;
      const index = transform.indexOf('rotateZ');
      transform = transform.substring(0, index);
      transform += 'rotateZ(' + marker.rotate + 'deg)';
      element.style.transform = transform;
    }, 1);
  }

  static changeVisibilityOfMarker(markerId: string, visibility: boolean): void {
    const element = document.getElementById(markerId) as HTMLElement;
    if (element) {
      element.style.visibility = visibility ? 'visible' : 'hidden';
    }
  }

  static rotateAllLineMarkers(list: Route[]): void {
    for (const route of list) {
      for (const line of route.listLine) {
        MapUtil.changeDirectionOfMarker(line.marker);
      }
    }
  }

  static getLineLayer(line: Line): any {
    return {
      id: line.id,
        type: 'line',
      source: {
      type: 'geojson',
        data: {
        type: 'FeatureCollection',
          features: [
          {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              properties: {},
              coordinates: [
                [line.startCoordinates.lng, line.startCoordinates.lat],
                [line.endCoordinates.lng, line.endCoordinates.lat]
              ]
            }
          }
        ]
      }
    },
      layout: {
        'line-cap': 'round',
          'line-join': 'round'
      },
      paint: {
        'line-color': line.lineOptions.lineColor,
        'line-width': line.lineOptions.lineWidth
      }
    };
  }

  static getTotalDistanceOfRoutePlan(routePlan: RoutePlan): number {
    let totalDistance = 0;
    for (const route of routePlan.listRoute) {
      totalDistance += route.distanceKm;
    }
    return totalDistance;
  }

  static async getWaypointOptimizatedOrder(pointsForWaypointOptimizations: any): Promise<any[]> {
    let optimizedOrder: any[] = [];
    const requestBody = {
      waypoints: pointsForWaypointOptimizations,
      options: {
        travelMode: 'car',
        vehicleMaxSpeed: 110,
        outputExtensions: ['travelTimes', 'routeLengths'],
        waypointConstraints : {
          originIndex: 0,
          destinationIndex: -1
        }
      }
    };
    await this.mapService.getWaypointOptimizatedOrder(requestBody).toPromise().then((res: any) => {
      optimizedOrder = res.optimizedOrder;
    }).catch((error: HttpErrorResponse) => {
      MessageUtil.showHttpError(error);
    });
    return optimizedOrder;
  }

}
