import {Injectable} from '@angular/core';
import {EnumCounterType} from '../enums/enum-counter-type';

@Injectable()
export class CounterService {

  private counterList = [
    {counterType: EnumCounterType.ROUTE, counterValue: 0},
    {counterType: EnumCounterType.LINE, counterValue: 0}
  ];

  getCounterValue(counterType: EnumCounterType): number {
    const counter = this.counterList.find(e => e.counterType.code === counterType.code);
    return counter ? ++counter.counterValue : 0;
  }

}
