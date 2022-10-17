import {Component, Input, OnInit} from '@angular/core';
import {Route} from '../../entities/route';
import {HelperUtil} from '../../utils/helper-util';
import {MapUtil} from '../../utils/map-util';
import {LineOptions} from '../../entities/line-options';
import {EnumMarker} from '../../enums/enum-marker';
import {RoutePlan} from '../../entities/route-plan';
import {CounterService} from '../../services/counter.service';
import {EnumCounterType} from '../../enums/enum-counter-type';

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.css']
})
export class RouteComponent implements OnInit {

  @Input() map: any;
  @Input() route: Route | undefined;
  @Input() routePlanTemp: RoutePlan | undefined;

  constructor(private counterService: CounterService) {
  }

  ngOnInit(): void {
  }

  onClickRoute(route: Route): void {
    if (!this.map || !route || !this.routePlanTemp || !this.routePlanTemp.listRoute) {
      return;
    }
    route.selected = !route.selected;
    if (route.selected) { // Add
      const routeNew = {...route};
      const listLineNew = [];
      for (const line of routeNew.listLine) {
        const lineNew = {...line};
        lineNew.id = HelperUtil.getLineNextIdFromHtml();
        lineNew.lineOptions = new LineOptions();
        lineNew.lineOptions.lineColor = '#2e8035';
        listLineNew.push(MapUtil.drawLine(this.map, lineNew, EnumMarker.Green));
      }
      routeNew.id = this.counterService.getCounterValue(EnumCounterType.ROUTE);
      routeNew.listLine = listLineNew;
      routeNew.originalRouteId = route.id;
      this.routePlanTemp.listRoute.push(routeNew);
      MapUtil.goAnywhereOnMapWithMarker(this.map, route.startMarker, false);
    } else { // Remove
      const findRoute = this.routePlanTemp.listRoute.find(e => e.originalRouteId === route.id) as Route;
      this.routePlanTemp.listRoute.splice(this.routePlanTemp.listRoute.indexOf(findRoute), 1);
      for (const line of findRoute.listLine) {
        MapUtil.removeLine(this.map, line.id);
        MapUtil.removeMarker(line.marker.id);
      }
    }
  }

}
