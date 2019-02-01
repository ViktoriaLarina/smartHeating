import {Pipe, PipeTransform} from '@angular/core';
import {TimeZone} from '../models/timezones.model';
import {StaticData} from '../utils/static-data';

@Pipe({
  name: 'timezonePipe'
})
export class PipeTimezone implements PipeTransform {

  transform(value: number): any {
    return StaticData.TimeZones.find((item: TimeZone) => item.value === value).name;
  }

}
