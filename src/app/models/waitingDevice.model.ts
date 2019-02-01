import { DeviceType } from '../utils/enums/deviceTypeEnum.model';

export class WaitingDeviceModel {
  public country: string;
  public data: string;
  public devId: string;
  public deviceType: DeviceType;
  public disabled: boolean;
  public firmware: number;
  public id: number;
  public ip: string;
  public latitude: string;
  public longitude: string;
  public name: string;
  public userId: string;
}
