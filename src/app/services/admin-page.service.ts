import {HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';
import {BASE_URL_TOKEN} from '../configs';
import {FirmwareOrFileDTOModel} from '../models/dataOut/firmwareOrFileDTO.model';
import {FirmwareOrFileModel} from '../models/firmwareOrFile.model';

@Injectable()
export class AdminPageService {

  deletedFirmware = new Subject<boolean>();
  deletedFileInstruction = new Subject<boolean>();
  firmwareArray = new Subject<FirmwareOrFileModel[]>();
  instructionArray = new Subject<any>();
  devicesToShow = new Subject<any>();
  usersToShow = new Subject<any>();
  urlToRequest: string;
  urlToRequestLog: string;
  searchParams = {
    criteria: null,
    query: null,
    pageNumber: null,
    pageSize: null
  };
  subscription: Subscription;

  clickButtonShowMap = new Subject<any>();
  clickButtonShowUserInfo = new Subject<any>();
  clickButtonShowDeviceInfo = new Subject<any>();
  itemIdLogHistory: number;

  constructor(@Inject(BASE_URL_TOKEN) private baseUrl: string,
              private http: HttpClient) {
    this.clickButtonShowMap.subscribe((index: number) => this.itemIdLogHistory = index);
  }

  getWaitingDevices() {
    const url = `${this.baseUrl}/device/registration/list`;
    return this.http.get(url);
  }

  // --------------------------------------------instructions
  createInstruction(data: FirmwareOrFileDTOModel): Observable<any> {
    const url = `${this.baseUrl}/admin/instruction`;
    return this.http.post(url, data);
  }

  uploadInstructionFile(data, InstructionId) {
    const file = new FormData();
    file.append('file', data);
    const url = `${this.baseUrl}/admin/instruction/${InstructionId}`;
    return this.http.post(url, file);
  }

  findAllInstructions() {
    const url = `${this.baseUrl}/admin/instruction/list`;
    this.http.get(url).subscribe((data: any) => {
      this.instructionArray.next(data);
    });
  }

  removeInstruction(id: number) {
    const url = `${this.baseUrl}/admin/instruction?instructionId=${id}`;
    return this.http.delete(url).subscribe(() => {
      this.deletedFileInstruction.next(true);
    }, (error2) => {
      this.deletedFileInstruction.next(true);
    });
  }

  updateInstruction(data) {
    const url = `${this.baseUrl}/admin/instruction`;
    return this.http.put(url, data);
  }

  changeParamShowInstruction(isShow, id) {
    const url = `${this.baseUrl}/admin/instruction/${id}`;
    return this.http.patch(url, isShow.toString());
  }

// //  -----------------------------------------firmware
  createFirmware(data: FirmwareOrFileDTOModel): Observable<any> {
    const url = `${this.baseUrl}/admin/firmware`;
    return this.http.post(url, data);
  }

  uploadFirmwareFile(data, firmwareId) {
    const fileToSend = new FormData();
    fileToSend.append('file', data);
    const url = `${this.baseUrl}/admin/firmware/${firmwareId}`;
    return this.http.post(url, fileToSend);
  }

  findAllFirmwares(): void {
    const url = `${this.baseUrl}/admin/firmware/list`;
    this.http.get(url).subscribe((data: FirmwareOrFileModel[]) => {
      this.firmwareArray.next(data);
    });
  }

  removeFirmware(id: number) {
    const url = `${this.baseUrl}/admin/firmware?firmwareId=${id}`;
    return this.http.delete(url).subscribe((data) => {
      this.deletedFirmware.next(true);
    }, (error2) => {
      this.deletedFirmware.next(true);
    });
  }

  updateFirmware(data) {
    const url = `${this.baseUrl}/admin/firmware`;
    return this.http.put(url, data);
  }

  changeParamShowFirmwareForOwners(isShow, id) {
    const url = `${this.baseUrl}/admin/firmware/${id}`;
    return this.http.patch(url, isShow.toString());
  }

//  ------------------------------------------------contacts
  saveOrUpdateRegion(data) {
    const url = `${this.baseUrl}/admin/contacts/region`;
    // const url = `${this.baseUrl}/admin/contacts/region/${locale}`;
    return this.http.post(url, data);
  }

  deleteRegion(id) {
    const url = `${this.baseUrl}/admin/contacts/region/${id}`;
    return this.http.delete(url);
  }

  deleteOffice(id) {
    const url = `${this.baseUrl}/admin/contacts/office/${id}`;
    return this.http.delete(url);
  }

  // -----------------------------------------devices
  getdeviceFullInfo(id) {
    const url = `${this.baseUrl}/admin/device/${id}`;
    return this.http.get(url);
  }

  getCountAllDevices() {
    const url = `${this.baseUrl}/admin/device/count`;
    return this.http.get(url);
  }

  getDevices() {
    this.urlToRequest = `${this.baseUrl}/admin/device/search?pageSize=${this.searchParams.pageSize}&pageNum=${this.searchParams.pageNumber}`;
    if (this.searchParams.query) {
      this.urlToRequest = `${this.baseUrl}/admin/device/search?pageSize=${this.searchParams.pageSize}&pageNum=0&criteria=${this.searchParams.criteria}&query=${this.searchParams.query}`;
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = this.http.get(this.urlToRequest).subscribe((data) => this.devicesToShow.next(data));
  }

  removeDevice(id) {
    const url = `${this.baseUrl}/device/remove/${id}`;
    return this.http.delete(url);
  }

  getDeviceUsers(id) {
    const url = `${this.baseUrl}/admin/device/users?deviceId=${id}`;
    return this.http.get(url);
  }

  getDeviceData(id) {
    const url = `${this.baseUrl}/admin/device/data?deviceId=${id}`;
    return this.http.get(url);
  }

  // -------------------------------users
  getCountAllUsers() {
    const url = `${this.baseUrl}/admin/user/count`;
    return this.http.get(url);
  }

  getUserFullInfo(id) {
    const url = `${this.baseUrl}/admin/user/${id}`;
    return this.http.get(url);
  }

  getUsers() {
    this.urlToRequest = `${this.baseUrl}/admin/user/list?pageSize=${this.searchParams.pageSize}&pageNum=${this.searchParams.pageNumber}`;
    if (this.searchParams.query) {
      this.urlToRequest = `${this.baseUrl}/admin/user/list?pageSize=${this.searchParams.pageSize}&pageNum=0&criteria=${this.searchParams.criteria}&search=${this.searchParams.query}`;
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = this.http.get(this.urlToRequest).subscribe((data) => this.usersToShow.next(data));
  }

  getUsersDevices(id) {
    const url = `${this.baseUrl}/admin/user/devices?userId=${id}`;
    return this.http.get(url);
  }

  findGroupIn(id) {
    const url = `${this.baseUrl}/admin/user/groupin?userId=${id}`;
    return this.http.get(url);
  }

  findGroupOwner(id) {
    const url = `${this.baseUrl}/admin/user/owned?userId=${id}`;
    return this.http.get(url);
  }

  forceUpdateUserInfo(dto, id) {
    const url = `${this.baseUrl}/admin/user/${id}/force`;
    return this.http.put(url, dto);
  }

//  ---------------------log history
  getLogHistory(pageSize, pageNumber, target?) {
    if (target) {
      this.urlToRequestLog = `${this.baseUrl}/admin/log/access_log?target=${target}&pageNum=${pageNumber}&pageSize=${pageSize}`;
    } else {
      this.urlToRequestLog = `${this.baseUrl}/admin/log/access_log?pageNum=${pageNumber}&pageSize=${pageSize}`;
    }

    return this.http.get(this.urlToRequestLog);
  }

}
