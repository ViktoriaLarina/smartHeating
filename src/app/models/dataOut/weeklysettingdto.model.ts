export class WeeklySettingDtoModel {
  public on: boolean;
  public settings: SettingItem[];
}

export class SettingItem {
  public dayOfWeek: number;
  public devId?: string;
  public enabled: boolean;
  public hourOfDay: number;
  public id?: number;
  public targetTemperature: number;
}
