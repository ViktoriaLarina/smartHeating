import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BASE_URL_TOKEN} from '../configs';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


@Injectable()
export class RestorePasswordService {
  constructor(@Inject(BASE_URL_TOKEN) private baseUrl: string, private http: HttpClient) {
  }
  checkSecretCode(code): Observable<any> {
    const fullPath = `${this.baseUrl}/common/util/exists/restore_key`;
    return this.http.post(fullPath, code)
      .map(resp => resp)
      .catch((error: any) => Observable.throw(error));
  }
  sendPasswordToChange(pass, confPass, code) {
    const pwdDto = {
      secretKey: code,
      newPassword: pass,
      matchingPassword: confPass
    };
    const fullPath = `${this.baseUrl}/common/password/change_with_key`;
    return this.http.put(fullPath, pwdDto)
      .map(resp => resp)
      .catch((error: any) => Observable.throw(error));
  }
}
