import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {ActivatedRoute, Router} from '@angular/router';
import {RestorePasswordService} from '../../services/restore-password.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {confirmPasswordValidator} from '../../validators/ConfirmPasswordValidator';
import {PopupSuccessRestorePassComponent} from './popup-success-restore-pass/popup-success-restore-pass.component';
import {MatDialog} from '@angular/material';
import {RegExpData} from "../../utils/reqexp_data";

@Component({
  selector: 'app-restore-password',
  templateUrl: './restore-password.component.html',
  styleUrls: ['./restore-password.component.css']
})
export class RestorePasswordComponent implements OnInit {
  code: string;
  querySubscription: Subscription;
  block: boolean;

  newPassword = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
    Validators.pattern(RegExpData.PASSWORD_VALIDATOR)
  ]);

  confirmNewPassword = new FormControl('', [Validators.required,
    confirmPasswordValidator(this.newPassword)]
  );

  newPasswordForm = new FormGroup({
    newPassword: this.newPassword,
    confirmNewPassword: this.confirmNewPassword,
  });

  constructor(private route: ActivatedRoute, private router: Router, private restoreService: RestorePasswordService, public dialog: MatDialog) {
    this.block = false;

    this.querySubscription = route.queryParams
      .subscribe((queryParam: any) => {
        this.code = queryParam['secret_key'];
      });

    this.newPassword.valueChanges.subscribe(data => {
      this.confirmNewPassword.updateValueAndValidity();
    });
  }

  ngOnInit() {
    this.block = false;
    if (this.code) {
      this.restoreService.checkSecretCode(this.code).subscribe(resp => {
        if (resp) {
          this.block = true;
        } else {
          this.router.navigate(['/login/badCode']);
        }
      }, err => {
        if (err) {
          this.router.navigate(['/login/badCode']);
        }
      })
    } else {
      this.router.navigate(['/login/badCode']);
    }
  }

  sendPasswordToChange() {

    Object.keys(this.newPasswordForm.controls).forEach(key => {
      const control = this.newPasswordForm.get(key);
      control.markAsTouched();
      control.markAsDirty();
    });
    this.newPasswordForm.updateValueAndValidity();
    if (!this.newPasswordForm.valid) {
      return;
    }

    this.restoreService.sendPasswordToChange(this.newPassword.value, this.confirmNewPassword.value, this.code).subscribe(resp => {
      if (resp) {
        this.openDialogSuccess();
        setTimeout(() => this.router.navigate(['/login']), 3000);
      }
    });
  }

  openDialogSuccess(): void {
    const dialogRef = this.dialog.open(PopupSuccessRestorePassComponent, <any> {
      disableClose: true,
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
