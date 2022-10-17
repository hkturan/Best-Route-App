import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {MarkerEntity} from '../../../entities/marker.entity';
import {MapUtil} from '../../../utils/map-util';

@Component({
  selector: 'app-step-select-start-point',
  templateUrl: './step-select-start-point.component.html',
  styleUrls: ['./step-select-start-point.component.css']
})
export class StepSelectStartPointComponent implements OnInit {

  // Map
  @Input() map: any;

  // Start Marker
  @Input() startMarkerEntity: MarkerEntity | undefined;

  // For Refresh Start Marker
  @Output() refreshStartMarker = new EventEmitter<MarkerEntity>();

  constructor() {
  }

  ngOnInit(): void {
  }

  /**
   * Goes to the starting point on the map
   */
  goStartPoint(): void {
    if (!this.startMarkerEntity) {
      return;
    }
    MapUtil.goAnywhereOnMapWithMarker(this.map, this.startMarkerEntity);
  }

  /**
   * Deletes the starting point and marker from the map
   */
  deleteStartPoint(): void {
    if (!this.startMarkerEntity) {
      return;
    }
    MapUtil.removeMarker(this.startMarkerEntity.id);
    this.startMarkerEntity = undefined;
    this.refreshStartMarker.emit(this.startMarkerEntity);
  }

}
