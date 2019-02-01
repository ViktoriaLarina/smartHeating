import { AbstractControl } from '@angular/forms';

export function IsNotEmpty(control: AbstractControl): any {

  if (control.value.replace(/\s/g, '') === '') {
    return {
      invalid: true
    };
  }
}
