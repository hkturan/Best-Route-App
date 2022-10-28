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
import SearchBox from '@tomtom-international/web-sdk-plugin-searchbox';
import {services} from '@tomtom-international/web-sdk-services';
import {LineOptions} from '../entities/line-options';
import {delay} from 'rxjs/operators';
import {CounterService} from '../services/counter.service';
import {EnumCounterType} from '../enums/enum-counter-type';

export class MapUtil {

  static mapService: MapService;
  static counterService: CounterService;

  /**
   * set Map Service to util
   * @param mapService : Map Service
   */
  static setMapService(mapService: MapService): void {
    this.mapService = mapService;
  }

  /**
   * set Counter Service to util
   * @param counterService : Counter Service
   */
  static setCounterService(counterService: CounterService): void {
    this.counterService = counterService;
  }

  /**
   * Create Map (Tomtom)
   * @param map : map to create
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
    this.addSearchBox(map);
    return map;
  }

  /**
   * Draw Line on Map
   * @param map : map to draw lines
   * @param line : line to draw
   * @param enumMarker : Marker type for center of line
   * @returns Line : drawed line
   */
  static drawLine(map: any, line: Line, enumMarker?: EnumMarker): Line {
    // Get Prepared Line Layer
    map.addLayer(this.getLineLayer(line));

    // Create Marker center of line
    const marker = this.drawMarker(map, new LngLat((line.startCoordinates.lng + line.endCoordinates.lng) / 2, (line.startCoordinates.lat + line.endCoordinates.lat) / 2), enumMarker ? enumMarker : EnumMarker.BLUE_DIRECTION_MARKER, Constants.LINE_MARKER_ID + this.counterService.getCounterValue(EnumCounterType.MARKER));
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
   * @param markerId : Marker id (Optional)
   * @returns Line : drawed marker
   */
  static drawMarker(map: any, data: LngLat, enumMarker: EnumMarker, markerId?: string): MarkerEntity {
    const markerElement = document.createElement('div');
    markerElement.className = 'marker popup';
    markerElement.style.backgroundImage = HelperUtil.getImageFromAssets(enumMarker.imgName);
    markerElement.style.height = enumMarker.height;
    markerElement.style.width = enumMarker.width;
    if (markerId) {
      markerElement.style.visibility = Constants.IS_SHOW_ROUTE_DIRECTIONS ? 'visible' : 'hidden';
    }
    const id = markerId ? markerId : Constants.MARKER_ID + this.counterService.getCounterValue(EnumCounterType.MARKER);
    const name = Constants.MARKER_NAME + ' ' + id.replace(Constants.MARKER_ID, '');

    const spanElement = document.createElement('span');
    spanElement.className = 'popuptext';
    spanElement.innerHTML = name;
    spanElement.id = Constants.POPUP + id;
    markerElement.appendChild(spanElement);

    const marker = new tt.Marker({element: markerElement, anchor: 'center', draggable: true}).setLngLat([data.lng, data.lat]);
    marker.getElement().id = id;
    marker.getElement().addEventListener('click', () => {
      const popup = document.getElementById(Constants.POPUP + id);
      if (!popup) {
        return;
      }
      popup.classList.toggle('show');
    });
    marker.addTo(map);

    const markerEntity = new MarkerEntity();
    markerEntity.marker = marker;
    markerEntity.name = name;
    markerEntity.enumMarker = enumMarker;
    markerEntity.id = marker.getElement().id;
    return markerEntity;
  }

  /**
   * Draw Route on Map
   * @param map : map to draw Route
   * @param httpClient : client to use the tomtom api calculateRoute method
   * @param route : route info
   * @returns Route : drawed marker
   */
  static async drawRoute(httpClient: HttpClient, map: any, route: Route): Promise<Route> {
    const listLine: Line[] = [];
    const startPoint = route.startMarker.marker.getLngLat();
    const endPoint = route.endMarker.marker.getLngLat();

    await this.mapService.calculateRoute(startPoint, endPoint).toPromise().then((res: any) => {
      for (let i = 0; i < (res as any).routes[0].legs[0].points.length - 1; i++) {
        const points = (res as any).routes[0].legs[0].points;
        const line = new Line();
        const lineOptions = new LineOptions();
        lineOptions.lineColor = EnumMarker.BLUE_DIRECTION_MARKER.color;
        line.lineOptions = lineOptions;
        line.id = Constants.LINE_ID + this.counterService.getCounterValue(EnumCounterType.LINE);
        const data1 = points[i];
        const data2 = points[i + 1];
        line.startCoordinates = new LngLat(data1.longitude, data1.latitude);
        line.endCoordinates = new LngLat(data2.longitude, data2.latitude);
        listLine.push(this.drawLine(map, line));
      }
      route.listLine = listLine;
      route.distanceKm = this.getRouteDistance(route);
    }).catch(async (error: HttpErrorResponse) => {
      // 429 : Too Many Requests: Too many requests were sent in a given amount of time for the supplied API Key.
      if (error.status === 429) {
        await delay(100);
        await this.drawRoute(httpClient, map, route);
      } else {
        MessageUtil.showHttpError(error);
      }
    });
    return route;
  }

  /**
   * Delete line from map
   * @param map : map
   * @param lineId : line id to delete
   */
  static removeLine(map: any, lineId: string): void {
    map.removeLayer(lineId);
  }

  /**
   * Delete line from map
   * @param id : marker id to delete
   */
  static removeMarker(id: string): void {
    const element = document.getElementById(id) as HTMLElement;
    if (element) {
      element.remove();
    }
  }

  /**
   * Go Anywhere on Map
   * @param map : map
   * @param inputLng : longitude value
   * @param inputLat : latitude value
   */
  static goAnywhereOnMap(map: any, inputLng: any, inputLat: any): void {
    map.flyTo({
      center: new LngLat(Number(inputLng), Number(inputLat))
    });
  }

  /**
   * Go Anywhere on Map with Marker
   * @param map : map
   * @param marker : marker to blink
   * @param isBlink : if parameter is true, marker blinks three times (default : true)
   */
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
   * @param markerEntity : marker to blink
   */
  static blinkMarker(markerEntity: MarkerEntity): void {
    const element = document.getElementById(markerEntity.id) as HTMLElement;
    element.classList.add('blink');
    setTimeout(() => { element.classList.remove('blink'); }, 1250);
  }

  /**
   * Distance between two points
   * @param data1 : (LngLat) first point
   * @param data2 : (LngLat) second point
   */
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

  /**
   * Convert degree to radian
   * @param deg : degree
   * @returns number : radian
   */
  static deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  /**
   * Degree between two points
   * @param data1 : (LngLat) first point
   * @param data2 : (LngLat) second point
   * @returns number : degree
   */
  static calculateDegreeOfTwoPoints(data1: LngLat, data2: LngLat): number {
    const angleDeg = Math.atan2(data2.lng - data1.lng, data2.lat - data1.lat) * 180 / Math.PI;
    return angleDeg;
  }

  /**
   * Calculate total distance of Route
   * @param route : Route
   * @returns number : distance in Kilometer
   */
  static getRouteDistance(route: Route): number {
    let distance = 0;
    for (const line of route.listLine) {
      distance += line.distanceKm;
    }
    return distance;
  }

  /**
   * Change direction of marker
   * @param marker : Marker Object
   */
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

  /**
   * Change visibility of marker
   * @param markerId : Marker id
   * @param visibility : visibility value
   */
  static changeVisibilityOfMarker(markerId: string, visibility: boolean): void {
    const element = document.getElementById(markerId) as HTMLElement;
    if (element) {
      element.style.visibility = visibility ? 'visible' : 'hidden';
    }
  }

  /**
   * Rotate all line-markers
   * @param list : Route List
   */
  static rotateAllLineMarkers(list: Route[]): void {
    for (const route of list) {
      for (const line of route.listLine) {
        MapUtil.changeDirectionOfMarker(line.marker);
      }
    }
  }

  /**
   * Get line layer for draw line
   * @param line : Line Info
   */
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

  /**
   * Get total distance of route plan
   * @param routePlan : Route Plan
   * @returns number : total distance in Kilometer
   */
  static getTotalDistanceOfRoutePlan(routePlan: RoutePlan): number {
    let totalDistance = 0;
    for (const route of routePlan.listRoute) {
      totalDistance += route.distanceKm;
    }
    return totalDistance;
  }

  /**
   * Get waypoint optimized order using tomtom api
   * @param pointsForWaypointOptimizations : Points for waypoint optimization
   * @param endPointIndex : End Point Index
   * @returns number[] : waypoint optimized order list
   */
  static async getWaypointOptimizatedOrder(pointsForWaypointOptimization: any, endPointIndex: number): Promise<any[]> {
    let optimizedOrder: any[] = [];
    const requestBody = {
      waypoints: pointsForWaypointOptimization,
      options: {
        travelMode: 'car',
        vehicleMaxSpeed: 110,
        outputExtensions: ['travelTimes', 'routeLengths'], // Output Infos
        waypointConstraints : {
          originIndex: 0, // Start Point Index
          destinationIndex: endPointIndex // End Point Index (Optional)
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

  /**
   * add Search Box to map to search for location
   * @param map : map
   */
  static addSearchBox(map: any): void {
    let searchMarker: MarkerEntity | undefined;
    const options = {
      idleTimePress: 100,
      minNumberOfCharacters: 0,
      searchOptions: {
        key: Constants.TOMTOM_API_KEY,
        language: Constants.LANGUAGE,
        limit: Constants.SEARCH_BOX_RESULT_LIMIT
      },
      autocompleteOptions: {
        key: Constants.TOMTOM_API_KEY,
        language: Constants.LANGUAGE
      },
      noResultsMessage: 'No results found.'
    };
    const ttSearchBox = new SearchBox(services, options);
    map.addControl(ttSearchBox, 'top-left');

    // Select Result Event (Add Result)
    ttSearchBox.on('tomtom.searchbox.resultselected', (data) => {
      if (searchMarker) {
        MapUtil.removeMarker(searchMarker.id);
      }
      const position = (data.data.result as any).position;
      const lngLat = new LngLat(position.lng, position.lat);
      searchMarker = MapUtil.drawMarker(map, lngLat, EnumMarker.PURPLE_MARKER);
      MapUtil.goAnywhereOnMapWithMarker(map, searchMarker);
    });

    // Clear Result Event (Remove Result)
    ttSearchBox.on('tomtom.searchbox.resultscleared', () => {
      if (!searchMarker) {
        return;
      }
      MapUtil.removeMarker(searchMarker.id);
    });
  }

}
