import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
// import { NotificationService } from 'src/app/core/service/notification.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { LoginService } from 'src/app/mainsite/Login/login.service';
import { UserMaster, RootUserSave, UserMasterForgetPassword } from 'src/app/mainsite/models/user';
import { CitymasterService } from 'src/app/services/citymaster.service';
import { AuthService } from './auth.services';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    // private notifier: NotificationService,
    private storageService: StorageService,
    private router: Router,
    private modalService: BsModalService,
  ) { }
  userLoginForm: FormGroup;
  userForgetPasswordForm: FormGroup;
  users: UserMaster[]
  roleId: number = 2
  listUserModel: UserMaster[] = [];
  addUserModel: UserMaster
  rootUserSave: RootUserSave
  subject = new Subject<string>();
  isOtpLogin: boolean = false;
  isMobileOtp: boolean = false;
  isEmailOtp: boolean = false;
  vEmailOrMobile: string
  loginOtp: string
  forgetPasswordOtp: string
  isOtpReceived: boolean = false
  otpBtnDisable: boolean = false;
  isFPOtpReceived: boolean = false
  fPOtpBtnDisable: boolean = false;
  timerOn = true;
  otpVerified: boolean = false
  fPOtpVerified: boolean = false
  fPEmailIdMobileFound: boolean = false;
  countDownTimer: string
  isRememberMe: boolean = false;
  modalRef: BsModalRef;
  ModalTitle: string;
  fPEmailOrMobile: string
  resendOtpBtnDisabled: boolean = true;
  userId: number;
  userEmail: string;
  userMobileNumber: string
  maskedDisplayEmailOrMobile: string
  loader = false;
  btnLoader = false;
  ngOnInit(): void {
    if (this.storageService.isUserRemberMe == 'true') {
      this.isRememberMe = true;
    }
    let userEmailOrPhone;
    if (this.storageService.isUserRemberMe == 'true') {
      userEmailOrPhone = this.storageService.getRememberMeUser;
    }
    this.userLoginForm = this.formBuilder.group({
      vUserName: [userEmailOrPhone, [Validators.required]],
      vPassword: [null, [Validators.required]],
      bRememberMe: [false],
      bOtp: [false],
      botpEmail: [false],
      botpMobile: [false]
    });
    this.userForgetPasswordForm = this.formBuilder.group({
      emailOrMobileNumber: [null],
      userNewPassword: [null, [Validators.required]],
      userNewConfirmPassword: [null, [Validators.required]],
      bOtp: [false],
      botpEmail: [false],
      botpMobile: [false]
    },
      {
        validator: this.ConfirmedValidator('userNewPassword', 'userNewConfirmPassword')
      }
    );
  }
  get createUserLoginFormControls(): any {
    return this.userLoginForm.controls;
  }
  get createUserForgetPasswordFormControls(): any {
    return this.userForgetPasswordForm.controls;
  }
  onSubmitUserLoginForm() { 
    let vEmailorPhone = this.userLoginForm.controls.vUserName.value;
    let vPassword = this.userLoginForm.controls.vPassword.value;
    if(vEmailorPhone==null && vPassword==null || vEmailorPhone==undefined && vPassword==undefined ){
      // this.notifier.showError("Please Enter UserName/MemberCode or password");
    }else{
      this.btnLoader = true;
      if (this.storageService.isUserRemberMe == 'true') {
        this.storageService.setRememberMe = vEmailorPhone;
      }
      this.authService.loginByvUserNameOrMemberCode(vEmailorPhone, vPassword).subscribe((users: any) => {
        console.log('users',users)
        if (users) {
          if (users.data.length > 0) {
            this.storageService.setMemberToken = users.jwtToken;
            this.storageService.setPatientAge = users.data[0].PatientAge;
            this.storageService.setvGender = users.data[0].Gender;
            this.goToDashboard(users.data[0])
          }
          else {
            // this.notifier.showError("Incorrect UserName/MemberCode or password");
            this.btnLoader = false
          }
        }
      }, (error: HttpErrorResponse) => {
        // this.notifier.showError(error.statusText);
        this.btnLoader = false
      });
    }
  }
  registerFacebookUser(user: UserMaster) {
    this.btnLoader = true;
    this.listUserModel = [];
    this.addUserModel = {
      nUserId: 0,
      nCityId: 0,
      vUserName: user.vUserName,
      vFullName: user.vFullName,
      // dtDOB: user.dtDOB,
      vPassword: "",
      vMobileNo: "",
      vRoleName: '',
      vGender: "",
      vEmailId: user.vEmailId,
      btMobileVerified: false,
      btEmailVerified: true,
      nRoleId: this.roleId,
      btIsActive: true,
      btFromFacebook: true,
      btPromotion: false,
      vEmailVerificationCode: "",
    };
    this.listUserModel.push(this.addUserModel);
    this.rootUserSave = {
      UserMaster: this.listUserModel
    }
    //this.rootUserSave.UserMaster.push(this.addUserModel)
    this.authService.registerUser(this.rootUserSave)
      .subscribe((status: string) => {
        if (status) {
          // this.notifier.showSuccess(status);
          this.goToDashboard(this.addUserModel);
          this.btnLoader = false
        }
      }, (error: HttpErrorResponse) => {
        // this.notifier.showError(error.statusText);
        this.btnLoader = false
      });
  }
  userid
  goToDashboard(user: UserMaster) {
    this.storageService.loginUserdetails = user;
    if (this.storageService.roleId == "1") {
      this.storageService.setHealthParameter = true;
      this.router.navigate(['/ad/country'], {
        state: {
          user: JSON.stringify(user)
        }
      });
    } 
    else {
      this.router.navigate(['/ad/country'], {
        state: {
          user: JSON.stringify(user)
        }
      });
    }
  }
  passwordHide: boolean = false;
  onCheckboxChange(e) {
    if (e.target.checked) {
      this.isOtpLogin = true;
      this.passwordHide = true;
    } else {
      this.isOtpLogin = false;
      this.passwordHide = false;
    }
  }
  backtosignup() {
    this.isOtpReceived = false;
    this.timerOn = false;
    this.btnLoader = false
  }
  sendOtp() {
    this.btnLoader = true;
    this.isEmailOtp = this.userLoginForm.controls.botpEmail.value;
    this.isMobileOtp = this.userLoginForm.controls.botpMobile.value;
    if (this.isMobileOtp || this.isEmailOtp) {
      this.vEmailOrMobile = this.userLoginForm.controls.vEmailorPhone.value;
      this.authService.loginToOtp(this.vEmailOrMobile, this.isMobileOtp, this.isEmailOtp).subscribe((status: any) => {
        if (status.statusCode == 1) {
          this.userId = status.userData[0].nUserId
          if (this.isMobileOtp && this.isEmailOtp) {
            this.userMobileNumber = status.userData[0].MaskedMobileNo;
            this.userEmail = status.userData[0].MaskedEmailId;
          }
          else if (this.isMobileOtp) {
            this.userMobileNumber = status.userData[0].MaskedMobileNo;
            this.userEmail = null!!;
          } else {
            this.userEmail = status.userData[0].MaskedEmailId;
            this.userMobileNumber = null!!;
          }
          this.isOtpReceived = true;
          this.loginOtp = status.otp;
          this.otpBtnDisable = true;
          this.resendOtpBtnDisabled = true;
          this.timerOn = true;
          this.otPtimer(60);
        }
        else {
          // this.notifier.showError(status.statusMsg);
        }
        setTimeout(() => {
          this.btnLoader = false
        }, 300)
      }, (error: HttpErrorResponse) => {
        // this.notifier.showError(error.statusText);
      })
    } else {
      // this.notifier.showError("Please select either Mobile Number or Email Id.");
      setTimeout(() => {
        this.btnLoader = false
      }, 300)
    }
  }
  otPtimer(remaining: number) {
    let m = Math.floor(remaining / 60);
    let s = remaining % 60;
    m = m < 10 ? 0 + m : m;
    s = s < 10 ? 0 + s : s;
    this.countDownTimer = (m * 60) + s + ' second(s)';
    remaining -= 1;
    if (remaining >= 0 && this.timerOn) {
      setTimeout(() => {
        this.otPtimer(remaining);
      }, 1000);
      return;
    }
    if (!this.timerOn) {
      return;
    }
    this.countDownTimer = "";
    this.resendOtpBtnDisabled = false;
  }
  onKeyUpEvent(event: any) {
    this.otpVerified = false;
    if (event.target.value.length == 4) {
      if (this.loginOtp == event.target.value) {
        this.otpVerified = true;
      }
      else {
        // this.notifier.showError("OTP not matched");
        this.otpVerified = false;
      }
    }
    else {
      this.otpVerified = false;
    }
  }
  otoLogin() {
    let vDeviceId= null
    this.btnLoader = true;
    this.authService.getUserDetailsByUserId(this.userId,vDeviceId).subscribe((users: any) => {
      if (users) {
        if (users.data.length > 0) {
          this.storageService.setMemberToken = users.jwtToken;
          this.goToDashboard(users.data[0])
        }
      }
      setTimeout(() => {
        this.btnLoader = false
      }, 300)

    }, (error: HttpErrorResponse) => {
      // this.notifier.showError(error.statusText);
    });
  }
  toggle: boolean = false;
  doctorClick() {
    if (this.roleId == 1) {
      this.roleId = 2;
      this.toggle = true;
    }
    else {
      this.roleId = 1;
      this.toggle = false;
    }
  }
  onChkRemeber(e) {
    if (e.target.checked) {
      this.storageService.userRememberMe = 'true';
    }
    else {
      this.storageService.userRememberMe = 'false'
    }
  }
  config: ModalOptions = {
    animated: true,
    backdrop: 'static',
    class: 'modal-dialog-centered modal-md',
  };
  openModal(template: TemplateRef<any>) {
    this.isFPOtpReceived = false
    this.fPOtpBtnDisable = false;
    this.fPOtpVerified = false;
    this.fPEmailIdMobileFound = false;
    this.modalRef = this.modalService.show(template, this.config);
    this.userForgetPasswordForm.get('emailOrMobileNumber')?.setValue(this.userLoginForm.controls.vEmailorPhone.value);
    this.ModalTitle = "Forget Password";
    // this.modalRef.onHide.subscribe(() => {
    //   this.timerOn = false;
    // });
  }
  sendOtpForgetPassword() {
    this.btnLoader = true;
    this.isEmailOtp = this.userForgetPasswordForm.controls.botpEmail.value;
    this.isMobileOtp = this.userForgetPasswordForm.controls.botpMobile.value;
    if (this.isEmailOtp == null) {
      this.isEmailOtp = false
    }
    if (this.isMobileOtp == null) {
      this.isMobileOtp = false
    }
    if (this.isMobileOtp || this.isEmailOtp) {
      this.fPEmailOrMobile = this.userForgetPasswordForm.controls.emailOrMobileNumber.value;
      this.authService.SendOtpToMobileOrEmailByUNorMCFP(this.fPEmailOrMobile, this.isMobileOtp, this.isEmailOtp).subscribe((status) => {
        if (status.statusCode == 1) {
          this.userId = status.userData[0].nUserId

          if (this.isMobileOtp && this.isEmailOtp) {
            this.userMobileNumber = status.userData[0].MaskedMobileNo;
            this.userEmail = status.userData[0].MaskedEmailId;
          }
          else if (this.isMobileOtp) {
            this.userMobileNumber = status.userData[0].MaskedMobileNo;
            this.userEmail = null!!;
          } else {
            this.userEmail = status.userData[0].MaskedEmailId;
            this.userMobileNumber = null!!;
          }
          this.isFPOtpReceived = true;
          this.forgetPasswordOtp = status.otp;
          this.fPOtpBtnDisable = true;
          this.fPEmailIdMobileFound = true;
          this.resendOtpBtnDisabled = true;
          this.timerOn = true;
          this.otPtimer(60);
        }
        else {
          // this.notifier.showError(status.statusMsg);
          setTimeout(() => {
            this.btnLoader = false
          }, 300)
        }
        setTimeout(() => {
          this.btnLoader = false
        }, 300)
      }, (error: HttpErrorResponse) => {
        // this.notifier.showError(error.statusText, "Server Error");
        this.btnLoader = false
      });
    }
    else {
      // this.notifier.showError("Please select either Mobile Number  or Email Id.");
      setTimeout(() => {
        this.btnLoader = false
      }, 300)
    }
  }
  matchForgetPasswordOtp(event) {
    if (event.target.value.length == 4) {
      if (this.forgetPasswordOtp == event.target.value) {
        this.fPOtpVerified = true;
        this.isFPOtpReceived = false;
      }
      else {
        // this.notifier.showError("OTP not matched");
        this.fPOtpVerified = false;
      }
    }
  }
  fogetPassword() {
    this.btnLoader = true;
    let emailOrMobile = this.userForgetPasswordForm.controls.emailOrMobileNumber.value;
    let newPassWord = this.userForgetPasswordForm.controls.userNewPassword.value;
    let user = new UserMasterForgetPassword();
    user.vUserIdORMemberCode = emailOrMobile;
    user.vPassword = newPassWord;
    this.authService.userMasterForgetPassword(user).subscribe((res) => {
      // this.notifier.showSuccess(res);
      this.userForgetPasswordForm.reset();
      this.modalRef.hide();
      setTimeout(() => {
        this.btnLoader = false
      }, 300)
    }, (error: HttpErrorResponse) => {
      // this.notifier.showError(error.statusText)
    });
  }
  pass: string = 'password'
  eye: boolean = false;
  eyeIcon(type) {
    if (type == 'hide') {
      this.pass = 'text'
      this.eye = true
    }
    if (type == 'show') {
      this.pass = 'password'
      this.eye = false
    }
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
}
