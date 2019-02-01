import { DeviceType } from '../utils/enums/deviceTypeEnum.model';
import { Description } from './dataOut/description.model';

export class FirmwareOrFileModel {
  public dateCreation: string;
  public descriptions: Description[];
  public deviceType: DeviceType;
  public id: number;
  public name: string;
  public showInstruction?: boolean;
  public show?: boolean;
  public size: number;
  public version?: string;
}
