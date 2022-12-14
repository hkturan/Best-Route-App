import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {MarkerEntity} from '../../../entities/marker.entity';
import {MapUtil} from '../../../utils/map-util';
import {LngLat} from '@tomtom-international/web-sdk-maps';
import {EnumMarker} from '../../../enums/enum-marker';

@Component({
  selector: 'app-step-select-start-point',
  templateUrl: './step-select-start-point.component.html',
  styleUrls: ['./step-select-start-point.component.css']
})
export class StepSelectStartPointComponent implements OnInit {

  // Utils
  mapUtil = MapUtil;

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
   * Go to the start point on the map
   */
  goStartPoint(): void {
    if (!this.startMarkerEntity) {
      return;
    }
    MapUtil.goAnywhereOnMapWithMarker(this.map, this.startMarkerEntity);
  }

  /**
   * Delete the start point and marker from the map
   */
  deleteStartPoint(): void {
    if (!this.startMarkerEntity) {
      return;
    }
    MapUtil.removeMarker(this.startMarkerEntity.id);
    this.startMarkerEntity = undefined;
    this.refreshStartMarker.emit(this.startMarkerEntity);
  }

  /**
   * Get your live location in real time
   */
  getLiveLocation(): void {
    navigator.geolocation.watchPosition(
      (position: any) => {
        this.deleteStartPoint();
        const lngLat = new LngLat(position.coords.longitude, position.coords.latitude);
        this.startMarkerEntity = MapUtil.drawMarker(this.map, lngLat, EnumMarker.GREEN_MARKER);
        MapUtil.goAnywhereOnMapWithMarker(this.map, this.startMarkerEntity, false);
        this.refreshStartMarker.emit(this.startMarkerEntity);
      },
      (err: GeolocationPositionError) => {
        throw new Error('Error! Code : ' + err.code + ' , Message : ' + err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 3000,
        maximumAge: 60000,
      }
    );
  }

}
