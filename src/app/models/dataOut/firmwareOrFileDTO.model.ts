import { DeviceType } from '../../utils/enums/deviceTypeEnum.model';
import { Description } from './description.model';

export class FirmwareOrFileDTOModel {
  public descriptions: Description[];
  public deviceType: DeviceType;
  public name: string;
  public show?: boolean;
  public showInstruction: boolean;
  public version: string;
}
