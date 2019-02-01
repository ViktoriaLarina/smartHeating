import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { Permission } from '../../../../utils/enums/permissionEnum.model';
import { DeviceService } from '../../../../services/device.service';

import { TypePermission } from '../../../../models/dataOut/typePermission.model';
import { StaticData } from '../../../../utils/static-data';

import { UsersDataOut } from '../../../../models/dataOut/dataOut.model';
import { UsersService } from '../../../../services/users.service';
import {PermissionsOfDevices} from '../../../../models/permissionsOfDevices.model';
import {INumberBoolPair} from '../../../../models/numberBoolPairInterface.model';
import {BaseDeviceModel} from '../../../../models/baseDevice/baseDevice.model';

@Component({
  selector: 'app-edit-user',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})

export class UserEditComponent {
  currentUser: UsersDataOut;
  permissionOfDevices: PermissionsOfDevices[];
  typePermissions: TypePermission[];

  constructor(public dialogRef: MatDialogRef<UserEditComponent>,
              private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private service: UsersService,
              private deviceService: DeviceService) {
    this.typePermissions = StaticData.TypePermissions;
    this.currentUser = data.user;
    this.deviceService.displayingDevices.subscribe((response: BaseDeviceModel[]) => {
      this.permissionOfDevices = [];
      for (const resp of response) {
          this.permissionOfDevices.push({
            name: resp.name,
            id: resp.id,
            value: this.currentUser.permissions && this.currentUser.permissions[resp.id] === Permission.WRITE
          });
      }
    });
    this.deviceService.getDevices();
  }

  changePermission(target, indexDevice) {
    this.permissionOfDevices[indexDevice].value = this.typePermissions[target].value;
  }

  sendData() {
    const dto: INumberBoolPair = {};
    for (const permission of this.permissionOfDevices) {
      dto[permission.id] = permission.value;
    }
    this.service.addOrUpdateChildForUser(this.currentUser.id, dto).subscribe((data: UsersDataOut) => {
      this.service.getUsers();
    });
    this.closeDialog();
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
