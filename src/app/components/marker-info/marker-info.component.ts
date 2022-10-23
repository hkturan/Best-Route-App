import { Component, OnInit } from '@angular/core';
import {EnumMarker} from '../../enums/enum-marker';

@Component({
  selector: 'app-marker-info',
  templateUrl: './marker-info.component.html',
  styleUrls: ['./marker-info.component.css']
})
export class MarkerInfoComponent implements OnInit {

  markerList: EnumMarker[] = [];

  constructor() {
  }

  ngOnInit(): void {
    this.markerList = EnumMarker.values().filter(e => e.isInfo);
  }

}
