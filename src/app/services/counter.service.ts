import {Injectable} from '@angular/core';
import {EnumCounterType} from '../enums/enum-counter-type';

@Injectable()
export class CounterService {

  private counterList = [
    {counterType: EnumCounterType.ROUTE, counterValue: 0},
    {counterType: EnumCounterType.LINE, counterValue: 0}
  ];

  /**
   * get Counter Value
   * @param counterType : Type of Counter
   * @returns number : Counter value
   */
  getCounterValue(counterType: EnumCounterType): number {
    const counter = this.counterList.find(e => e.counterType.code === counterType.code);
    return counter ? ++counter.counterValue : 0;
  }

  /**
   * set Counter Value
   * @param counterType : Type of Counter
   * @param value : Counter value
   */
  setCounterValue(counterType: EnumCounterType, value: number): void {
    const counter = this.counterList.find(e => e.counterType.code === counterType.code);
    if (!counter) {
      return;
    }
    counter.counterValue = value;
  }

}
