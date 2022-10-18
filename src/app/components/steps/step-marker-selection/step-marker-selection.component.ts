import {Component, Input, OnInit} from '@angular/core';
import {MapUtil} from '../../../utils/map-util';
import {MarkerEntity} from '../../../entities/marker.entity';

@Component({
  selector: 'app-step-marker-selection',
  templateUrl: './step-marker-selection.component.html',
  styleUrls: ['./step-marker-selection.component.css']
})
export class StepMarkerSelectionComponent implements OnInit {

  // Map
  @Input() map: any;

  // Markers withoute Start Marker
  @Input() listMarkerEntity: MarkerEntity[] = [];

  // Selected Marker on Table
  selectedMarkerEntity: MarkerEntity | undefined;

  constructor() {
  }

  ngOnInit(): void {
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
   */
  deleteAllMarkers(): void {
    this.listMarkerEntity.forEach(e => this.deleteMarker(e, false));
    this.listMarkerEntity = [];
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

}
