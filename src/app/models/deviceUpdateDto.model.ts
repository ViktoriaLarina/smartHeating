import {WeeklySettingDtoModel} from './dataOut/weeklysettingdto.model';

export class DeviceUpdateDto {
  autoWeekly:	boolean;
  devId:	string;
  ip:	string;
  name:	string;
  timezone:	number;
  weeklySettingsList: WeeklySettingDtoModel[];
}
