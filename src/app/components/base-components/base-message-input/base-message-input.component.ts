import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {IsNotEmpty} from '../../../validators/isEmpty.validator';
import {MatDialog} from '@angular/material';
import {ErrorSizeFileComponent} from '../../pop-up/error-size-file/error-size-file.component';
import {BaseMessageService} from '../base-message-service';

@Component({
  selector: 'app-base-message-input',
  templateUrl: './base-message-input.component.html',
  styleUrls: ['./base-message-input.component.css']
})
export class BaseMessageInputComponent {

  @ViewChild('fileInput') fileInput: ElementRef;

  MaxFileSizeBytes = 1024 * 1024 * 10; // 10 Mb
  fileData: object;
  newMessage: FormGroup = new FormGroup({
    textOfMessage: new FormControl('', [Validators.required, IsNotEmpty])
  });
  loadingProgress?: number = null;

  constructor(private dialog: MatDialog, protected messageService: BaseMessageService) {
  }

  onFileSelect($event) {
    const file = <File>$event.target.files[0];
    if (file && file.size > this.MaxFileSizeBytes) {
      $event.target.value = '';
      this.fileData = null;
      this.ShowPopUp();
    } else {
      this.fileData = file;
    }
  }

  ShowPopUp(): void {
    this.dialog.open(ErrorSizeFileComponent);
  }

  resetInput() {
    this.newMessage.controls['textOfMessage'].setValue('');
    this.fileInput.nativeElement.value = '';
    this.fileData = null;
  }


  sendMessage($event?: any) {
    if ($event) {
      $event.preventDefault();
    }

    const currentMessage = this.newMessage.controls['textOfMessage'].value;

    if (currentMessage) {
      this.messageService.addMessage(currentMessage).subscribe(data => {
        this.messageService.refreshMessages();
      });
    }

    if (this.fileData) {
      this.loadingProgress = 0;
      this.messageService.addFile(this.fileData).subscribe(loadedPart => {
          this.loadingProgress = Math.round(loadedPart * 100);
        }, error => this.loadingProgress = null,
        () => {
          this.messageService.refreshMessages();
          this.loadingProgress = null;
        }
      );
    }

    this.newMessage.controls['textOfMessage'].setValue('');
    this.fileInput.nativeElement.value = '';
    this.fileData = null;
  }
}
