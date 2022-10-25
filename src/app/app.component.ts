import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MapUtil} from './utils/map-util';
import {MessageService} from 'primeng/api';
import {MessageUtil} from './utils/message-util';
import {MapService} from './services/map.service';
import {CounterService} from './services/counter.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

  // Map
  map: any;

  constructor(
    private messageService: MessageService,
    private mapService: MapService,
    private counterService: CounterService
  ) {
    this.setServicesToUtils();
  }

  ngOnInit(): void {
    this.map = MapUtil.createMap(this.map);
  }

  /**
   * Set Services to Utils
   */
  setServicesToUtils(): void {
    MessageUtil.setMessageService(this.messageService);
    MapUtil.setMapService(this.mapService);
    MapUtil.setCounterService(this.counterService);
  }

}
