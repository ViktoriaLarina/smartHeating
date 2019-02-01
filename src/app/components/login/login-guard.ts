import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Role } from '../../utils/enums/roleEnum.model';
import { StaticData } from '../../utils/static-data';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(private router: Router) {
  }

  canActivate() {
    if (localStorage.getItem('token')) {
      if (localStorage.getItem('role') === Role.ADMIN) {
        this.router.navigate([StaticData.ROUTE_ADMIN]);
        return false;
      } else if (localStorage.getItem('role') === Role.USER) {
        this.router.navigate([StaticData.ROUTE_HOME]);
        return false;
      }
    } else {
      return true;
    }
  }
}
