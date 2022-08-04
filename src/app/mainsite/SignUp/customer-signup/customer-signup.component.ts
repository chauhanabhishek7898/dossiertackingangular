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
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/mainsite/Login/login.service';
import * as _moment from 'moment';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { default as _rollupMoment } from 'moment';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CityMasterList } from '../../models/city-master';
import { CitymasterService } from 'src/app/services/citymaster.service';
import {
  debounceTime,
  map,
  startWith,
  switchMap,
  tap,
  finalize,
  distinctUntilChanged,
  filter,
} from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { NotificationService } from 'src/app/core/service/notification.service';
import { CustomerSignupService } from './customer-signup.service';
import {
  CustomerMaster,
  CustomerMasterClass,
} from '../../models/CustomerMaster';
import { parseDateToString } from '../../shared-function/sharedFunction';
const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD-MM-YYYY',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-customer-signup',
  templateUrl: './customer-signup.component.html',
  styleUrls: ['./customer-signup.component.scss'],
  providers: [
    DatePipe,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class CustomerSignupComponent implements OnInit {
  maxDate = new Date();
  customerSignupForm: FormGroup;
  errorMsg!: string;
  minLengthTerm = 3;
  apiUrl = environment.dossiarApiUrl;
  mobileVerified = false;
  emailVerified = false;
  searchCityCtrl = new FormControl(Validators.required);
  btnLoader = false;
  available: boolean = false;
  Unavailable: boolean = false;
  @Input()
  maxlength: string | number | null;
  constructor(
    private loginService: LoginService,
    private formBuilder: FormBuilder,
    private router: Router,
    private sanitizer: DomSanitizer,
    private customerSignupService: CustomerSignupService,
    private http: HttpClient,
    private notifier: NotificationService,
    private modalService: BsModalService
  ) {}
  //  city dropdown end here  //
  // selectedCity: any = { CityDetailsState: "Gurgaon - Haryana" };
  selectedCity: any = { CityStateDetails: '' };
  selectedSpecilization: any = '';
  cityName1 = 'Gurgaon';
  cityId: any = null;
  cityMasterList: CityMasterList[] = [];
  isLoading = false;
  onSelected() {
    this.selectedCity = this.selectedCity;
    this.cityId = this.selectedCity.nCityId;
    this.cityName1 = this.selectedCity.vCityName;
  }
  displayWith(value: any) {
    return value?.CityStateDetails;
  }
  clearSelection(e) {
    if (e.target.value == '') {
      this.selectedCity = '';
      this.cityMasterList = [];
      this.cityId = null;
    }
  }
  ngOnInit(): void {
    this.searchCityCtrl.valueChanges
      .pipe(
        filter((res) => {
          return res !== null && res.length >= this.minLengthTerm;
        }),
        distinctUntilChanged(),
        debounceTime(200),
        tap(() => {
          this.errorMsg = '';
          this.cityMasterList = [];
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.http
            .get(
              `${this.apiUrl}/CityMaster/CityMaster_SelectAll_ActiveLikeSearch/${value}`
            )
            .pipe(
              finalize(() => {
                this.isLoading = false;
              })
            )
        )
      )
      .subscribe((data: any) => {
        if (data == undefined) {
          this.errorMsg = 'error';
          this.cityMasterList = [];
        } else {
          this.errorMsg = '';
          this.cityMasterList = data;
        }
        console.log(this.cityMasterList);
      });
    this.customerSignupForm = this.formBuilder.group(
      {
        nCId: [0],
        vCId: [null],
        vFullName: [null, [Validators.required]],
        vMobileNo: [null, [Validators.required]],
        vEmailId: [null, [Validators.required]],
        vPassword: [null, [Validators.required]],
        vConfirmPassword: [null, [Validators.required]],
        dtDOB: [null, [Validators.required]],
        btPromotion: [false],
        nCityId: [null],
        vAddress: [null, [Validators.required]],
        vGender: [null, [Validators.required]],
        vAadhaarNo: [null, [Validators.required]],
        vAadhaarNoFilePath: [null, [Validators.required]], // one file (adhar file)  //
        vFlatNoPlotNoLaneBuilding: [null, [Validators.required]],
        dTermCondition: [false],
      },
      {
        validator: this.ConfirmedValidator('vPassword', 'vConfirmPassword'),
      }
    );
  }
  addCustomerUserModel: CustomerMaster;
  listCustomer: CustomerMaster[] = [];
  CustomerMasterClass: CustomerMasterClass;
  //  signup customer  //

  submitCustomerSignup() {
    this.btnLoader = true;
    // console.log(this.mobileVerified);
    // console.log(this.emailVerified);
    if (!this.cityId) {
      alert('please Select City');
    } else {
      if (this.mobileVerified == false || this.emailVerified == false) {
        alert('Please Verify Both Fields');
      } else {
        this.btnLoader = true;
        this.listCustomer = [];

        let docUploadId;
        let fp;
        let fz;
        let fn;
        docUploadId = 0;
        fp = '';
        fz = 0;
        fn = '';

        if (this.file) {
          this.fileSize = (this.file.size / 1024) as number;
        }

        this.addCustomerUserModel = {
          nCId: 0,
          // vCId: this.customerSignupForm.controls.vCId.value,
          // nUserId: 0,
          vGender: this.customerSignupForm.controls.vGender.value,
          dtDOB: parseDateToString(
            this.customerSignupForm.controls.dtDOB.value
          ),
          vAadhaarNo: this.customerSignupForm.controls.vAadhaarNo.value,
          vAadhaarNoFilePath: '',
          vFullName: this.customerSignupForm.controls.vFullName.value,
          vMobileNo: this.customerSignupForm.controls.vMobileNo.value,
          vPassword: this.customerSignupForm.controls.vPassword.value,
          vEmailId: this.customerSignupForm.controls.vEmailId.value,
          btPromotion: true,
          nCityId: this.cityId,
          vAddress: this.customerSignupForm.controls.vAddress.value,
          vFlatNoPlotNoLaneBuilding:
            this.customerSignupForm.controls.vFlatNoPlotNoLaneBuilding.value,
        };

        this.listCustomer.push(this.addCustomerUserModel);
        //   CustomerMasterClass
        this.CustomerMasterClass = {
          CustomerMaster: this.listCustomer,
        };
        console.log('CustomerMasterClass', this.CustomerMasterClass);

        console.log('this.file', this.file);
        this.customerSignupService
          .PostCreateUserCustomer(this.CustomerMasterClass, this.file)
          .subscribe(
            (status: any) => {
              // this.apiStatus = `Congratulations, User has been created successfully with member Code:  ${status[0].MemberCode}. You may further use it to login in the APP.
              // Though, it has to be approved by the APP Administrator before logging in. Thanks, for your kind patience.`;
              if (status) {
                console.log('status', status);
                // this.success = true;
                // this.isOtp = false;
              }
              setTimeout(() => {
                this.btnLoader = false;
              }, 300);
            },
            (error: HttpErrorResponse) => {
              console.log('error', error);
              // this.apiError = error.statusText
              // this.error = true
              // setTimeout(() => {
              //   this.error = false
              // }, 3000)
            }
          );
      }
    }
  }
  //  signup customer  //
  mobileNo: string;

  otpVerify = false;
  emailOtpVerify = false;
  @ViewChild('searchInput') searchInput: ElementRef;
  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (
        matchingControl.errors &&
        !matchingControl.errors.confirmedValidator
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
  onUserNameKeyUpEvent(event: any) {
    this.available = false;
    this.Unavailable = false;
    this.mobileNo = event.target.value;
    if (event.target.value.length == 0) {
      this.Unavailable = false;
      this.available = false;
      this.otpVerify = false;
    }
    if (!!event.target.value) {
      if (this.mobileNo.length > 9) {
        this.loginService
          .checkExistsMobileNo(this.mobileNo, 3)
          .subscribe((res) => {
            console.log('res', res);
            if (typeof res != 'string') {
              this.otpVerify = true;
              this.available = true;
            } else {
              this.Unavailable = true;
            }
          });
      } else {
        this.otpVerify = false;
        this.Unavailable = true;
      }
    }
  }
  timers;
  emailvalidate(event: any) {
    clearTimeout(this.timers);
    let validate = /^[ ]*([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})[ ]*$/i;
    this.timers = setTimeout(() => {
      if (validate.test(event.target.value)) {
        this.emailOtpVerify = true;
      } else {
        this.emailOtpVerify = false;
      }
    }, 500);
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
  opentermConditionComponent() {
    this.router.navigate(['/termsandcondition']);
  }
  // upload adhar sample code //
  file: File;
  files: any;
  fileSize: number;
  urlLink: string;
  fileName: string;
  selectedFileBLOB;
  fileNameSlice;
  fileFormetValid = false;
  ifSelect = false;
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
          alert(`Please Select File less than 2 MB`);
          // alert('Please Select File less than 2 MB');
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
          this.ifSelect = true;
        }
      } else {
        alert(`Invalid file format. Please select .JPG or .PDF file formats.`);
        // alert('Invalid file format. Please select .JPG or .PDF file formats.');
        this.fileFormetValid = false;
      }
      // event.target.value = null;
    }
  }
  OTPModalTitle: string;
  OTPmodalRef: BsModalRef;
  mobileNoOtp = false;
  emailIdOtp = false;
  submitBtn = false;
  OTPconfig: ModalOptions = {
    animated: true,
    backdrop: 'static',
    class: 'modal-dialog-centered modal-md',
  };
  onKeyUpEventForMobile(event: any) {
    if (event.target.value.length == 4) {
      if (this.otp == event.target.value) {
        this.OTPmodalRef.hide();
        this.mobileDisable = true;
        this.otpVerify = false;
        this.mobileVerified = true;
      } else {
        this.notifier.showError('OTP not matched');
        this.mobileDisable = false;
        this.mobileVerified = false;
      }
    }
  }
  onKeyUpEventForEmail(event: any) {
    if (event.target.value.length == 4) {
      if (this.otp == event.target.value) {
        this.OTPmodalRef.hide();
        this.emailDisable = true;
        this.emailOtpVerify = false;
        this.emailVerified = true;
      } else {
        this.notifier.showError('OTP not matched');
        this.emailDisable = false;

        this.emailVerified = false;
      }
    }
  }
  userMobileNo;
  isOtp: boolean = false;
  otpBtnDisable: boolean = false;
  countDownTimer: any;
  MobileNo;
  timerOn = true;
  otp: string;
  resendOtpBtnDisabled: boolean = true;
  mobileDisable = false;
  emailDisable = false;
  sendOtpMobileModel(template: TemplateRef<any>) {
    this.timerOn = false;
    this.userMobileNo = this.customerSignupForm.controls.vMobileNo.value;
    if (this.userMobileNo) {
      this.OTPmodalRef = this.modalService.show(template, this.OTPconfig);
      this.sendOtpToMobile();
      this.otpVerify = false;
    }
  }
  sendOtpEmailModel(template: TemplateRef<any>) {
    this.timerOn = false;
    this.userEmail = this.customerSignupForm.controls.vEmailId.value;
    if (this.userEmail) {
      this.OTPmodalRef = this.modalService.show(template, this.OTPconfig);
      this.sendOtpToEmail();
      this.emailOtpVerify = false;
    }
  }
  sendOtpToMobile() {
    this.btnLoader = true;
    this.available = false;
    this.userMobileNo = this.customerSignupForm.controls.vMobileNo.value;
    this.userEmail = '';
    this.customerSignupService
      .GetOTPMsgSMSVerifyMobile(this.userMobileNo)
      .subscribe(
        (status: string) => {
          if (status) {
            console.log('status', status);
            this.isOtp = true;
            this.otp = status;
            this.otpBtnDisable = true;
            this.resendOtpBtnDisabled = true;
            this.timerOn = true;
            this.timer(60);
            this.btnLoader = false;
          }
        },
        (error: HttpErrorResponse) => {
          this.notifier.showError(error.statusText);
        }
      );
  }
  userEmail;
  sendOtpToEmail() {
    this.btnLoader = true;
    this.available = false;
    this.userEmail = this.customerSignupForm.controls.vEmailId.value;
    this.userMobileNo = '';
    this.customerSignupService
      .GetOTPMsgMailVerifyEmail(this.userEmail)
      .subscribe(
        (status: string) => {
          if (status) {
            console.log('status', status);
            this.isOtp = true;
            this.otp = status;
            this.otpBtnDisable = true;
            this.resendOtpBtnDisabled = true;
            this.timerOn = true;
            this.timer(60);
            this.btnLoader = false;
          }
        },
        (error: HttpErrorResponse) => {
          this.notifier.showError(error.statusText);
        }
      );
  }
  timer(remaining: number) {
    let m = Math.floor(remaining / 60);
    let s = remaining % 60;
    m = m < 10 ? 0 + m : m;
    s = s < 10 ? 0 + s : s;
    this.countDownTimer = m * 60 + s + ' second(s)';
    //document.getElementById('timer').innerHTML = m + ':' + s;
    remaining -= 1;
    if (remaining >= 0 && this.timerOn) {
      setTimeout(() => {
        this.timer(remaining);
      }, 1000);
      return;
    }
    if (!this.timerOn) {
      // Do validate stuff here
      return;
    }
    this.countDownTimer = '';
    this.resendOtpBtnDisabled = false;
    // Do timeout stuff here
    //alert('Timeout for otp');
  }
  resendOtpToMobile() {
    this.sendOtpToMobile();
  }
  resendOtpToEmail() {
    this.sendOtpToEmail();
  }
}
