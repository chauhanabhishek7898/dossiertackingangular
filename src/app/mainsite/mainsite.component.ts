import { CitymasterService } from './../services/citymaster.service';
import {
  Component,
  ElementRef,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  UntypedFormBuilder,
  FormGroupDirective,
  NgForm,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { trigger, transition, style, animate } from '@angular/animations';
import { ErrorStateMatcher } from '@angular/material/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LoginService } from './Login/login.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CityMasterList } from './models/city-master';
import { Router } from '@angular/router';
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: UntypedFormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}
interface Food {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-mainsite',
  templateUrl: './mainsite.component.html',
  styleUrls: ['./mainsite.component.scss'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(200, style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class MainsiteComponent implements OnInit {
  onActivate(event) {
    window.scroll(0, 0);
  }

  @ViewChild('driversignup') private driversignup: TemplateRef<any>;
  @ViewChild('customersignup') private customersignup: TemplateRef<any>;
  customerSignupForm: UntypedFormGroup;
  foods: Food[] = [
    { value: 'steak-0', viewValue: 'Select Gender' },
    { value: 'pizza-1', viewValue: 'Male' },
    { value: 'tacos-2', viewValue: 'Female' },
  ];

  constructor(
    private formBuilder: UntypedFormBuilder,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private loginService: LoginService, //   private authService: AuthService, //   // private notifier: NotificationService,
    private cityDropDownService: CitymasterService,
    private router: Router //   private storageService: StorageService, //   private router: Router,
  ) {}
  driverSignupForm: UntypedFormGroup;
  userLoginForm: UntypedFormGroup;
  userForgetPasswordForm: UntypedFormGroup;
  ChiefComplaintForm: UntypedFormGroup;
  ModalTitle: String;
  modalRef: BsModalRef;

  @Input() disabled: boolean = true;

  emailFormControl = new UntypedFormControl('', [
    Validators.required,
    Validators.email,
  ]);
  maxDate;
  matcher = new MyErrorStateMatcher();
  ngOnInit(): void {
    this.driverSignupForm = this.formBuilder.group({
      nDriverId: 0,
      nUserId: [null],
      vDriverId: [null],
      nVId: [null],
      vGender: [null, [Validators.required]],
      dtDOB: [null, [Validators.required]],
      nCityId: [null, [Validators.required]],
      vPresentAddress: [null, [Validators.required]],
      vPermanentAddress: [null, [Validators.required]],
      vAlternateNo: [null, [Validators.required]],
      vLicenseNo: [null, [Validators.required]],
      vLicenseNoFilePath: [null, [Validators.required]], //  first file  //
      vAadhaarNo: [null, [Validators.required]],
      vAadhaarNoFilePath: [null, [Validators.required]], //  second file  //
      vPANNo: [null, [Validators.required]],
      vPANNoFilePath: [null, [Validators.required]], //  third file  //
      vVehicleRegistrationNo: [null, [Validators.required]],
      vVehicleRegistrationNoFilePath: [null, [Validators.required]], //  fourthfile  //
      vVehicleInsuranceFilePath: [null, [Validators.required]], //  fifth file  //
      vPhotoFilePath: [null, [Validators.required]], //  sixth file  //
      vFullName: [null, [Validators.required]],
      vMobileNo: [null, [Validators.required]],
      vPassword: [null, [Validators.required]],
      vEmailId: [null, [Validators.required]],
      btPromotion: [false, [Validators.required]],
      vDiriverCurrentLat: [null],
      vDiriverCurrentLong: [null],
      dConfirmPassword: [null, [Validators.required]],
      dTermCondition: [false, [Validators.required]],
    });
    this.userLoginForm = this.formBuilder.group({
      vUserName: [null, [Validators.required]],
      vPassword: [null, [Validators.required]],
      btRememberMe: [false],
      btLoginWithOtp: [false],
    });
    this.maxDate = new Date();
    this.loadProfilePic();
  }
  loadProfilePic() {
    // this.loader = true;
    this.loginService.loginAndGetUserDetailsByvUserNameOrvPassword(parseInt("6260216707"), parseInt("123")).subscribe(
      (patients) => {
        console.log('patients', patients);
        // alert(patients);
        //   this.vOtherRoleId = patients[0].vOtherRoleId
        // if (patients) {
        //   this.viewOtherRollModel = patients[0]
        //   this.selectedCity.nCityId = this.viewOtherRollModel?.nCityId!!
        //   this.selectedCity.CityDetails = this.viewOtherRollModel?.CityDetails
        //   this.viewUpdateProfileFrom.patchValue({
        //     vEmailId: this.viewOtherRollModel?.vEmailId,
        //     vMobileNo: this.viewOtherRollModel?.vMobileNo,
        //     nOtherRoleId: this.viewOtherRollModel?.nOtherRoleId,
        //     vOtherRoleId: this.viewOtherRollModel?.vOtherRoleId,
        //     vGender: this.viewOtherRollModel?.vGender,
        //     dtDOB: this.viewOtherRollModel?.dtDOB,
        //     vAddress: this.viewOtherRollModel?.vAddress,
        //     nCityId: this.viewOtherRollModel?.CityDetails,
        //     vOtherInformationIfAny: this.viewOtherRollModel?.vOtherInformationIfAny,
        //     vPinCode: this.viewOtherRollModel?.vPinCode,
        //     vFullName: this.viewOtherRollModel?.vFullName,
        //   });
      }

      //   else {
      //     this.notifier.showSuccess("Something Wrong");
      //   }
      //   setTimeout(() => {
      //     this.loader = false
      //   }, 300)
      // }
    );
  }
  get createUserLoginFormControls(): any {
    return this.userLoginForm.controls;
  }

  get createUserForgetPasswordFormControls(): any {
    return this.userForgetPasswordForm.controls;
  }

  items = [
    { id: 1, value: "Driver's Signup" },
    { id: 2, value: "Customer's Signup" },
  ];
  AddressChange(address: any) {
    //setting address from API to local variable
    console.log(address);

    console.log(address.geometry.location.lng());
    console.log(address.geometry.location.lat());
  }

  onchange(e) {
    let val = e.target.value;
    //  alert(val)
    if (val == "Driver's Signup") {
      this.modalRefdriversignup = this.modalService.show(
        this.driversignup,
        this.configdriversignup
      );
      this.modeltitledriversignup = "Driver's Signup";
    }
    if (val == "Customer's Signup") {
      this.modalRefcustomersignup = this.modalService.show(
        this.customersignup,
        this.configcustomersignup
      );
      this.modaltitlecustomersignup = "Customer's Signup";
    }
  }

  modeltitledriversignup: String;
  modalRefdriversignup: BsModalRef;
  configdriversignup: ModalOptions = {
    animated: true,
    backdrop: 'static',
    class: 'modal-dialog-centered modal-xl',
  };

  modaltitlecustomersignup: String;
  modalRefcustomersignup: BsModalRef;
  configcustomersignup: ModalOptions = {
    animated: true,
    backdrop: 'static',
    class: 'modal-dialog-centered modal-xl',
  };

  config: ModalOptions = {
    animated: true,
    backdrop: 'static',
    class: 'modal-dialog-centered modal-md',
  };

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
    this.ModalTitle = 'Login';
  }
  onSubmitUserLoginForm(): void {}

  //  extra useful code below  //

  isOtpReceived: boolean = false;
  isFPOtpReceived: boolean = false;
  otpVerified: boolean = false;
  fPOtpVerified: boolean = false;
  fPEmailIdMobileFound: boolean = false;
  countDownTimer: string;
  isRememberMe: boolean = false;
  resendOtpBtnDisabled: boolean = true;
  userEmail: string;
  userMobileNumber: string;
  btnLoader = false;
  isOtpLogin: boolean = false;
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
    // this.timerOn = false;
    this.btnLoader = false;
  }
  toggle_nav_list: boolean = false;
  toggle_nav() {
    this.toggle_nav_list = !this.toggle_nav_list;
  }
  openDriverSignup(template: TemplateRef<any>) {
    this.modalRefdriversignup = this.modalService.show(
      template,
      this.configdriversignup
    );
    this.modeltitledriversignup = "Driver's Signup";
  }
  openCstomersignup(template: TemplateRef<any>) {
    this.modalRefcustomersignup = this.modalService.show(
      template,
      this.configdriversignup
    );
    this.modaltitlecustomersignup = "Customer's Signup";
  }

  sendOtp() {
    // this.btnLoader = true;
    // this.isEmailOtp = this.userLoginForm.controls.botpEmail.value;
    // this.isMobileOtp = this.userLoginForm.controls.botpMobile.value;
    // if (this.isMobileOtp || this.isEmailOtp) {
    //   this.vEmailOrMobile = this.userLoginForm.controls.vEmailorPhone.value;
    //   this.authService.loginToOtp(this.vEmailOrMobile, this.isMobileOtp, this.isEmailOtp).subscribe((status: any) => {
    //     if (status.statusCode == 1) {
    //       this.userId = status.userData[0].nUserId
    //       if (this.isMobileOtp && this.isEmailOtp) {
    //         this.userMobileNumber = status.userData[0].MaskedMobileNo;
    //         this.userEmail = status.userData[0].MaskedEmailId;
    //       }
    //       else if (this.isMobileOtp) {
    //         this.userMobileNumber = status.userData[0].MaskedMobileNo;
    //         this.userEmail = null!!;
    //       } else {
    //         this.userEmail = status.userData[0].MaskedEmailId;
    //         this.userMobileNumber = null!!;
    //       }
    //       this.isOtpReceived = true;
    //       this.loginOtp = status.otp;
    //       this.otpBtnDisable = true;
    //       this.resendOtpBtnDisabled = true;
    //       this.timerOn = true;
    //       this.otPtimer(60);
    //     }
    //     else {
    //       alert(status.statusMsg);
    //     }
    //     setTimeout(() => {
    //       this.btnLoader = false
    //     }, 300)
    //   }, (error: HttpErrorResponse) => {
    //     alert(error.statusText);
    //   })
    // } else {
    //   alert("Please select either Mobile Number or Email Id.");
    //   setTimeout(() => {
    //     this.btnLoader = false
    //   }, 300)
    // }
  }

  // otPtimer(remaining: number) {
  //   let m = Math.floor(remaining / 60);
  //   let s = remaining % 60;
  //   m = m < 10 ? 0 + m : m;
  //   s = s < 10 ? 0 + s : s;
  //   this.countDownTimer = (m * 60) + s + ' second(s)';
  //   remaining -= 1;
  //   if (remaining >= 0 && this.timerOn) {
  //     setTimeout(() => {
  //       this.otPtimer(remaining);
  //     }, 1000);
  //     return;
  //   }
  //   if (!this.timerOn) {
  //     return;
  //   }
  //   this.countDownTimer = "";
  //   this.resendOtpBtnDisabled = false;
  // }

  onKeyUpEvent(event: any) {
    // this.otpVerified = false;
    // if (event.target.value.length == 4) {
    //   if (this.loginOtp == event.target.value) {
    //     this.otpVerified = true;
    //   }
    //   else {
    //     alert("OTP not matched");
    //     this.otpVerified = false;
    //   }
    // }
    // else {
    //   this.otpVerified = false;
    // }
  }

  otoLogin() {
    // this.btnLoader = true;
    // this.authService.getUserDetailsByUserId(this.userId).subscribe((users: any) => {
    //   if (users) {
    //     if (users.data.length > 0) {
    //       this.storageService.setMemberToken = users.jwtToken;
    //       this.goToDashboard(users.data[0])
    //     }
    //   }
    //   setTimeout(() => {
    //     this.btnLoader = false
    //   }, 300)
    // }, (error: HttpErrorResponse) => {
    //   alert(error.statusText);
    // });
  }

  toggle: boolean = false;

  onChkRemeber(e) {
    if (e.target.checked) {
      // this.storageService.userRememberMe = 'true';
    } else {
      // this.storageService.userRememberMe = 'false'
    }
  }

  sendOtpForgetPassword() {
    // this.btnLoader = true;
    // this.isEmailOtp = this.userForgetPasswordForm.controls.botpEmail.value;
    // this.isMobileOtp = this.userForgetPasswordForm.controls.botpMobile.value;
    // if (this.isEmailOtp == null) {
    //   this.isEmailOtp = false
    // }
    // if (this.isMobileOtp == null) {
    //   this.isMobileOtp = false
    // }
    // if (this.isMobileOtp || this.isEmailOtp) {
    //   this.fPEmailOrMobile = this.userForgetPasswordForm.controls.emailOrMobileNumber.value;
    //   this.authService.SendOtpToMobileOrEmailByUNorMCFP(this.fPEmailOrMobile, this.isMobileOtp, this.isEmailOtp).subscribe((status) => {
    //     if (status.statusCode == 1) {
    //       this.userId = status.userData[0].nUserId
    //       if (this.isMobileOtp && this.isEmailOtp) {
    //         this.userMobileNumber = status.userData[0].MaskedMobileNo;
    //         this.userEmail = status.userData[0].MaskedEmailId;
    //       }
    //       else if (this.isMobileOtp) {
    //         this.userMobileNumber = status.userData[0].MaskedMobileNo;
    //         this.userEmail = null!!;
    //       } else {
    //         this.userEmail = status.userData[0].MaskedEmailId;
    //         this.userMobileNumber = null!!;
    //       }
    //       this.isFPOtpReceived = true;
    //       this.forgetPasswordOtp = status.otp;
    //       this.fPOtpBtnDisable = true;
    //       this.fPEmailIdMobileFound = true;
    //       this.resendOtpBtnDisabled = true;
    //       this.timerOn = true;
    //       this.otPtimer(60);
    //     }
    //     else {
    //       alert(status.statusMsg);
    //       setTimeout(() => {
    //         this.btnLoader = false
    //       }, 300)
    //     }
    //     setTimeout(() => {
    //       this.btnLoader = false
    //     }, 300)
    //   }, (error: HttpErrorResponse) => {
    //     alert(error.statusText, "Server Error");
    //     this.btnLoader = false
    //   });
    // }
    // else {
    //   alert("Please select either Mobile Number  or Email Id.");
    //   setTimeout(() => {
    //     this.btnLoader = false
    //   }, 300)
    // }
  }

  matchForgetPasswordOtp(event) {
    if (event.target.value.length == 4) {
      // if (this.forgetPasswordOtp == event.target.value) {
      //   this.fPOtpVerified = true;
      //   this.isFPOtpReceived = false;
      // }
      // else {
      //   alert("OTP not matched");
      //   this.fPOtpVerified = false;
      // }
    }
  }

  fogetPassword() {
    // this.btnLoader = true;
    // let emailOrMobile = this.userForgetPasswordForm.controls.emailOrMobileNumber.value;
    // let newPassWord = this.userForgetPasswordForm.controls.userNewPassword.value;
    // let user = new UserMasterForgetPassword();
    // user.vUserIdORMemberCode = emailOrMobile;
    // user.vPassword = newPassWord;
    // this.authService.userMasterForgetPassword(user).subscribe((res) => {
    //   this.notifier.showSuccess(res);
    //   this.userForgetPasswordForm.reset();
    //   this.modalRef.hide();
    //   setTimeout(() => {
    //     this.btnLoader = false
    //   }, 300)
    // }, (error: HttpErrorResponse) => {
    //   alert(error.statusText)
    // });
  }

  pass: string = 'password';
  eye: boolean = false;
  eyeIconLogin(type) {
    if (type == 'hide') {
      this.pass = 'text';
      this.eye = true;
    }
    if (type == 'show') {
      this.pass = 'password';
      this.eye = false;
    }
  }

  pass1: string = 'password';
  eye1: boolean = false;
  eyeIconPasswordSignInDriver(type) {
    if (type == 'hide') {
      this.pass1 = 'text';
      this.eye1 = true;
    }
    if (type == 'show') {
      this.pass1 = 'password';
      this.eye1 = false;
    }
  }

  pass2: string = 'password';
  eye2: boolean = false;
  eyeIconConfirmPasswordSignInDriver(type) {
    if (type == 'hide') {
      this.pass2 = 'text';
      this.eye2 = true;
    }
    if (type == 'show') {
      this.pass2 = 'password';
      this.eye2 = false;
    }
  }

  opentermConditionComponent() {
    this.router.navigate(['/termsandcondition']);
  }
}
