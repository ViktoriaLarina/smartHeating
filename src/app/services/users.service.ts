import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';

import { UsersAuthData} from '../models/users-authdata.model';
import { UsersLoginForm } from '../models/users-loginform.model';
import { Language } from '../utils/language';
import { StaticData } from '../utils/static-data';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BASE_URL_TOKEN } from '../configs';
import {UsersDataOut} from '../models/dataOut/dataOut.model';

@Injectable()
export class UsersService {

  displayingUsers = new Subject<any>();
  arrayOfCountries = new Subject<any>();

  constructor(@Inject(BASE_URL_TOKEN) private baseUrl: string, private http: HttpClient, private router: Router) {
  }

  sendLang(lang) {
    const url = `${this.baseUrl}/iam/locale`;
    return this.http.patch(url, lang).subscribe();
  }

  // ------------------------------------------------------------owned users

  addOrUpdateChildForUser(id, dto) {
    const url = `${this.baseUrl}/owned/${id}`;
    return this.http.put(url, dto);
  }

  deleteOwnedUser(id) {
    const url = `${this.baseUrl}/owned?userId=${id}`;
    return this.http.delete(url);
  }

  // -----------------------------------------------------------------owned users end

  getUsers() {
    const url = `${this.baseUrl}/owned`;
    this.http.get(url).subscribe((user: UsersDataOut[]) => {
      this.displayingUsers.next(user);
    });
  }

  getInfoMyProfile(): Observable<any> {
    const url = `${this.baseUrl}/iam`;
    return this.http.get<any>(url);
  }

  updateMyInfo(dataToSend) {
    const url = `${this.baseUrl}/iam`;
    return this.http.put(url, dataToSend);
  }

  updateMyPassword(newPass) {
    const url = `${this.baseUrl}/password/change`;
    return this.http.put(url, newPass);
  }

  postDataUser(user: UsersAuthData) {
    const url = `${this.baseUrl}/common/register/user`;
    return this.http.post(url, user);
  }

  confirmDataUser(loginForm: UsersLoginForm): Observable<object> {
    const url = `${this.baseUrl}/common/signin`;
    return this.http.post(url, loginForm);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  saveRole(role: string) {
    localStorage.setItem('role', role);
  }

  getToken(): string {
    return localStorage.getItem('token');
  }

  getRole(): string {
    return localStorage.getItem('role');
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    return tokenNotExpired(null, token);
  }

  restorePassword(email: string) {
    const params = email;
    const url = `${this.baseUrl}/common/restore_pass`;
    return this.http.post(url, params);
  }

  checkLoginUser(login) {
    const params = login;
    const url = `${this.baseUrl}/common/util/unique/lg`;
    return this.http.post(url, params);
  }

  checkEmailUser(email: string) {
    const params = email;
    const url = `${this.baseUrl}/common/util/unique/em`;
    return this.http.post(url, params);
  }

  checkEmailforOwned(email: string) {
    const params = encodeURIComponent(email);
    const url = `${this.baseUrl}/owned/check?email=${params}`;
    return this.http.get(url);
  }

  sendGoogleToken(token: string) {
    const dto = {
      token: token,
      type: StaticData.Social[3]
    };
    const url = `${this.baseUrl}/common/social`;
    return this.http.post(url, dto);
  }

  getRegionsContacts() {
    const lang = Language.getLang();
    const url = `${this.baseUrl}/common/contacts/region/list/${lang}`;
    this.http.get(url).subscribe((data: any) => this.arrayOfCountries.next(data));
  }
}
