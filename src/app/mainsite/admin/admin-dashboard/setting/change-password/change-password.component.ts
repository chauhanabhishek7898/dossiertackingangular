import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
// import { NotificationService } from 'src/app/core/services/notification.service';
import { OtpSender } from 'src/app/core/services/otp.sender.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { UserSettingService } from 'src/app/core/services/user.setting.service';
import { UserValidationService } from 'src/app/core/services/user.validation.service';
import { UserMaster } from '../../../../models/user';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  
})
export class ChangePasswordComponent implements OnInit {
  modalRef: BsModalRef;
  ModalTitle: string;
  formType: string;
  updatePasswordForm: FormGroup
  emailOtp: string
  timerOn = true;
  otpVerified: boolean = false
  countDownTimer: string;
  userMaster: UserMaster;
  userDetails: UserMaster[] = [];
  resendOtpBtnDisabled: boolean = true;
  loader = false;
  constructor(
    private modalService: BsModalService,
    private otpSender: OtpSender,
    // private notifier: NotificationService,
    private formBuilder: FormBuilder,
    private userSettingService: UserSettingService,
    private storageService: StorageService,
    private userValidationService: UserValidationService,
    // public loaderService: LoaderService,
    private route: ActivatedRoute
  ) { }
 
  pageTitle: any
  
  ngOnInit(): void {
    this.pageTitle = this.route.snapshot.queryParams.title;
    this.updatePasswordForm = this.formBuilder.group({
      'currentPassword': [null, Validators.required],
      'newPassword': [null, Validators.required],
      'confirmPassword': [null, Validators.required],
    },
      {
        validator: this.ConfirmedValidator('newPassword', 'confirmPassword')
      }
    );
  }
  get createUpdatePasswordFormFormControls(): any {
    return this.updatePasswordForm.controls;
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
  sendOtp(template: TemplateRef<any>) {
    this.isValidPassword(template);
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
  updatePassword() {
    this.loader = true;
    let newPassword = this.updatePasswordForm.controls.newPassword.value;
    this.userMaster = new UserMaster();
    this.userMaster.nUserId = parseInt(this.storageService.userId!!);
    this.userMaster.vPassword = newPassword;
    this.userSettingService.updateUserPassword(this.userMaster).subscribe((res) => {
      // this.notifier.showSuccess(res);
      this.updatePasswordForm.reset();
      this.modalRef.hide();
      this.timerOn=false;
      setTimeout(() => {
        this.loader = false
      }, 300)
    }, (error: HttpErrorResponse) => {
      // this.notifier.showError(error.statusText);
    });
  }
  otpDestination
  emailId
  mobileNo
  isValidPassword(template: TemplateRef<any>) {
    this.loader = true;
    this.userValidationService.checkUsersOldPassword(this.updatePasswordForm.controls.currentPassword.value ,parseInt(this.storageService.userId!!)).subscribe((res) => {
      if (typeof res != "string") {
        this.userDetails = res;
        this.emailId= res[0].vEmailId
        this.mobileNo= res[0].vMobileNo
        this.otpSender.SendOtpToMobileAndEmailToChangePW(this.userDetails[0].vMobileNo, this.userDetails[0].vEmailId).subscribe((res) => {
         if(this.userDetails[0].vMobileNo){
           this.otpDestination = this.userDetails[0].vMobileNo;
         }
         else{
          this.otpDestination = this.userDetails[0].vEmailId;
         }
          this.emailOtp = res;
          this.modalRef = this.modalService.show(template, this.config);
          this.ModalTitle = "Update Password";
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
      else {
        // this.notifier.showError(res);
        setTimeout(() => {
          this.loader = false
        }, 300)
      }
    })
  }
  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }
  resendOtp() {
    this.loader = true;
    this.otpSender.SendOtpToMobileAndEmailToChangePW(this.userDetails[0].vMobileNo, this.userDetails[0].vEmailId).subscribe((res) => {
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
}


