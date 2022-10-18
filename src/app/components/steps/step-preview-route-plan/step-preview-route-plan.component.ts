import {Component, Input, OnInit} from '@angular/core';
import {MapUtil} from '../../../utils/map-util';
import {MarkerEntity} from '../../../entities/marker.entity';

@Component({
  selector: 'app-step-preview-route-plan',
  templateUrl: './step-preview-route-plan.component.html',
  styleUrls: ['./step-preview-route-plan.component.css']
})
export class StepPreviewRoutePlanComponent implements OnInit {

  // Utils
  mapUtil = MapUtil;

  // Map
  @Input() map: any;

  @Input() orderedMarkerList: MarkerEntity[] = [];

  constructor() {
  }

  ngOnInit(): void {
  }

}
