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
  UntypedFormControl,
  UntypedFormGroup,
  SelectControlValueAccessor,
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
import { CustomerSignupService } from './customer-signup.service';
import {
  CustomerMaster,
  CustomerMasterClass,
} from '../../models/CustomerMaster';
import { parseDateToString } from '../../shared-function/sharedFunction';
const moment = _rollupMoment || _moment;
import Swal from 'sweetalert2/dist/sweetalert2.js';
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
  formattedaddress = " ";
  @Input()
  options: any =
    {
      componentRestrictions: { country: ["in"] },
      fields: ["address_components", "geometry", "formatted_address"],
      //types: ["address"],
    }
  maxDate = new Date();
  customerSignupForm: UntypedFormGroup;
  errorMsg!: string;
  minLengthTerm = 3;
  apiUrl = environment.dossiarApiUrl;
  mobileVerified = false;
  emailVerified = false;
  searchCityCtrl = new UntypedFormControl(Validators.required);
  btnLoader = false;
  available: boolean = false;
  Unavailable: boolean = false;
  @Input()
  maxlength: string | number | null;
  constructor(
    private loginService: LoginService,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private sanitizer: DomSanitizer,
    private customerSignupService: CustomerSignupService,
    private http: HttpClient,
    private modalService: BsModalService
  ) { }
  selectedCity: any = { CityStateDetails: '' };
  selectedSpecilization: any = '';
  cityName1 = 'Gurgaon';
  cityId: any = null;
  cityMasterList: CityMasterList[] = [];
  isLoading = false;
  addressLat
  addressLong
  cityName
  cityservice = false
  cityServiceResult
  AddressChange(address: any) {
    //setting address from API to local variable
    console.log(address)
    this.formattedaddress = address.formatted_address
    console.log('this.formattedaddress', this.formattedaddress)
    this.addressLat = address.geometry.location.lat()
    this.addressLong = address.geometry.location.lng()
    address.address_components.forEach(element => {
      console.log(element)
      let componentType = element.types[0];
      if (componentType == "locality") {
        this.customerSignupForm.get('nCityId')?.setValue(element.long_name)
        this.cityName = element.long_name
        this.cityNameCheck(element.long_name)
        return;
      }
    });
  }
  cityNameCheck(cityName) {
    this.customerSignupService.GetCityIdAgainstCityName(cityName).subscribe((res) => {
      console.log('res', res)
      if (typeof res == "string") {
        this.cityservice = true
        this.cityServiceResult = res
      } else {
        this.cityservice = false
        this.cityServiceResult = ''
        this.cityId = res[0].nCityId      }
    })
  }
  onSelected() {
    this.selectedCity = this.selectedCity;
    this.cityId = this.selectedCity.nCityId;
    this.cityName1 = this.selectedCity.vCityName;
    this.errorCityTxt = false;
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
        vEmailId: [null,],
        vPassword: [null, [Validators.required]],
        vConfirmPassword: [null, [Validators.required]],
        dtDOB: [null, [Validators.required]],
        btPromotion: [false],
        nCityId: [null],
        vAddress: [null, [Validators.required]],
        vGender: [null, [Validators.required]],
        vAadhaarNo: [null],
        vAadhaarNoFilePath: [null], // one file (adhar file)  //
        vFlatNoPlotNoLaneBuilding: [null, [Validators.required]],
        dTermCondition: [null, [Validators.required]],
      },
      {
        validator: this.ConfirmedValidator('vPassword', 'vConfirmPassword'),
      }
    );
    this.customerSignupForm.get('nCityId')?.disable();
  }
  addCustomerUserModel: CustomerMaster;
  listCustomer: CustomerMaster[] = [];
  CustomerMasterClass: CustomerMasterClass;
  errorMobileTxt = false;
  errorEmailTxt = false;
  errorCityTxt = false;
  addressError = false
  submitCustomerSignup() {
    let dob;
    if (this.customerSignupForm.controls.dtDOB.value != null) {
      if (typeof this.customerSignupForm.controls.dtDOB.value == 'object') {
        let dobDate = this.customerSignupForm.controls.dtDOB.value._d;
        let month = dobDate.getMonth() + 1;
        dob = dobDate.getFullYear() + '-' + month + '-' + dobDate.getDate();
      } else {
        dob = this.customerSignupForm.controls.dtDOB.value;
      }
    }
    let emailId = this.customerSignupForm.controls.vEmailId.value
    if (this.mobileDisable == false) {
      if (this.mobileDisable == false) {
        this.Unavailable = false;
        this.available = false;
        this.errorMobileTxt = true;
      }
      if (this.emailDisable == false && emailId) {
        this.errorEmailTxt = true;
      }
    } else {
      if (this.addressLat || this.addressLong) {
        this.btnLoader = true;
        if (this.btnLoader = true) {
          this.termConditionTxt = false;
        }
        this.listCustomer = [];
        this.addCustomerUserModel = {
          nCId: 0,
          vGender: this.customerSignupForm.controls.vGender.value,
          dtDOB: dob,
          vAadhaarNo: this.customerSignupForm.controls.vAadhaarNo.value,
          vAadhaarNoFilePath: '',
          vFullName: this.customerSignupForm.controls.vFullName.value,
          vMobileNo: this.customerSignupForm.controls.vMobileNo.value,
          vPassword: this.customerSignupForm.controls.vPassword.value,
          vEmailId: this.customerSignupForm.controls.vEmailId.value,
          btPromotion: false,
          nCityId: this.cityId,
          vAddress: this.formattedaddress,
          vFlatNoPlotNoLaneBuilding: this.customerSignupForm.controls.vFlatNoPlotNoLaneBuilding.value,
          vLat: this.addressLat,
          vLong: this.addressLong,
          vCityName: this.cityName
        };
        this.listCustomer.push(this.addCustomerUserModel);
        this.CustomerMasterClass = {
          CustomerMaster: this.listCustomer,
        };
        this.customerSignupService.PostCreateUserCustomer(this.CustomerMasterClass).subscribe((status: any) => {
          if (status) {
            this.showSuccessMessage('Login Created Successfully. Please use mobile APP to access the application', 'success', true);
            this.customerSignupForm.reset();
            this.verifiedMobileText = false;
            this.verifiedEmailText = false;
            this.mobileDisable = false;
            this.emailDisable=false;
          }
          setTimeout(() => {
            this.btnLoader = false;
          }, 300);
        },
          (error: HttpErrorResponse) => {
            this.showWarningMessage(error.statusText, 'error', true);
            this.btnLoader = false;
          }
        );
      } else {
        this.addressError = true
      }
    }
  }
  mobileNo: string;
  otpVerify = false;
  emailOtpVerify = false;
  @ViewChild('searchInput') searchInput: ElementRef;
  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: UntypedFormGroup) => {
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
          .checkExistsMobileNo(this.mobileNo)
          .subscribe((res) => {
            console.log('res', res);
            if (typeof res != 'string') {
              this.otpVerify = true;
              this.errorMobileTxt = false;
              this.available = true;
            } else {
              this.errorMobileTxt = false;
              this.Unavailable = true;
            }
          });
      } else {
        this.otpVerify = false;
        this.errorMobileTxt = false;
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
  termConditionTxt = false;
  onCheckboxChange(e) {
    if (e.target.checked) {
      this.termConditionTxt = true;
    } else {
      this.termConditionTxt = false;
    }
  }
  opentermConditionComponent() {
    this.router.navigate(['/termsandcondition']);
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
  verifiedMobileText = false
  onKeyUpEventForMobile(event: any) {
    if (event.target.value.length == 4) {
      if (this.otp == event.target.value) {
        this.OTPmodalRef.hide();
        this.errorMobileTxt = false;
        this.mobileDisable = true;
        this.otpVerify = false;
        this.verifiedMobileText = true;
      } else {
        this.showWarningMessage('OTP not matched', 'alert', true);
        this.mobileDisable = false;
      }
    }
  }
  verifiedEmailText = false
  onKeyUpEventForEmail(event: any) {
    if (event.target.value.length == 4) {
      if (this.otp == event.target.value) {
        this.OTPmodalRef.hide();
        this.errorEmailTxt = false;
        this.emailDisable = true;
        this.emailOtpVerify = false;
        this.verifiedEmailText = true;
      } else {
        this.showWarningMessage('OTP not matched', 'alert', true);
        this.emailDisable = false;
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
        }
      );
  }
  timer(remaining: number) {
    let m = Math.floor(remaining / 60);
    let s = remaining % 60;
    m = m < 10 ? 0 + m : m;
    s = s < 10 ? 0 + s : s;
    this.countDownTimer = m * 60 + s + ' second(s)';
    remaining -= 1;
    if (remaining >= 0 && this.timerOn) {
      setTimeout(() => {
        this.timer(remaining);
      }, 1000);
      return;
    }
    if (!this.timerOn) {
      return;
    }
    this.countDownTimer = '';
    this.resendOtpBtnDisabled = false;
  }
  resendOtpToMobile() {
    this.sendOtpToMobile();
  }
  resendOtpToEmail() {
    this.sendOtpToEmail();
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