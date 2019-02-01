import { Role } from '../../utils/enums/roleEnum.model';
import { SocialDataDto } from './users-socialdatadto.model';

import { SocialProvider } from '../../utils/enums/socialProviderEnum.model';
import { BaseDeviceModel } from '../baseDevice/baseDevice.model';

export class UsersDataOut {
  birthday: string;
  deviceDtos: BaseDeviceModel[];
  email: string;
  firmwareStatus: boolean;
  firstName: string;
  id: number;
  isOnline: string;
  isOwner: boolean;
  lastName: string;
  lastOnline: string;
  locale: string;
  newMsgCount: number;
  permissions: {};
  phone: string;
  role: Role;
  socialDataDtos: SocialDataDto[];
  socialProvider: SocialProvider;
}
