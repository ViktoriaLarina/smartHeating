import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { UsersService } from '../../services/users.service';
import { Role } from '../../utils/enums/roleEnum.model';
import { StaticData } from '../../utils/static-data';

@Injectable()
export class EnterSiteGuard implements CanActivate {
  constructor(private userService: UsersService, private router: Router) {
  }

  canActivate() {
    if (this.userService.getToken()) {
      if (localStorage.getItem('role') === Role.ADMIN) {
        this.router.navigate([StaticData.ROUTE_ADMIN]);
        return false;
      } else if (localStorage.getItem('role') === Role.USER) {
        return true;
      } else {
        this.userService.logout();
        return false;
      }
    } else {
      this.router.navigate([StaticData.ROUTE_LOGIN]);
      return false;
    }
  }
}
