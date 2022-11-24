import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
// import { NotificationService } from '/src/app/core/services/notification.service';
import { OtpSender } from 'src/app/core/services/otp.sender.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { UserSettingService } from 'src/app/core/services/user.setting.service';
import { UserValidationService } from 'src/app/core/services/user.validation.service';
import { UserMaster } from '../../../../models/user';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-update-email',
  templateUrl: './update-email.component.html',
  styleUrls: ['./update-email.component.scss'],
})
export class UpdateEmailComponent implements OnInit {

  modalRef: BsModalRef;
  ModalTitle: string;
  formType: string;
  updateEmailForm: FormGroup
  emailOtp: string
  timerOn = true;
  otpVerified: boolean = false
  countDownTimer: string;
  userMaster: UserMaster
  userDetails: UserMaster[] = [];
  resendOtpBtnDisabled: boolean = true;
  loader = false;
  eMailid: string;
  constructor(
    private modalService: BsModalService,
    private otpSender: OtpSender,
    // private notifier: NotificationService,
    private formBuilder: FormBuilder,
    private userSettingService: UserSettingService,
    private storageService: StorageService,
    private userValidationService: UserValidationService,
    private route: ActivatedRoute
  ) { }
 
  pageTitle: any
  
  ngOnInit(): void {
    this.pageTitle = this.route.snapshot.queryParams.title;
    this.updateEmailForm = this.formBuilder.group({
      'vEmailId': [null, Validators.required],
    })
    // this.loaderService.isModelPopUpLoading.next(false);
    // this.loaderService.isLoading.next(false);
  }
  get createupdateEmailFormControls(): any {
    return this.updateEmailForm.controls;
  }
  config: ModalOptions = {
    animated: true,
    backdrop: 'static',
    class: 'modal-dialog-centered modal-md',
  };
  openModal(template: TemplateRef<any>) {

    this.sendOtp(template);

    this.timerOn=false;
    
  }
  // sendOtp(template: TemplateRef<any>) {
  //   let emailId = this.updateEmailForm.controls.vEmailId.value;
  //   this.userValidationService.CheckExistsEmailId(emailId, parseInt(this.storageService.roleId!!)).subscribe((res) => {
  //     if (typeof res != 'string') {
  //       this.otpSender.sendOtpToEmail(emailId).subscribe((res) => {
  //         this.emailOtp = res;
  //         this.modalRef = this.modalService.show(template, this.config);
  //         this.ModalTitle = "Update Email Id";
  //         this.formType = "Send OTP"
  //         this.otPtimer(60);
  //       }, (error: HttpErrorResponse) => {
  //         // this.notifier.showError(error.statusText);
  //       });
  //     }
  //     else {
  //       this.notifier.showError(res);
  //     }
  //   }, (error: HttpErrorResponse) => {
  //     // this.notifier.showError(error.statusText);
  //   });
  // }
  sendOtp(template: TemplateRef<any>) {
    this.loader = true;
    let emailId = this.updateEmailForm.controls.vEmailId.value;
    this.eMailid = emailId;
    this.otpSender.SendOtpToEmailToChangeEmailId(emailId).subscribe((res) => {
      this.emailOtp = res;
      this.modalRef = this.modalService.show(template, this.config);
      this.ModalTitle = "Update Email Id";
      this.formType = "Send OTP"
      this.resendOtpBtnDisabled = true;
      this.timerOn= true;
      this.otPtimer(60);
      setTimeout(() => {
        this.loader = false
      }, 300)
    }, (error: HttpErrorResponse) => {
      // this.notifier.showError(error.statusText);
    });
  }
  otPtimer(remaining: number) {
    let m = Math.floor(remaining / 60);
    let s = remaining % 60;
    m = m < 10 ? 0 + m : m;
    s = s < 10 ? 0 + s : s;
    this.countDownTimer = (m * 60) + s + ' second(s)';
    //document.getElementById('timer').innerHTML = m + ':' + s;
    remaining -= 1;
    if (remaining >= 0 && this.timerOn) {
      setTimeout(() => {
        this.otPtimer(remaining);
      }, 1000);
      return;
    }

    if (!this.timerOn) {
      // Do validate stuff here
      return;
    }
    this.countDownTimer = "";
    this.resendOtpBtnDisabled = false;
  }
  onKeyUpEvent(event: any) {
    this.otpVerified = false;
    if (event.target.value.length == 4) {
      if (this.emailOtp == event.target.value) {
        this.otpVerified = true;
      }
      else {
        // this.notifier.showError("OTP not matched");
        this.otpVerified = false;
      }
    }
  }
  updateEmail() {
    this.loader = true;
    let emailId = this.updateEmailForm.controls.vEmailId.value;
    this.userMaster = new UserMaster();
    this.userMaster.nUserId = parseInt(this.storageService.userId!!);
    this.userMaster.vEmailId = emailId;
    let data={
      nUserId : parseInt(this.storageService.userId!!),
      vEmailId : emailId
    }
    this.userSettingService.updateUserEmail(data).subscribe((res) => {
      this.showSuccessMessage(res, 'success', true);
      this.updateEmailForm.reset();
      this.modalRef.hide();
      this.timerOn=false;
      setTimeout(() => {
        this.loader = false
      }, 300)
    }, (error: HttpErrorResponse) => {
      this.showWarningMessage(error.statusText, 'error', true);
    });
  }
  resendOtp() {
    this.loader = true;
    let emailId = this.updateEmailForm.controls.vEmailId.value;
    this.otpSender.SendOtpToEmailToChangeEmailId(emailId).subscribe((res) => {
      this.emailOtp = res;
      this.resendOtpBtnDisabled = true;
      // this.notifier.showSuccess("OTP Sent");
      this.timerOn= true;
      this.otPtimer(60);
      setTimeout(() => {
        this.loader = false
      }, 300)
    }, (error: HttpErrorResponse) => {
      // this.notifier.showError(error.statusText);
    });
  }
  showSuccessMessage(message, icon, showCancelButton = true) {
    return Swal.fire({
      // title: title,
      text: message,
      icon: icon,
      showCancelButton: showCancelButton,
    });
  }
  showWarningMessage(message, icon, showCancelButton = true) {
    return Swal.fire({
      // title: title,
      text: message,
      icon: icon,
      showCancelButton: showCancelButton,
    });
  }
}
