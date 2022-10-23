import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MapUtil} from '../../../utils/map-util';
import {MarkerEntity} from '../../../entities/marker.entity';

@Component({
  selector: 'app-step-marker-selection',
  templateUrl: './step-marker-selection.component.html',
  styleUrls: ['./step-marker-selection.component.css']
})
export class StepMarkerSelectionComponent implements OnInit {

  // Utils
  mapUtil = MapUtil;

  // Map
  @Input() map: any;

  // Markers withoute Start Marker
  @Input() listMarkerEntity: MarkerEntity[] = [];

  // Selected Marker on Table
  selectedMarkerEntities: MarkerEntity[] = [];

  // For Refresh Start Marker
  @Output() refreshMarkerList = new EventEmitter<MarkerEntity[]>();

  constructor() {
  }

  ngOnInit(): void {
  }


  /**
   * Deletes the selected marker from the table
   */
  deleteSelectedMarkers(): void {
    if (!this.selectedMarkerEntities) {
      return;
    }
    for (const marker of this.selectedMarkerEntities) {
      this.deleteMarker(marker);
    }
    this.refreshMarkerList.emit(this.listMarkerEntity);
  }

  /**
   * Deletes all markers but the start marker
   * @param markerEntity : marker to be deleted
   */
  deleteMarker(markerEntity: MarkerEntity): void {
    if (!markerEntity) {
      return;
    }
    MapUtil.removeMarker(markerEntity.id);
    const marker = this.listMarkerEntity.find(e => e.id === markerEntity.id);
    if (!marker) {
      return;
    }
    this.listMarkerEntity.splice(this.listMarkerEntity.indexOf(marker), 1);
  }

}
