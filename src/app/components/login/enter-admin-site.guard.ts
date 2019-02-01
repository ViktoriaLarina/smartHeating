import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';

import {UsersService} from '../../services/users.service';
import { Role } from '../../utils/enums/roleEnum.model';
import {StaticData} from '../../utils/static-data';

@Injectable()
export class EnterAdminSiteGuard implements CanActivate {
  constructor(private userService: UsersService, private router: Router) {
  }

  canActivate() {
    if (this.userService.getToken() && localStorage.getItem('role') === Role.ADMIN) {
      return true;
    }
    this.router.navigate([StaticData.ROUTE_LOGIN]);
    return false;
  }
}
