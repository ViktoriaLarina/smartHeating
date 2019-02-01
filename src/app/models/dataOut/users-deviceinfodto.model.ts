import { WeeklySettingDtoModel } from './weeklysettingdto.model';

import { HouseType } from '../../utils/enums/houseTypeEnum.model';

export class UsersDeviceInfoDto {
  boilerAndPower: string;
  burnerAndPower: string;
  devId: string;
  houseType: HouseType;
  square: string;
  weeklySettings: WeeklySettingDtoModel[];
}
