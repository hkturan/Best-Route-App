import {Component, Input, OnInit} from '@angular/core';
import {Step} from '../../entities/step';
import {MarkerEntity} from '../../entities/marker.entity';
import {MapUtil} from '../../utils/map-util';
import {Route} from '../../entities/route';
import {EnumCounterType} from '../../enums/enum-counter-type';
import {LngLat} from '@tomtom-international/web-sdk-maps';
import {EnumMarker} from '../../enums/enum-marker';
import {RoutePlan} from '../../entities/route-plan';
import {CounterService} from '../../services/counter.service';
import {HttpClient} from '@angular/common/http';
import {MessageService} from 'primeng/api';
import {MapService} from '../../services/map.service';
import {HelperUtil} from '../../utils/helper-util';
import {Constants} from '../../helper/constants';
import {MessageUtil} from '../../utils/message-util';
import {EnumMessageSeverity} from '../../enums/enum-message-severity';

@Component({
  selector: 'app-steps',
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.css']
})
export class StepsComponent implements OnInit {

  // Utils
  helperUtil = HelperUtil;
  mapUtil = MapUtil;

  // Map
  @Input() map: any;

  // Start Marker
  startMarkerEntity: MarkerEntity | undefined;

  // Markers withoute Start Marker
  listMarkerEntity: MarkerEntity[] = [];

  // Selected Marker on Table
  selectedMarkerEntity: MarkerEntity | undefined;

  // Route
  routePlan: RoutePlan = new RoutePlan();
  routePlanTemp: RoutePlan = new RoutePlan();

  // Step Infos
  steps: Step[] = [];
  stepIndex = 0;

  // Visibility of Route's Direction Markers
  visibilityDirections = false;

  orderedMarkerList: MarkerEntity[] = [];

  constructor(private counterService: CounterService,
              private httpClient: HttpClient,
              private messageService: MessageService,
              private mapService: MapService) {
  }

  ngOnInit(): void {
    this.createSteps();
    this.addMapEvents();
  }

  /**
   * Adds events to map
   */
  addMapEvents(): void {
    // On Click Event
    this.map.on('click', (e: any) => {
      if (this.stepIndex === 0 && !this.startMarkerEntity) {
        this.startMarkerEntity = MapUtil.drawMarker(this.map, e.lngLat, EnumMarker.Default);
      } else if (this.stepIndex === 1) {
        if (this.listMarkerEntity.length === Constants.MARKER_LIMIT) {
          MessageUtil.showMessage(EnumMessageSeverity.ERROR, 'You cannot mark more than 10 locations');
          return;
        }
        const markerEntity = MapUtil.drawMarker(this.map, e.lngLat, EnumMarker.Red);
        this.listMarkerEntity.push(markerEntity);
      }
    });
  }

  /**
   * onRowSelect event of marker table
   */
  onRowSelectMarker(): void {
    if (!this.selectedMarkerEntity) {
      return;
    }
    MapUtil.goAnywhereOnMapWithMarker(this.map, this.selectedMarkerEntity);
  }

  /**
   * Creates steps for route plan
   */
  createSteps(): void {
    this.steps = [
      {label: 'Step 1', header: 'Select Start Point', index: 0, successMessage: 'You selected Start Point', infoMessage: ''},
      {label: 'Step 2', header: 'Select Marker(s) for Route', index: 1, successMessage: 'You selected Marker(s)', infoMessage: ''},
      {label: 'Step 3', header: 'Choose Route Plan', index: 2, successMessage: 'Route Plan is Ready', infoMessage: 'You can reorder'}
    ];
  }

  /**
   * Goes to next step
   */
  async onClickNextStep(): Promise<void> {
    if (!this.startMarkerEntity) {
      return;
    }
    this.stepIndex++;
    if (this.stepIndex === 2) {
      const pointsForWaypointOptimizations = [];

      // All Markers of Map (Start Point and Others)
      const allMarkers: MarkerEntity[] = [];
      allMarkers.push(this.startMarkerEntity);
      allMarkers.push(...this.listMarkerEntity);

      // Format Points for Tomtom Api Request
      for (const marker of allMarkers) {
        if (!marker) {
          return;
        }
        const value = {
          point: {
            latitude: marker.marker.getLngLat().lat,
            longitude: marker.marker.getLngLat().lng
          }
        };
        pointsForWaypointOptimizations.push(value);
      }

      // Shortest Path Order
      const optimizedOrder = await MapUtil.getWaypointOptimizatedOrder(pointsForWaypointOptimizations);
      this.orderedMarkerList = [];
      for (const index of optimizedOrder) {
        this.orderedMarkerList.push(allMarkers[index]);
      }
    }
  }

