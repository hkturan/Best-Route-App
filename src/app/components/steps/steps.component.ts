import {Component, Input, OnInit} from '@angular/core';
import {MarkerEntity} from '../../entities/marker.entity';
import {MapUtil} from '../../utils/map-util';
import {Route} from '../../entities/route';
import {EnumCounterType} from '../../enums/enum-counter-type';
import {LngLat} from '@tomtom-international/web-sdk-maps';
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

  // Markers withoute Start Marker
  listMarkerEntity: MarkerEntity[] = [];

  // Route
  routePlan: RoutePlan = new RoutePlan();
  routePlanTemp: RoutePlan = new RoutePlan();

  // Step Infos
  steps = StepUtil.getSteps();
  currentStep = StepUtil.getStepWithIndex(0);

  orderedMarkerList: MarkerEntity[] = [];

  constructor(private counterService: CounterService,
              private httpClient: HttpClient) {
  }

  ngOnInit(): void {
    this.addMapEvents();
  }

  /**
   * Adds events to map
   */
  addMapEvents(): void {
    // On Click Event
    this.map.on('click', (e: any) => {
      if (this.currentStep.value === EnumStep.SELECT_START_POINT && !this.startMarkerEntity) {
        this.startMarkerEntity = MapUtil.drawMarker(this.map, e.lngLat, EnumMarker.Default);
      } else if (this.currentStep.value === EnumStep.MARKER_SELECTION) {
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
   * Goes to next step
   */
  async onClickNextStep(): Promise<void> {
    if (!this.startMarkerEntity) {
      return;
    }
    this.currentStep = StepUtil.getNextStep(this.currentStep);
    if (this.currentStep.value === EnumStep.PREVIEW_ROUTE_PLAN) {
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
    this.currentStep = StepUtil.getBackStep(this.currentStep);
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
   * Checks for next step
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
   * @param markerEntity : marker to be refreshed
   */
  refreshStartMarker(markerEntity: MarkerEntity): void {
    this.startMarkerEntity = markerEntity;
  }

}
