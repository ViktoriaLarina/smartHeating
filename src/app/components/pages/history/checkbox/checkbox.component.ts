import {Component, Inject, OnDestroy} from '@angular/core';
import {DateAdapter, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {InteractionsService} from '../../../../services/interactions.service';
import {DeviceService} from '../../../../services/device.service';
import * as moment from 'moment';
import {StaticData} from '../../../../utils/static-data';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.css']
})
export class CheckboxComponent implements OnDestroy {
  minDate = new Date(2017, 3, 1); // TODO: Change year
  criterias;
  dateInterval;
  isInvalidForm: boolean;
  dateFrom = new FormControl('', Validators.required);
  dateTo = new FormControl('');
  arrayOfCriterias: Array<any>;
  subscription;
  blocked: boolean;


  constructor(public dialogRef: MatDialogRef<CheckboxComponent>,
              @Inject(MAT_DIALOG_DATA) public device: any,
              private dateAdapter: DateAdapter<Date>,
              private fb: FormBuilder,
              private serviceInteractions: InteractionsService,
              private deviceService: DeviceService) {
    this.dateAdapter.setLocale('ru');
    this.dateTo.setValidators([Validators.required, this.confirmDate(this.dateFrom, this.dateTo)]);
    this.dateFrom.valueChanges.subscribe(data => {
      this.dateTo.updateValueAndValidity();
    });

    const parameters = StaticData.GetDeviceTypeInfo(this.device.type).parameters;
    this.arrayOfCriterias = parameters.map(item => {
      return {
        value: item,
        name: StaticData.Criterion.find(i => i.value === item).name
      };
    });

    const arr = new Array(this.arrayOfCriterias.length);
    arr.fill(false);
    this.criterias = this.fb.array(arr);

    this.dateInterval = new FormGroup({
      from: this.dateFrom,
      to: this.dateTo,
    });
  }

  get maxDate() {
    return new Date();
  }

  ngOnDestroy() {
  }

  confirmDate(date1: AbstractControl, date2: AbstractControl): ValidatorFn {
    return (control: FormControl): ValidationErrors => {
      if (date1.value && date2.value) {
        if (date1.value < date2.value) {
          return null;
        } else {
          return {invalid: true};
        }
      }
    };
  }

  sendData() {
    if (this.blocked) {
      return;
    }

    const dataToSend = {parameters: []};
    dataToSend['deviceId'] = this.device.id;
    //  ----------------------------------------------------time
    const from = this.dateInterval.controls['from'];
    const to = this.dateInterval.controls['to'];
    if (from.valid) {
      dataToSend['from'] = moment(this.dateInterval.controls['from'].value).utc().format();
    }
    if (to.valid) {
      dataToSend['to'] = moment(this.dateInterval.controls['to'].value).utc().format();
    }

    if (!to.value) {
      const dateTo = new Date();
      to.setValue(dateTo);
    }
    if (!from.value) {
      const dateFrom = new Date(to.value.valueOf());
      dateFrom.setDate(dateFrom.getDate() - 1);
      from.setValue(dateFrom);
    }

    //  ----------------------------------------------------time-end
    if (!this.criterias.value.some(item => item)) {
      this.criterias.controls.forEach(item => item.setValue(true));
    }

    for (let i = 0; i < this.criterias.value.length; i++) {
      const checked = this.criterias.value[i];
      if (checked) {
        dataToSend.parameters.push(this.arrayOfCriterias[i].value);
      }
    }

    this.blocked = true;
    setTimeout(() => {
      this.deviceService.getChartPoints(dataToSend, this.device.type);
      this.closeDialogProfile();
    }, 1500);
  }


  closeDialogProfile() {
    this.dialogRef.close();
  }


}
