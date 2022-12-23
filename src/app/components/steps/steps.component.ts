import {Component, Input, OnInit} from '@angular/core';
import {MarkerEntity} from '../../entities/marker.entity';
import {MapUtil} from '../../utils/map-util';
import {Route} from '../../entities/route';
import {EnumCounterType} from '../../enums/enum-counter-type';
import {EnumMarker} from '../../enums/enum-marker';
import {RoutePlan} from '../../entities/route-plan';
import {CounterService} from '../../services/counter.service';
import {HttpClient} from '@angular/common/http';
import {HelperUtil} from '../../utils/helper-util';
import {Constants} from '../../helper/constants';
import {MessageUtil} from '../../utils/message-util';
import {EnumMessageSeverity} from '../../enums/enum-message-severity';
import {StepUtil} from '../../utils/step-util';
import {EnumStep} from '../../enums/enum-step';

@Component({
  selector: 'app-steps',
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.css']
})
export class StepsComponent implements OnInit {

  // Utils & Enums
  helperUtil = HelperUtil;
  mapUtil = MapUtil;
  enumStep = EnumStep;

  // Map
  @Input() map: any;

  // Start Marker
  startMarkerEntity: MarkerEntity | undefined;

  // End Marker
  endMarkerEntity: MarkerEntity | undefined;

  // Markers without Start Marker
  listMarkerEntity: MarkerEntity[] = [];

  // Route
  routePlan: RoutePlan = new RoutePlan();
  routePlanTemp: RoutePlan = new RoutePlan();

  // Step Infos
  steps = StepUtil.getSteps();
  currentStep = StepUtil.getStepWithIndex(0);

  // List After Waypoint Optimization
  orderedMarkerList: MarkerEntity[] = [];

  constructor(private counterService: CounterService,
              private httpClient: HttpClient) {
  }

  ngOnInit(): void {
    this.addMapEvents();
  }

  /**
   * Add events to map
   */
  addMapEvents(): void {
    // On Click Event
    this.map.on('click', (e: any) => {
      if (this.currentStep.value === EnumStep.SELECT_START_POINT && !this.startMarkerEntity) {
        this.startMarkerEntity = MapUtil.drawMarker(this.map, e.lngLat, EnumMarker.GREEN_MARKER);
      } else if (this.currentStep.value === EnumStep.MARKER_SELECTION) {
        if (this.listMarkerEntity.length === Constants.MARKER_LIMIT) {
          MessageUtil.showMessage(EnumMessageSeverity.ERROR, 'You cannot mark more than 10 locations');
          return;
        }
        const markerEntity = MapUtil.drawMarker(this.map, e.lngLat, EnumMarker.BLUE_MARKER);
        this.listMarkerEntity.push(markerEntity);
      } else if (this.currentStep.value === EnumStep.SELECT_END_POINT && !this.endMarkerEntity) {
        this.endMarkerEntity = MapUtil.drawMarker(this.map, e.lngLat, EnumMarker.RED_MARKER);
      }
    });
  }

  /**
   * Go to next step
   */
  async onClickNextStep(): Promise<void> {
    if (!this.startMarkerEntity) {
      return;
    }
    this.currentStep = StepUtil.getNextStep(this.currentStep);
    if (this.currentStep.value === EnumStep.PREVIEW_ROUTE_PLAN) {
      const pointsForWaypointOptimizations = [];
      let endPointIndex = -1;

      // All Markers of Map (Start Point and Others)
      const allMarkers: MarkerEntity[] = [];
      allMarkers.push(this.startMarkerEntity);
      allMarkers.push(...this.listMarkerEntity);
      if (this.endMarkerEntity) {
        allMarkers.push(this.endMarkerEntity);
      }

      // Format Points for Tomtom Api Request
      let i = 0;
      for (const marker of allMarkers) {
        if (!marker) {
          return;
        }
        if (this.endMarkerEntity && marker.id === this.endMarkerEntity.id) {
          endPointIndex = i;
        }
        const value = {
          point: {
            latitude: marker.marker.getLngLat().lat,
            longitude: marker.marker.getLngLat().lng
          }
        };
        pointsForWaypointOptimizations.push(value);
        i++;
      }

      // Shortest Path Order
      const optimizedOrder = await MapUtil.getWaypointOptimizatedOrder(pointsForWaypointOptimizations, endPointIndex);
      this.orderedMarkerList = [];
      for (const index of optimizedOrder) {
        this.orderedMarkerList.push(allMarkers[index]);
      }
    }
  }

  /**
   * Go to back step
   */
  onClickBackStep(): void {
    this.currentStep = StepUtil.getBackStep(this.currentStep);
  }

  /**
   * Finish all steps and draw route
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
   * Check for next step
   * @returns boolean
   */
  disableButtonNextStep(): boolean {
    if (this.currentStep.value === EnumStep.SELECT_START_POINT) {
      return !this.startMarkerEntity;
    } else if (this.currentStep.value === EnumStep.MARKER_SELECTION) {
      return this.listMarkerEntity.length === 0;
    }
    return false;
  }

  /**
   * Refresh Start Marker from Child Component
   * @param markerEntity : marker to refresh
   */
  refreshStartMarker(markerEntity: MarkerEntity): void {
    this.startMarkerEntity = markerEntity;
  }

  /**
   * Refresh End Marker from Child Component
   * @param markerEntity : marker to refresh
   */
  refreshEndMarker(markerEntity: MarkerEntity): void {
    this.endMarkerEntity = markerEntity;
  }

  /**
   * Refresh Markers from Child Component
   * @param listMarkerEntity : markers to refresh
   */
  refreshMarkerList(listMarkerEntity: MarkerEntity[]): void {
    this.listMarkerEntity = listMarkerEntity;
  }

  /**
   * Create a new route
   */
  newRoute(): void {
    this.currentStep = StepUtil.getStepWithIndex(0);
    this.startMarkerEntity = undefined;
    this.endMarkerEntity = undefined;
    this.listMarkerEntity = [];
    this.routePlan = new RoutePlan();
    this.routePlanTemp = new RoutePlan();
    this.orderedMarkerList = [];
    this.map = MapUtil.createMap(this.map);
    this.addMapEvents();
  }

}