  /**
   * Goes to back step
   */
  onClickBackStep(): void {
    this.stepIndex--;
  }

  /**
   * Finishes all steps and draw route
   */
  async onClickCompleteStep(): Promise<void> {
    // Draw Route
    for (let i = 0; i < this.orderedMarkerList.length - 1; i++) {
      const route = new Route(this.counterService.getCounterValue(EnumCounterType.ROUTE), this.orderedMarkerList[i], this.orderedMarkerList[i + 1]);
      this.routePlan.listRoute.push(await MapUtil.drawRoute(this.httpClient, this.map, route));
    }
    this.routePlan.distanceKm = MapUtil.getTotalDistanceOfRoutePlan(this.routePlan);
    MapUtil.rotateAllLineMarkers(this.routePlan.listRoute);
    MapUtil.rotateAllLineMarkers(this.routePlanTemp.listRoute);
  }

  /**
   * returns the header of the current step
   * @returns string
   */
  getStepHeader(): string {
    const step = this.steps.find(e => e.index === this.stepIndex) as Step;
    return step.header;
  }

  /**
   * Returns the message of the current step
   * @returns string
   */
  getStepSuccessMessage(): string {
    const step = this.steps.find(e => e.index === this.stepIndex) as Step;
    return step.successMessage;
  }

  /**
   * Returns the info message of the current step
   * @returns string
   */
  getStepInfoMessage(): string {
    const step = this.steps.find(e => e.index === this.stepIndex) as Step;
    return step.infoMessage;
  }

  /**
   * Checks for next step
   * @returns boolean
   */
  disableButtonNextStep(): boolean {
    if (this.stepIndex === 0) {
      return !this.startMarkerEntity;
    } else if (this.stepIndex === 1) {
      return this.listMarkerEntity.length === 0;
    }
    return false;
  }

  /**
   * Gets your live location in real time
   */
  getLiveLocation(): void {
    navigator.geolocation.watchPosition(
      (position: any) => {
        const lngLat = new LngLat(position.coords.longitude, position.coords.latitude);
        this.startMarkerEntity = MapUtil.drawMarker(this.map, lngLat, EnumMarker.Default);
      },
      (err: GeolocationPositionError) => {
      },
      {
        enableHighAccuracy: true,
        timeout: 3000,
        maximumAge: 60000,
      }
    );
  }

  /**
   * Deletes all markers but the start marker
   */
  deleteAllMarkers(): void {
    this.listMarkerEntity.forEach(e => this.deleteMarker(e, false));
    this.listMarkerEntity = [];
  }

  /**
   * Deletes the selected marker from the table
   */
  deleteSelectedMarker(): void {
    if (!this.selectedMarkerEntity) {
      return;
    }
    this.deleteMarker(this.selectedMarkerEntity, true);
  }

  /**
   * Deletes all markers but the start marker
   * @param markerEntity : marker to be deleted
   */
  deleteMarker(markerEntity: MarkerEntity, deleteList: boolean): void {
    if (!markerEntity) {
      return;
    }
    MapUtil.removeMarker(markerEntity.id);
    if (!deleteList) {
      return;
    }
    const marker = this.listMarkerEntity.find(e => e.id === markerEntity.id);
    if (!marker) {
      return;
    }
    this.listMarkerEntity.splice(this.listMarkerEntity.indexOf(marker), 1);
  }

  /**
   * Refresh Start Marker from Child Component
   * @param markerEntity : marker to be refreshed
   */
  refreshStartMarker(markerEntity: MarkerEntity): void {
    this.startMarkerEntity = markerEntity;
  }

}
