import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {BASE_URL_TOKEN} from '../configs';
import {FiltersModel} from '../models/filters.model';
import {StaticData} from '../utils/static-data';
import {BaseDeviceModel} from '../models/baseDevice/baseDevice.model';
import {WeeklySettingDtoModel} from "../models/dataOut/weeklysettingdto.model";

@Injectable()
export class DeviceService {

  displayingDevices = new Subject<BaseDeviceModel[]>();
  isFirmware = new Subject<boolean>();
  isFirmwareFlag: boolean;
  isShowWeekleySettings = new Subject<boolean>();
  showWeeklySettingsFlag: boolean;
  typesStr: string;
  stateActive: string;
  filters = new Subject<FiltersModel>();
  ChartPoints = new Subject<any>();
  fullPointInfo = new Subject<any>();
  tempChartSettings: any[];
  blockFullRefresh: boolean;
  needFullRefresh: boolean;
  urlDeviceType: string;
  requestsInProcess = [];
  waitingRequests = [];

  constructor(@Inject(BASE_URL_TOKEN) private baseUrl: string,
              private http: HttpClient) {
    this.typesStr = '';
    this.stateActive = '';
    this.isShowWeekleySettings.subscribe((data) => this.showWeeklySettingsFlag = data);
    this.isFirmware.subscribe((data) => this.isFirmwareFlag = data);
  }

  // ---------------------------------------------------------------------settings

  getWeeklySettings(id: number) {
    const url = `${this.baseUrl}/device/${id}/weekly-settings`;
    return this.http.get(url);
  }

  changeNameDevice(name: string, id: number) {
    const url = `${this.baseUrl}/device/${id}/name`;
    return this.http.patch(url, name);
  }
  removeDevice(id): Observable<any> {
    const url = `${this.baseUrl}/device/disable/${id}`;
    return this.http.delete(url);
  }

  getRemoveDate(id: number): Observable<any> {
    const url = `${this.baseUrl}/device/remove/${id}/date`;
    return this.http.get(url);
  }

  restoreDevice(id: number) {
    const url = `${this.baseUrl}/device/restore/${id}`;
    return this.http.post(url, null);
  }

  getWeather(latitude: string, longitude: string) {
    const weatherApiKey = '1c7f238ffe34aa5e48b6c0419f0164f5';    // customers key
    const url = `/weather/data/2.5/weather?` + (`lat=${latitude}&lon=${longitude}&APPID=${weatherApiKey}`);
    return this.http.get(url);
  }

  changeDeviceState(data, deviceId, onNext, onError) {
    if (this.requestsInProcess.indexOf(data.id) > -1) {
      this.waitingRequests[data.id] = () => this.changeDeviceState(data, deviceId, onNext, onError);
      return;
    }
    const url = `${this.baseUrl}/device/type1/${deviceId}/data`;
    this.requestsInProcess.push(data.id);
    this.http.put(url, data).subscribe((resp) => {
      this.releaseRequest(data.id);
      if (onNext) {
        onNext(resp);
      }
    }, (error) => {
      this.releaseRequest(data.id);
      if (onError) {
        onError(error);
      }
    });
  }

  releaseRequest(id) {
    const index = this.requestsInProcess.indexOf(id);
    if (index === -1) {
      return;
    }
    this.requestsInProcess.splice(index, 1);
    const waiting = this.waitingRequests[id];
    const waitingIndex = this.waitingRequests.indexOf(id);
    this.waitingRequests.splice(waitingIndex, 1);
    if (waiting) {
      waiting();
    } else if (this.needFullRefresh) {
      this.getDevices();
    }
  }

  changeTimeZone(dto, id) {
    console.log(id);
    const url = `${this.baseUrl}/device/${id}`;
    return this.http.put(url, dto);
  }

  PutWeeklySettings(dto: WeeklySettingDtoModel, id) {
    const url = `${this.baseUrl}/device/${id}/weekly-settings`;
    return this.http.put(url, dto);
  }

// ------------------------------------------------------------------------------device component
  getDevices() {
    if (this.blockFullRefresh || this.requestsInProcess.length > 0) {
      this.needFullRefresh = true;
      return;
    }
    this.needFullRefresh = false;
    const url = `${this.baseUrl}/device/list/detailed${this.stateActive}`;
    this.http.get(url).subscribe((devices: BaseDeviceModel[]) => {
      console.dir(devices);
      if (this.requestsInProcess.length > 0 || this.blockFullRefresh) {
        this.needFullRefresh = true;
        return;
      }
      this.displayingDevices.next(devices);
    });
  }

  setStateActive(activeState) {
    if (activeState !== undefined) {
      this.stateActive = '?type=' + activeState;
    } else {
      this.stateActive = '';
    }
  }

  editDevice(device) {
    const url = `${this.baseUrl}/device/primary`;
    return this.http.post(url, device);
  }

  searchDeviceByName(name) {
    const url = `${this.baseUrl}/device/search?name=${name}`;
    return this.http.get(url).subscribe((devices: any) => this.displayingDevices.next(devices));
  }

  // ---------------------------------------------------------------------add device-modal-window
  getIsDeviceReadyStatus(id: string) {
    const url = `${this.baseUrl}/device/registration?deviceId=${id}`;
    return this.http.get(url);
  }

  addDevice(data) {
    const url = `${this.baseUrl}/device/registration`;
    return this.http.post(url, data);
  }

  // -------------------------------------------------------------------------history, firmware,updates
  getFirmwareUpdates() {
    const url = `${this.baseUrl}/firmware/list`;
    return this.http.get(url);
  }

  downloadUpdates(id: number): Observable<any> {
    const headers = new HttpHeaders();
    const options = {headers};
    options['responseType'] = 'blob';
    const url = `${this.baseUrl}/firmware/${id}/file`;
    return this.http.get(url, options);
  }

  getFiles() {
    const url = `${this.baseUrl}/instruction/list`;
    return this.http.get(url);
  }

  downloadFile(id: number): Observable<any> {
    const headers = new HttpHeaders();
    headers.set('Accept', 'application/octet-stream');
    const options = {headers};
    options['responseType'] = 'blob';
    const url = `${this.baseUrl}/instruction/${id}/file`;
    return this.http.get(url, options);
  }

  getHistory() {
    const url = `${this.baseUrl}/device/list/detailed`;
    return this.http.get(url);
  }

  getChartPoints(data, deviceType) {
    if (document.body.clientWidth > 790) {
      data.pointsMaxLimit = 50;
    } else if (document.body.clientWidth > 480) {
      data.pointsMaxLimit = 20;
    } else {
      data.pointsMaxLimit = 10;
    }

    this.urlDeviceType = `${this.baseUrl}/history/` + StaticData.GetDeviceTypeInfo(deviceType).endpoint;
    this.http.post(this.urlDeviceType, data).subscribe((response: any) => {

      if (response.some((item) => item.data.length === 0)) {
        return;
      } else {
        this.ChartPoints.next(response);
      }
    });
  }

  getPointFullInfo(id: number) {
    const url = `${this.baseUrl}/history/point?deviceDataId=${id}`;
    this.http.get(url).subscribe((data) => this.fullPointInfo.next(data));
  }

  getOwnedDevices(): Observable<BaseDeviceModel[]> {
    const url = `${this.baseUrl}/device/list/live`;
    return this.http.get<BaseDeviceModel[]>(url);
  }
}
