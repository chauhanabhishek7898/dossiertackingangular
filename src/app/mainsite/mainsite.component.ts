import {
  Component,
  ElementRef,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroupDirective,
  NgForm,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { trigger, transition, style, animate } from '@angular/animations';
import { ErrorStateMatcher } from '@angular/material/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LoginService } from './Login/login.service';
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
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
  @ViewChild('driversignup') private driversignup: TemplateRef<any>;
  @ViewChild('customersignup') private customersignup: TemplateRef<any>;
  customerSignupForm: FormGroup;
  foods: Food[] = [
    { value: 'steak-0', viewValue: 'Select Gender' },
    { value: 'pizza-1', viewValue: 'Male' },
    { value: 'tacos-2', viewValue: 'Female' },
  ];
  constructor(
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private loginService: LoginService //   private authService: AuthService, //   private notifier: NotificationService,
  ) //   private storageService: StorageService,
  //   private router: Router,
  //   public loaderService: LoaderService,
  {}
  driverSignupForm: FormGroup;
  userLoginForm: FormGroup;
  userForgetPasswordForm: FormGroup;
  ChiefComplaintForm: FormGroup;
  ModalTitle: String;
  modalRef: BsModalRef;

  @Input() disabled: boolean = true;

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  maxDate;
  matcher = new MyErrorStateMatcher();
  ngOnInit(): void {
    this.customerSignupForm = this.formBuilder.group({
      nCId: [0],
      //  vCId: [null],
      vFullName: [null, [Validators.required]],
      vMobileNo: [null, [Validators.required]],
      vEmailId: [
        null,
        [Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')],
      ],
      vPassword: [null, [Validators.required]],
      vConfirmPassword: [null, [Validators.required]],
      dtDOB: [null, [Validators.required]],
      btPromotion: [null],
      nCityId: [null, [Validators.required]],
      vAddress: [null, [Validators.required]],
      vGender: [null, [Validators.required]],
      vAadhaarNo: [null, [Validators.required]],
      vAadhaarNoFilePath: [null], // one file (adhar file)  //
      vFlatNoPlotNoLaneBuilding: [null, [Validators.required]],

      dTermCondition: [false, [Validators.required]],
    });

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
      // vAnyOtherRemarks: [null, [Validators.required]],
      vFullName: [null, [Validators.required]],
      vMobileNo: [null, [Validators.required]],
      vPassword: [null, [Validators.required]],
      vEmailId: [null, [Validators.required]],
      btPromotion: [false, [Validators.required]],
      // btOnDuty:[null],
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
    this.ChiefComplaintForm = this.formBuilder.group({
      nChiefComplaintId: [0],
      vChiefComplaint: [null, [Validators.required]],
      btActive: new FormControl({ value: 'true', disabled: this.disabled }),
    });
    this.maxDate = new Date();
  }

  get createcustomerSignupFormControls(): any {
    return this.customerSignupForm.controls;
  }
  get createUserLoginFormControls(): any {
    return this.userLoginForm.controls;
  }

  get createUserForgetPasswordFormControls(): any {
    return this.userForgetPasswordForm.controls;
  }

  get createChiefComplaintFormControls(): any {
    return this.ChiefComplaintForm.controls;
  }
  get createdriverSignupFormControls(): any {
    return this.driverSignupForm.controls;
  }
  items = [
    { id: 1, value: "Driver's Signup" },
    { id: 2, value: "Customer's Signup" },
  ];
  onSubmitcustomerSignupForm() {}
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
    class: 'modal-dialog-centered modal-lg',
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

  // upload adhar sample code //
  file: File;
  files: any;
  fileSize: number;
  urlLink: string;
  fileName: string;
  selectedFileBLOB;
  fileNameSlice;
  fileFormetValid = false;
  ifSelect=false
  selectFiles(event) {
    this.urlLink = '';
    this.file = null!!;
    this.fileNameSlice = '';
    if (event.target.files) {
      this.files = event.target.files;
      this.file = event.target.files[0];
      if (
        this.file.name.split('.').pop() == 'pdf' ||
        this.file.name.split('.').pop() == 'jpg'
      ) {
        if (this.file.size > 2000000) {
          // this.notifier.showError(`Please Select File less than 2 MB`);
          alert('Please Select File less than 2 MB');
          this.file = null!!;
        } else {
          this.fileName = this.file.name;
          if (this.fileName.length > 6) {
            this.fileNameSlice = this.fileName.slice(0, 10);
          }
          this.urlLink = 'false';
          this.fileFormetValid = true;
          var reader = new FileReader();
          reader.readAsDataURL(this.file);
          reader.onload = (event: any) => {
            var blob = new Blob(this.files, { type: this.file.type });
            var url = window.URL.createObjectURL(blob);
            this.selectedFileBLOB = this.sanitizer.bypassSecurityTrustUrl(url);
          };
          this.ifSelect=true
        }
      } else {
        // this.notifier.showError(`Invalid file format. Please select .JPG or .PDF file formats.`);
        alert('Invalid file format. Please select .JPG or .PDF file formats.');
        this.fileFormetValid = false;
      }
      // event.target.value = null;
    }
  }
  // upload adhar sample code //

 // upload pan sample code //
  file2: File
  files2
  LogoFiles: any
  fileSize2: number
  LogoUrlLink: string
  LogoFileName: string
  LogoSelectedFileBLOB
  LogoFileNameSlice
  selectLogoFiles(event) {
      this.file2 = null!!;
      this.LogoFileNameSlice = '';
      this.LogoUrlLink = '';
      if (event.target.files) {
        this.files2 = event.target.files;
        this.file2 = event.target.files[0];
        console.log(this.file2);
        if (
          this.file2.name.split('.').pop() == 'pdf' ||
          this.file2.name.split('.').pop() == 'jpg'
        ) {
          if (this.file2.size > 2000000) {
            alert(`Please Select File less than 2 MB`);
            this.file2 = null!!;
          } else {
            this.LogoFileName = this.file2.name;
            if (this.LogoFileName.length > 6) {
              this.LogoFileNameSlice = this.LogoFileName.slice(0, 10);
            }
            var reader = new FileReader();
            this.LogoUrlLink = 'false';
            this.fileFormetValid = true;
            reader.readAsDataURL(this.file2);
            reader.onload = (event: any) => {
              // this.urlLink = event.target.result
              var blob2 = new Blob(this.files2, { type: this.file2.type });
              var url2 = window.URL.createObjectURL(blob2);
              this.LogoSelectedFileBLOB =
                this.sanitizer.bypassSecurityTrustUrl(url2);
            };
          }
        } else {
          alert(`Invalid file format. Please select .JPG or .PDF file formats.`);
          this.fileFormetValid = false;
        }
      }
    
  }
// upload pan sample code //

  // upload license sample code //
  file4: File;
  files4: any;
  LicenseFiles: any;
  fileSize4: number;
  LicenseUrlLink: string;
  LicenseFileName: string;
  LicenseSelectedFileBLOB;
  // fileFormetValid = true
  roleId;
  LicenseFileNameSlice;
  selectLicensePhotoFiles(event) {
    this.file4 = null!!;
    this.LicenseFileNameSlice = '';
    this.LicenseUrlLink = '';
    if (event.target.files) {
      this.files4 = event.target.files;
      this.file4 = event.target.files[0];
      console.log(this.file4);
      if (
        this.file4.name.split('.').pop() == 'pdf' ||
        this.file4.name.split('.').pop() == 'jpg'
      ) {
        if (this.file4.size > 2000000) {
          alert(`Please Select File less than 2 MB`);
          this.file4 = null!!;
        } else {
          this.LicenseFileName = this.file4.name;
          if (this.LicenseFileName.length > 6) {
            this.LicenseFileNameSlice = this.LicenseFileName.slice(0, 10);
          }
          var reader = new FileReader();
          this.LicenseUrlLink = 'false';
          this.fileFormetValid = true;
          reader.readAsDataURL(event.target.files[0]);
          reader.onload = (event: any) => {
            // this.urlLink = event.target.result
            var blob4 = new Blob(this.files4, { type: this.file4.type });
            var url4 = window.URL.createObjectURL(blob4);
            this.LicenseSelectedFileBLOB =
              this.sanitizer.bypassSecurityTrustUrl(url4);
          };
        }
      } else {
        alert(`Invalid file format. Please select .JPG or .PDF file formats.`);
        this.fileFormetValid = false;
      }
    }
  }
  // upload license sample code //

 

  //  fourth, fifth, sixth file driver code start  //
file5: File;
files5: any;
fileSize5: number;
urlLink4: string;
fileName4: string;
selectedFileBLOB4;
fileNameSlice4;
// fileFormetValid = false;
// ifSelect=false
selectFilesRegistration(event) {
  this.urlLink = '';
  this.file = null!!;
  this.fileNameSlice = '';
  if (event.target.files) {
    this.files = event.target.files;
    this.file = event.target.files[0];
    if (
      this.file.name.split('.').pop() == 'pdf' ||
      this.file.name.split('.').pop() == 'jpg'
    ) {
      if (this.file.size > 2000000) {
        // this.notifier.showError(`Please Select File less than 2 MB`);
        alert('Please Select File less than 2 MB');
        this.file = null!!;
      } else {
        this.fileName = this.file.name;
        if (this.fileName.length > 6) {
          this.fileNameSlice = this.fileName.slice(0, 10);
        }
        this.urlLink = 'false';
        this.fileFormetValid = true;
        var reader = new FileReader();
        reader.readAsDataURL(this.file);
        reader.onload = (event: any) => {
          var blob = new Blob(this.files, { type: this.file.type });
          var url = window.URL.createObjectURL(blob);
          this.selectedFileBLOB = this.sanitizer.bypassSecurityTrustUrl(url);
        };
        this.ifSelect=true
      }
    } else {
      // this.notifier.showError(`Invalid file format. Please select .JPG or .PDF file formats.`);
      alert('Invalid file format. Please select .JPG or .PDF file formats.');
      this.fileFormetValid = false;
    }
    // event.target.value = null;
  }
}
// upload adhar sample code //

// upload pan sample code //
file6: File
files6
LogoFiles6: any
fileSize6: number
LogoUrlLink6: string
LogoFileName6: string
LogoSelectedFileBLOB6
LogoFileNameSlice6
selectFilesInsurance(event) {
    this.file6 = null!!;
    this.LogoFileNameSlice6 = '';
    this.LogoUrlLink6 = '';
    if (event.target.files) {
      this.files6 = event.target.files;
      this.file6 = event.target.files[0];
      console.log(this.file6);
      if (
        this.file6.name.split('.').pop() == 'pdf' ||
        this.file6.name.split('.').pop() == 'jpg'
      ) {
        if (this.file6.size > 2000000) {
          alert(`Please Select File less than 2 MB`);
          this.file6 = null!!;
        } else {
          this.LogoUrlLink6 = this.file6.name;
          if (this.LogoFileName.length > 6) {
            this.LogoFileNameSlice6 = this.LogoUrlLink6.slice(0, 10);
          }
          var reader = new FileReader();
          this.LogoUrlLink6 = 'false';
          this.fileFormetValid = true;
          reader.readAsDataURL(this.file6);
          reader.onload = (event: any) => {
            // this.urlLink = event.target.result
            var blob2 = new Blob(this.files6, { type: this.file6.type });
            var url2 = window.URL.createObjectURL(blob2);
            this.LogoSelectedFileBLOB6 =
              this.sanitizer.bypassSecurityTrustUrl(url2);
          };
        }
      } else {
        alert(`Invalid file format. Please select .JPG or .PDF file formats.`);
        this.fileFormetValid = false;
      }
    }
  
}
// upload pan sample code //

// upload license sample code //
file7: File;
files7: any;
LicenseFiles7: any;
fileSize7: number;
LicenseUrlLink7: string;
LicenseFileName7: string;
LicenseSelectedFileBLOB7;
// fileFormetValid = true
LicenseFileNameSlice7;
selectFilesPhoto(event) {
  this.file7 = null!!;
  this.LicenseFileNameSlice7 = '';
  this.LicenseUrlLink7 = '';
  if (event.target.files) {
    this.files7 = event.target.files;
    this.file7 = event.target.files[0];
    console.log(this.file7);
    if (
      this.file7.name.split('.').pop() == 'pdf' ||
      this.file7.name.split('.').pop() == 'jpg'
    ) {
      if (this.file7.size > 2000000) {
        alert(`Please Select File less than 2 MB`);
        this.file7 = null!!;
      } else {
        this.LicenseFileName7 = this.file7.name;
        if (this.LicenseFileName7.length > 6) {
          this.LicenseFileNameSlice7 = this.LicenseFileName7.slice(0, 10);
        }
        var reader = new FileReader();
        this.LicenseUrlLink7 = 'false';
        this.fileFormetValid = true;
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (event: any) => {
          // this.urlLink = event.target.result
          var blob7 = new Blob(this.files7, { type: this.file7.type });
          var url7 = window.URL.createObjectURL(blob7);
          this.LicenseSelectedFileBLOB7 =
            this.sanitizer.bypassSecurityTrustUrl(url7);
        };
      }
    } else {
      alert(`Invalid file format. Please select .JPG or .PDF file formats.`);
      this.fileFormetValid = false;
    }
  }
}
 //  fourth, fifth, sixth file driver code end  //



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
    //       this.notifier.showError(status.statusMsg);
    //     }
    //     setTimeout(() => {
    //       this.btnLoader = false
    //     }, 300)
    //   }, (error: HttpErrorResponse) => {
    //     this.notifier.showError(error.statusText);
    //   })
    // } else {
    //   this.notifier.showError("Please select either Mobile Number or Email Id.");
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
    //     this.notifier.showError("OTP not matched");
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
    //   this.notifier.showError(error.statusText);
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
    //       this.notifier.showError(status.statusMsg);
    //       setTimeout(() => {
    //         this.btnLoader = false
    //       }, 300)
    //     }
    //     setTimeout(() => {
    //       this.btnLoader = false
    //     }, 300)
    //   }, (error: HttpErrorResponse) => {
    //     this.notifier.showError(error.statusText, "Server Error");
    //     this.btnLoader = false
    //   });
    // }
    // else {
    //   this.notifier.showError("Please select either Mobile Number  or Email Id.");
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
      //   this.notifier.showError("OTP not matched");
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
    //   this.notifier.showError(error.statusText)
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

  pass3: string = 'password';
  eye3: boolean = false;
  eyeIconPasswordSignInCustomer(type) {
    if (type == 'hide') {
      this.pass3 = 'text';
      this.eye3 = true;
    }
    if (type == 'show') {
      this.pass3 = 'password';
      this.eye3 = false;
    }
  }

  pass4: string = 'password';
  eye4: boolean = false;
  eyeIconConfirmPasswordSignInCustomer(type) {
    if (type == 'hide') {
      this.pass4 = 'text';
      this.eye4 = true;
    }
    if (type == 'show') {
      this.pass4 = 'password';
      this.eye4 = false;
    }
  }

  mobileNo: string;
  available: boolean = false;
  Unavailable: boolean = false;
  @ViewChild('searchInput') searchInput: ElementRef;

  onUserNameKeyUpEvent(event: any) {
    this.available = false;
    this.Unavailable = false;
    this.mobileNo = event.target.value;
    if (event.target.value.length == 0) {
      this.Unavailable = false;
      this.available = false;
    }
    if (!!event.target.value) {
      if (this.mobileNo.length > 9) {
        this.loginService
          .checkExistsMobileNo(this.mobileNo, 2)
          .subscribe((res) => {
            alert(res);
            // if (typeof res != "string") {
            //   this.available = true;
            // } else {
            //   this.Unavailable = true;
            // }
          });
      }
    }
  }

  // ConfirmedValidator(controlName: string, matchingControlName: string) {
  //   return (formGroup: FormGroup) => {
  //     const control = formGroup.controls[controlName];
  //     const matchingControl = formGroup.controls[matchingControlName];
  //     if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
  //       return;
  //     }
  //     if (control.value !== matchingControl.value) {
  //       matchingControl.setErrors({ confirmedValidator: true });
  //     } else {
  //       matchingControl.setErrors(null);
  //     }
  //   }
  // }

  //  login  //
}
