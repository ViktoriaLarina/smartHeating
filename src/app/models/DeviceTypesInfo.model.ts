import {TypeConfig1} from './Type-config-1.model';

export class DeviceTypesInfoModel {
  public  name: string;
  public value: string;
  public endpoint: string | null;
  public parameters: string[] | null;
  public historyConfig: TypeConfig1[] | null;
}
