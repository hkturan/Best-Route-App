import {Component, Input, OnInit, EventEmitter, Output} from '@angular/core';
import {LngLat} from '@tomtom-international/web-sdk-maps';
import {MapUtil} from '../../../utils/map-util';
import {EnumMarker} from '../../../enums/enum-marker';
import {MarkerEntity} from '../../../entities/marker.entity';

@Component({
  selector: 'app-step-select-end-point',
  templateUrl: './step-select-end-point.component.html',
  styleUrls: ['./step-select-end-point.component.css']
})
export class StepSelectEndPointComponent implements OnInit {

  // Map
  @Input() map: any;

  // Start Marker
  @Input() endMarkerEntity: MarkerEntity | undefined;

  // For Refresh Start Marker
  @Output() refreshEndMarker = new EventEmitter<MarkerEntity>();

  constructor() {
  }

  ngOnInit(): void {
  }

  /**
   * Go to the end point on the map
   */
  goEndPoint(): void {
    if (!this.endMarkerEntity) {
      return;
    }
    MapUtil.goAnywhereOnMapWithMarker(this.map, this.endMarkerEntity);
  }

  /**
   * Delete the end point and marker from the map
   */
  deleteEndPoint(): void {
    if (!this.endMarkerEntity) {
      return;
    }
    MapUtil.removeMarker(this.endMarkerEntity.id);
    this.endMarkerEntity = undefined;
    this.refreshEndMarker.emit(this.endMarkerEntity);
  }

  /**
   * Get your live location in real time
   */
  getLiveLocation(): void {
    navigator.geolocation.watchPosition(
      (position: any) => {
        this.deleteEndPoint();
        const lngLat = new LngLat(position.coords.longitude, position.coords.latitude);
        this.endMarkerEntity = MapUtil.drawMarker(this.map, lngLat, EnumMarker.RED_MARKER);
        this.refreshEndMarker.emit(this.endMarkerEntity);
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
