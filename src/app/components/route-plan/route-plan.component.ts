import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {RoutePlan} from '../../entities/route-plan';
import {MapUtil} from '../../utils/map-util';
import {CounterService} from '../../services/counter.service';
import {EnumCounterType} from '../../enums/enum-counter-type';
import {ConfirmationService} from 'primeng/api';

@Component({
  selector: 'app-route-plan',
  templateUrl: './route-plan.component.html',
  styleUrls: ['./route-plan.component.css']
})
export class RoutePlanComponent implements OnInit {

  // Map
  @Input() map: any;

  // Route
  @Input() routePlan: RoutePlan = new RoutePlan();
  @Input() routePlanTemp: RoutePlan = new RoutePlan();

  // For New Route
  @Output() newRouteEvent = new EventEmitter<any>();

  // Visibility of Route's Direction Markers
  visibilityDirections = false;

  constructor(private counterService: CounterService,
              private confirmationService: ConfirmationService) {
  }

  ngOnInit(): void {
    this.addMapEvents();
  }

  /**
   * Adds events to map
   */
  addMapEvents(): void {
    // On Move Start Event
    this.map.on('movestart', (e: any) => {
      if (this.routePlan.listRoute.length === 0) {
        return;
      }
      this.onChangeVisibilityDirections(false);
    });

    // On Move End Event
    this.map.on('moveend', (e: any) => {
      if (this.routePlan.listRoute.length === 0) {
        return;
      }
      this.onChangeVisibilityDirections();
      MapUtil.rotateAllLineMarkers(this.routePlan.listRoute);
      MapUtil.rotateAllLineMarkers(this.routePlanTemp.listRoute);
    });
  }

  /**
   * Change Visibility of Route's Direction Markers
   * @param markerEntity : marker to deleted
   */
  onChangeVisibilityDirections(value?: boolean): void {
    const list = [this.routePlanTemp.listRoute, this.routePlan.listRoute];
    for (const routeList of list) {
      for (const route of routeList) {
        for (const line of route.listLine) {
          MapUtil.changeVisibilityOfMarker(line.marker.id, value !== undefined ? value : this.visibilityDirections);
        }
      }
    }
  }

  /**
   * Back to Preview Route Plan step
   */
  backPreview(): void {
    this.counterService.setCounterValue(EnumCounterType.ROUTE, 0);
    const list = [this.routePlanTemp.listRoute, this.routePlan.listRoute];
    for (const routeList of list) {
      for (const route of routeList) {
        for (const line of route.listLine) {
          MapUtil.removeLine(this.map, line.id);
        }
      }
    }
    this.routePlan.listRoute = [];
  }

  /**
   * Create a new route
   */
  newRoute(): void {
    this.confirmationService.confirm({
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      message: 'Current route will be deleted. Do you want to create new route?',
      key: 'confirmDialogKeyNewRoute',
      accept: () => {
        this.newRouteEvent.emit('');
      }
    });
  }

}
