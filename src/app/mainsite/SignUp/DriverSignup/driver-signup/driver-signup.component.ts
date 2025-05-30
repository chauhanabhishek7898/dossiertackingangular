import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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
  Validators,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/mainsite/Login/login.service';
import { CityMasterList } from 'src/app/mainsite/models/city-master';
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
import { OtpSenderApiService } from 'src/app/services/otp-sender-api.service';
import { DriverSignupService } from '../driver-signup.service';
import {
  DriverMaster,
  DriverMasterClass,
} from 'src/app/mainsite/models/DriverMaster';
import { CustomerSignupService } from '../../customer-signup/customer-signup.service';
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
const moment = _rollupMoment || _moment;
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { VehicleTypeMaster } from 'src/app/mainsite/admin/admin-dashboard/vehicle-type-master/vehicle-type-master';
import { VehicleTypeMasterService } from 'src/app/mainsite/admin/admin-dashboard/vehicle-type-master/vehicle-type-master.service';
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
  selector: 'app-driver-signup',
  templateUrl: './driver-signup.component.html',
  styleUrls: ['./driver-signup.component.scss'],
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
export class DriverSignupComponent implements OnInit {
  constructor(
    private router: Router,
    private sanitizer: DomSanitizer,
    private loginService: LoginService,
    private formBuilder: UntypedFormBuilder,
    private cityDropDownService: CitymasterService,
    private modalService: BsModalService,
    private otpSenderApiService: OtpSenderApiService,
    private driverSignupService: DriverSignupService,
    private http: HttpClient,
    private customerSignupService: CustomerSignupService,
    private vehicleTypeMasterService: VehicleTypeMasterService,
    // private notifier: NotificationService
  ) {}
  driverSignupForm: UntypedFormGroup;
  apiUrl = environment.dossiarApiUrl;
  @Input() mobileDisabled: boolean = false;
  @Input() emailDisabled: boolean = false;
  OTPModalTitle: string;
  OTPmodalRef: BsModalRef;
  maxDate;
  mobileVerified = false;
  btnLoader = false;
  // selectedCity: any = { CityDetailsState: "Gurgaon - Haryana" };
  selectedCity: any = { CityStateDetails: '' };
  selectedSpecilization: any = '';
  cityName1 = 'Gurgaon';
  cityId: any = null;
  cityMasterList: CityMasterList[] = [];
  isLoading = false;
  searchCityCtrl = new UntypedFormControl();
  errorMsg!: string;
  minLengthTerm = 3;
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
    this.maxDate = new Date();
    this.driverSignupForm = this.formBuilder.group({
      nDriverId: 0,
      nUserId: [null],
      vDriverId: [null],
      nVId: [null, [Validators.required]],
      vGender: [null, [Validators.required]],
      dtDOB: [null, [Validators.required]],
      nCityId: [null],
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
      btPromotion: [false],
      vDiriverCurrentLat: [null],
      vDiriverCurrentLong: [null],
      vConfirmPassword: [null, [Validators.required]],
      dTermCondition: [null, [Validators.required]],
    },
      {
        validator: this.ConfirmedValidator('vPassword', 'vConfirmPassword'),
      }
    );
    this.VehicleTypeMaster_SelectAll()
  }
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
  get createdriverSignupFormControls(): any {
    return this.driverSignupForm.controls;
  }
  opentermConditionComponent() {
    this.router.navigate(['/termsandcondition']);
  }
  available: boolean = false;
  Unavailable: boolean = false;
  @ViewChild('searchInput') searchInput: ElementRef;
  isOtpLogin: boolean = false;
  passwordHide: boolean = false;
  submit = false
  onCheckboxChange(e) {
    if (e.target.checked) {
      this.submit = true
      this.isOtpLogin = true;
      this.passwordHide = true;
    } else {
      this.submit = false
      this.isOtpLogin = false;
      this.passwordHide = false;
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
  file1: File;
  files: any;
  fileSize: number;
  urlLink: string;
  fileName: string;
  selectedFileBLOB;
  fileNameSlice;
  fileFormetValid = false;
  ifSelect1 = false;
  selectFiles(event) {
    this.urlLink = '';
    this.file1 = null!!;
    this.fileNameSlice = '';
    if (event.target.files) {
      this.files = event.target.files;
      this.file1 = event.target.files[0];
      if (
        this.file1.name.split('.').pop() == 'pdf' ||
        this.file1.name.split('.').pop() == 'jpg'
      ) {
        if (this.file1.size > 2000000) {
          this.showWarningMessage('Please Select File less than 2 MB', 'alert', true);
          this.file1 = null!!;
        } else {
          this.fileName = this.file1.name;
          if (this.fileName.length > 6) {
            this.fileNameSlice = this.fileName.slice(0, 10);
          }
          this.urlLink = 'false';
          this.fileFormetValid = true;
          var reader = new FileReader();
          reader.readAsDataURL(this.file1);
          reader.onload = (event: any) => {
            var blob = new Blob(this.files, { type: this.file1.type });
            var url = window.URL.createObjectURL(blob);
            this.selectedFileBLOB = this.sanitizer.bypassSecurityTrustUrl(url);
          };
          this.ifSelect1 = true;
        }
      } else {
        this.showWarningMessage('Invalid file format Please select .JPG or .PDF file formats.', 'alert', true);
        this.fileFormetValid = false;
      }
      // event.target.value = null;
    }
  }
  file2: File;
  files2;
  LogoFiles: any;
  fileSize2: number;
  LogoUrlLink: string;
  LogoFileName: string;
  LogoSelectedFileBLOB;
  LogoFileNameSlice;
  ifSelect2 = false;
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
          this.showWarningMessage('Please Select File less than 2 MB', 'alert', true);
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
          this.ifSelect2 = true;
        }
      } else {
        this.showWarningMessage('Invalid file format Please select .JPG or .PDF file formats.', 'alert', true);
        this.fileFormetValid = false;
      }
    }
  }
  ifSelect4 = false;
  file4: File;
  files4: any;
  LicenseFiles: any;
  fileSize4: number;
  LicenseUrlLink: string;
  LicenseFileName: string;
  LicenseSelectedFileBLOB;
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
          this.showWarningMessage('Please Select File less than 2 MB', 'alert', true);
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
          this.ifSelect4 = true;
        }
      } else {
        this.showWarningMessage('Invalid file format Please select .JPG or .PDF file formats.', 'alert', true);
        this.fileFormetValid = false;
      }
    }
  }
  file5: File;
  files5: any;
  fileSize5: number;
  urlLink5: string;
  fileName5: string;
  selectedFileBLOB5;
  fileNameSlice5;
  ifSelect5 = false;
  selectFilesRegistration(event) {
    this.urlLink5 = '';
    this.files5 = null!!;
    this.fileNameSlice5 = '';
    if (event.target.files) {
      this.files5 = event.target.files;
      this.file5 = event.target.files[0];
      if (
        this.file5.name.split('.').pop() == 'pdf' ||
        this.file5.name.split('.').pop() == 'jpg'
      ) {
        if (this.file5.size > 2000000) {
          this.showWarningMessage('Please Select File less than 2 MB', 'alert', true);
          this.file5 = null!!;
        } else {
          this.fileName5 = this.file5.name;
          if (this.fileName5.length > 6) {
            this.fileNameSlice5 = this.fileName5.slice(0, 10);
          }
          this.urlLink5 = 'false';
          this.fileFormetValid = true;
          var reader = new FileReader();
          reader.readAsDataURL(this.file5);
          reader.onload = (event: any) => {
            var blob5 = new Blob(this.files5, { type: this.file5.type });
            var url5 = window.URL.createObjectURL(blob5);
            this.selectedFileBLOB5 =
              this.sanitizer.bypassSecurityTrustUrl(url5);
          };
          this.ifSelect5 = true;
        }
      } else {
        this.showWarningMessage('Invalid file format Please select .JPG or .PDF file formats.', 'alert', true);
        this.fileFormetValid = false;
      }
      // event.target.value = null;
    }
  }
  file6: File;
  files6;
  LogoFiles6: any;
  fileSize6: number;
  LogoUrlLink6: string;
  LogoFileName6: string;
  LogoSelectedFileBLOB6;
  LogoFileNameSlice6;
  ifSelect6 = false;
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
          this.showWarningMessage('Please Select File less than 2 MB', 'alert', true);
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
            var blob6 = new Blob(this.files6, { type: this.file6.type });
            var url6 = window.URL.createObjectURL(blob6);
            this.LogoSelectedFileBLOB6 =
              this.sanitizer.bypassSecurityTrustUrl(url6);
          };
          this.ifSelect6 = true;
        }
      } else {
        this.showWarningMessage('Invalid file format Please select .JPG or .PDF file formats.', 'alert', true);
        this.fileFormetValid = false;
      }
    }
  }
  file3: File;
  files3: any;
  LicenseFiles3: any;
  fileSize3: number;
  LicenseUrlLink3: string;
  LicenseFileName3: string;
  LicenseSelectedFileBLOB3;
  LicenseFileNameSlice3;
  ifSelect3 = false;
  selectFilesPhoto(event) {
    this.file3 = null!!;
    this.LicenseFileNameSlice3 = '';
    this.LicenseUrlLink3 = '';
    if (event.target.files) {
      this.files3 = event.target.files;
      this.file3 = event.target.files[0];
      console.log(this.file3);
      if (
        this.file3.name.split('.').pop() == 'pdf' ||
        this.file3.name.split('.').pop() == 'jpg'
      ) {
        if (this.file3.size > 2000000) {
          this.showWarningMessage('Please Select File less than 2 MB', 'alert', true);
          this.file3 = null!!;
        } else {
          this.LicenseFileName3 = this.file3.name;
          if (this.LicenseFileName3.length > 6) {
            this.LicenseFileNameSlice3 = this.LicenseFileName3.slice(0, 10);
          }
          var reader = new FileReader();
          this.LicenseUrlLink3 = 'false';
          this.fileFormetValid = true;
          reader.readAsDataURL(event.target.files[0]);
          reader.onload = (event: any) => {
            // this.urlLink = event.target.result
            var blob7 = new Blob(this.files3, { type: this.file3.type });
            var url7 = window.URL.createObjectURL(blob7);
            this.LicenseSelectedFileBLOB3 =
              this.sanitizer.bypassSecurityTrustUrl(url7);
          };
          this.ifSelect3 = true;
        }
      } else {
        this.showWarningMessage('Invalid file format Please select .JPG or .PDF file formats.', 'alert', true);
        this.fileFormetValid = false;
      }
    }
  }
  vehicleTypeMaster: VehicleTypeMaster[] = []
  VehicleTypeMaster_SelectAll() {
    this.AllCity = [];
    this.vehicleTypeMasterService.VehicleTypeMaster_SelectAll().subscribe(
      (res) => {
        this.vehicleTypeMaster = res
      },
      (error: HttpErrorResponse) => {
        alert(error.statusText);
      }
    );
  }
  AllCity: CityMasterList[] = [];
  noMatchFound: boolean = false;
  // selectedCity: CityMasterList = new CityMasterList();
  selectList: boolean = false;
  bindCityDetailsOnDropDown(cityName: string) {
    this.AllCity = [];
    this.cityDropDownService.getCityDetailsByCityName(cityName).subscribe(
      (res) => {
        this.AllCity = res;
        if (this.AllCity.length == 0) {
          this.noMatchFound = true;
        }
      },
      (error: HttpErrorResponse) => {
        alert(error.statusText);
      }
    );
  }
  onCityKey(event: any) {
    if (event.target.value.length == 0) {
      this.AllCity = [];
      this.noMatchFound = false;
    }
    if (!!event.target.value) {
      if (event.target.value.length > 2) {
        this.bindCityDetailsOnDropDown(event.target.value);
      }
    }
  }
  isCountryIndia = false;
  selectCity(city, e) {
    let country = this.AllCity.find((e) => e.vCountryName != 'India');
    if (country) {
      this.isCountryIndia = true;
      this.driverSignupForm.get('vEmailId')?.setValue(null);
    } else {
      this.isCountryIndia = false;
      this.driverSignupForm.get('vMobileNo')?.setValue(null);
    }
    this.selectedCity = city;
    this.driverSignupForm
      .get('nCityId')
      ?.setValue(this.selectedCity.CityDetails);
    this.selectList = false;
    this.AllCity = [];
  }
  selectCityList($event) {
    $event.stopPropagation();
    this.selectList = true;
  }
  showSelectList($event) {
    $event.stopPropagation();
    this.selectList = true;
  }
  showSelectLists($event) {
    $event.stopPropagation();
    this.selectList = true;
  }
  closeSearch() {
    this.selectList = false;
    this.AllCity = [];
    this.noMatchFound = false;
  }
  onFocusOut(event: any) {
    window.setTimeout(() => {
      this.closeSearch();
    }, 500);
  }
  showMobileOtpBtn: boolean = false;
  showEmailOtpBtn: boolean = false;
  MobileIconVerified = false;
  emailIconVerified = false;
  mobileNo;
  emailId;
  onMobileNo = false;
  onEmail = false;
  userMobileNo;
  userEmail;
  OTPconfig: ModalOptions = {
    animated: true,
    backdrop: 'static',
    class: 'modal-dialog-centered modal-md',
  };
  sendOtpMobileModel(template: TemplateRef<any>) {
    this.timerOn = false;
    this.userMobileNo = this.driverSignupForm.controls.vMobileNo.value;
    if (this.userMobileNo) {
      this.OTPmodalRef = this.modalService.show(template, this.OTPconfig);
      this.sendOtpToMobile();
      this.otpVerify = false;
    }
  }
  sendOtpEmailModel(template: TemplateRef<any>) {
    this.timerOn = false;
    this.userEmail = this.driverSignupForm.controls.vEmailId.value;
    if (this.userEmail) {
      this.OTPmodalRef = this.modalService.show(template, this.OTPconfig);
      this.sendOtpToEmail();
      this.emailOtpVerify = false;
    }
  }
  isOtp: boolean = false;
  otpBtnDisable: boolean = false;
  countDownTimer: any;
  MobileNo;
  timerOn = true;
  otp: string;
  resendOtpBtnDisabled: boolean = true;
  mobileDisable = false;
  emailDisable = false;
  sendOtpToMobile() {
    this.btnLoader = true;
    this.available = false;
    this.userMobileNo = this.driverSignupForm.controls.vMobileNo.value;
    this.userEmail = '';
    this.customerSignupService
      .GetOTPMsgSMSVerifyMobile(this.userMobileNo)
      .subscribe(
        (status: string) => {
          if (status) {
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
  sendOtpToEmail() {
    this.btnLoader = true;
    this.available = false;
    this.userEmail = this.driverSignupForm.controls.vEmailId.value;
    this.userMobileNo = '';
    this.customerSignupService
      .GetOTPMsgMailVerifyEmail(this.userEmail)
      .subscribe(
        (status: string) => {
          if (status) {
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
  mobileVerifiedForSubmit = false;
  verifiedMobileText = false
  onKeyUpEventForMobile(event: any) {
    if (event.target.value.length == 4) {
      if (this.otp == event.target.value) {
        this.OTPmodalRef.hide();
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
        this.verifiedEmailText = true;
        this.showMobileOtpBtn = false;
        this.showEmailOtpBtn = false;
        this.emailDisabled = true;
        this.emailIconVerified = true;
      } else {
        this.showWarningMessage('OTP not matched', 'alert', true);
        this.emailDisabled = false;
        this.emailIconVerified = false;
      }
    }
  }
  otpVerify;
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
  emailOtpVerify;
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
  errorMobileTxt = false;
  errorEmailTxt = false;
  errorCityTxt = false;
  DriverDetailsModel: DriverMaster;
  DriverDetailsList: DriverMaster[] = [];
  DriverMasterClass: DriverMasterClass;
  signUp() {
    console.log(this.mobileDisable);
    console.log(this.emailDisable);
    if (
      !this.cityId ||
      this.mobileDisable == false
    ) {
      if (!this.cityId) {
        this.errorCityTxt = true;
      }
      if (this.mobileDisable == false) {
        this.Unavailable = false;
        this.available = false;
        this.errorMobileTxt = true;
      }
    } else {
      this.btnLoader = true;
      if (this.btnLoader = true) {
        this.submit = false
      }
      let docUploadId;
      let fp1;
      let fp2;
      let fp3;
      let fp4;
      let fp5;
      let fp6;

      let fz1;
      let fz2;
      let fz3;
      let fz4;
      let fz5;
      let fz6;

      let fn1;
      let fn2;
      let fn3;
      let fn4;
      let fn5;
      let fn6;

      docUploadId = 0;
      fp1 = '';
      fp2 = '';
      fp3 = '';
      fp4 = '';
      fp5 = '';
      fp6 = '';

      fz1 = 0;
      fz2 = 0;
      fz4 = 0;
      fz5 = 0;
      fz6 = 0;
      fz3 = 0;

      fn1 = '';
      fn2 = '';
      fn3 = '';
      fn4 = '';
      fn5 = '';
      fn6 = '';
      // }
      if (this.file1) {
        this.fileSize = (this.file1.size / 1024) as number;
        fz1 = this.fileSize;
      }
      if (this.file2) {
        this.fileSize2 = (this.file2.size / 1024) as number;
        fz2 = this.fileSize2;
      }
      if (this.file3) {
        // this.fileSize3 = (this.file3.size / 1024) as number
        fz3 = this.fileSize3;
      }
      if (this.file4) {
        this.fileSize4 = (this.file4.size / 1024) as number;
        fz4 = this.fileSize4;
      }
      if (this.file5) {
        // this.fileSize3 = (this.file3.size / 1024) as number
        fz5 = this.fileSize5;
      }
      if (this.file6) {
        this.fileSize6 = (this.file6.size / 1024) as number;
        fz6 = this.fileSize6;
      }
      let dob;
      if (this.driverSignupForm.controls.dtDOB.value != null) {
        if (typeof this.driverSignupForm.controls.dtDOB.value == 'object') {
          let dobDate = this.driverSignupForm.controls.dtDOB.value._d;
          let month = dobDate.getMonth() + 1;
          dob = dobDate.getFullYear() + '-' + month + '-' + dobDate.getDate();
        } else {
          dob = this.driverSignupForm.controls.dtDOB.value;
        }
      }
      this.DriverDetailsList = [];
      this.DriverDetailsModel = {
        nDriverId:
          this.driverSignupForm.controls.nDriverId.value == null
            ? 0
            : this.driverSignupForm.controls.nDriverId.value,
        nVId: parseInt(this.driverSignupForm.controls.nVId.value),
        vGender: this.driverSignupForm.controls.vGender.value,
        dtDOB: dob,
        nCityId: this.cityId,
        vPresentAddress: this.driverSignupForm.controls.vPresentAddress.value,
        vPermanentAddress:
          this.driverSignupForm.controls.vPermanentAddress.value,
        vAlternateNo: this.driverSignupForm.controls.vAlternateNo.value,
        vLicenseNo: this.driverSignupForm.controls.vLicenseNo.value,
        vLicenseNoFilePath: fp3,
        vAadhaarNo: this.driverSignupForm.controls.vAadhaarNo.value,
        vAadhaarNoFilePath: fp1,
        vPANNo: this.driverSignupForm.controls.vPANNo.value,
        vPANNoFilePath: fp2,
        vVehicleRegistrationNo:
          this.driverSignupForm.controls.vVehicleRegistrationNo.value,
        vVehicleRegistrationNoFilePath: fp4,
        vVehicleInsuranceFilePath: fp5,
        vPhotoFilePath: fp6,
        vFullName: this.driverSignupForm.controls.vFullName.value,
        vMobileNo: this.driverSignupForm.controls.vMobileNo.value,
        vPassword: this.driverSignupForm.controls.vPassword.value,
        vEmailId: this.driverSignupForm.controls.vEmailId.value,
        btPromotion: this.driverSignupForm.controls.btPromotion.value,
      };
      this.DriverDetailsList.push(this.DriverDetailsModel);
      this.DriverMasterClass = {
        DriverMaster: this.DriverDetailsList,
      };
      console.log('this.DriverDetailsList', this.DriverDetailsList);
      this.driverSignupService
        .DriverMaster(
          this.DriverMasterClass,
          this.file1,
          this.file2,
          this.file3,
          this.file4,
          this.file5,
          this.file6
        )
        .subscribe(
          (status: any) => {
            if (status) {
              console.log('status', status);
              this.showSuccessMessage(`Congratulations, User has been created successfully. You may further use it to login in the APP.
              Though, it has to be approved by the APP Administrator before logging in. Thanks, for your kind patience.`, 'success', true);
              this.driverSignupForm.reset();
              this.verifiedMobileText = false;
              this.verifiedEmailText = false;
              this.mobileDisable = false;
              this.emailDisable=false;
              this.resetImageData();
              setTimeout(() => {
                this.btnLoader = false;
              }, 300);
            }
          },
          (error: HttpErrorResponse) => {
            alert(error.statusText);
          }
        );
    }
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
  resetImageData() {
    this.urlLink = '';
    this.file1 = null!!;
    this.fileNameSlice = '';
    this.file2 = null!!;
    this.LogoFileNameSlice = '';
    this.LogoUrlLink = '';
    this.file4 = null!!;
    this.LicenseFileNameSlice = '';
    this.LicenseUrlLink = '';
    this.urlLink5 = '';
    this.files5 = null!!;
    this.fileNameSlice5 = '';
    this.file6 = null!!;
    this.LogoFileNameSlice6 = '';
    this.LogoUrlLink6 = '';
    this.file3 = null!!;
    this.LicenseFileNameSlice3 = '';
    this.LicenseUrlLink3 = '';
  }
}