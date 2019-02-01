import * as moment from 'moment';

export class OldDataUserProfile {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly birthday: moment.Moment;
  readonly phone: string;

  constructor(firstName: string, lastName: string, email: string, birthday: moment.Moment, phone: string) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.birthday = birthday;
    this.phone = phone;
  }
}
