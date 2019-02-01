import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'changeByte'
})
export class ChangeBytePipe implements PipeTransform {

  transform(value: number, args?: any): any {
    if (value <= 1048576) {
      return ((Math.round(value / 1024)) + ' ' + 'kb');
    } else if (value > 1048576) {
      return ((Math.round((value / 1024 / 1024) * 10) / 10) + ' ' + 'mb');
    }
  }
}
