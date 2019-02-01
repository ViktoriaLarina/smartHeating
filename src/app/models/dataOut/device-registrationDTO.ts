import {WeeklySettingDtoModel} from './weeklysettingdto.model';

export class DeviceRegistrationDTO {
  public boilerAndPower: string;
  public burnerAndPower: string;
  public deviceId: string;
  public houseType: string;
  public name: string;
  public square: string;
  public weeklySettings: WeeklySettingDtoModel[];
}
