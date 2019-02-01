import { FormGroup } from '@angular/forms';
import { FirmwareOrFileModel } from '../models/firmwareOrFile.model';

export class Helper {

  static isPasswordMatch(group: FormGroup): any {
    const pass = group.get('password');
    const confirmPass = group.get('confirmPassword');

    if (!pass || !confirmPass) {
      return;
    }

    if (pass.value !== confirmPass.value) {
      return {invalid: true};
    }
  }

  static sortItems(sortBy: string, asc: boolean) {

    return (first: any, second: any) => {
      if (first[sortBy] > second[sortBy]) {
        return asc ? 1 : -1;
      }
      if (first[sortBy] < second[sortBy]) {
        return asc ? -1 : 1;
      }
      return 0;
    };
  }

  static downloadBlob(data: Response, name) {
    const blob = new Blob([data], {type: 'application/octet-stream'});
    const blobURL = (window.URL || window['webkitURL']).createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.download = name;
    anchor.href = blobURL;
    anchor.click();
  }
}
