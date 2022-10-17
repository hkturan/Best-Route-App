import {Component, Input, OnInit} from '@angular/core';
import {Constants} from '../../helper/constants';
import {MapUtil} from '../../utils/map-util';

@Component({
  selector: 'app-coordinate-search',
  templateUrl: './coordinate-search.component.html',
  styleUrls: ['./coordinate-search.component.css']
})
export class CoordinateSearchComponent implements OnInit {

  // Map
  @Input() map: any;

  // Util
  mapUtil = MapUtil;

  // Latitude and Longitude value to jump to any point on the map
  inputLng = Constants.DEFAULT_LONGITUDE.toString();
  inputLat = Constants.DEFAULT_LATITUDE.toString();

  constructor() {
  }

  ngOnInit(): void {
  }

}
