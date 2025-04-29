import { CustomerDetailsMasterService } from './../customer-details-admin/customer-details-master.service';
import {
  AdminSignupMaster,
  RootUserSave,
} from './../../../models/admin-signup-master';
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
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { OtpSender } from 'src/app/core/services/otp.sender.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { UserSettingService } from 'src/app/core/services/user.setting.service';
import { UserValidationService } from 'src/app/core/services/user.validation.service';
import { UserMaster } from 'src/app/mainsite/models/user';
import Swal from 'sweetalert2';
import { AdminSignupMasterService } from './admin-signup-master.service';
import { CustomerSignupService } from 'src/app/mainsite/SignUp/customer-signup/customer-signup.service';
import { LoginService } from 'src/app/mainsite/Login/login.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CityMasterList } from 'src/app/mainsite/models/city-master';
import { environment } from 'src/environments/environment';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  switchMap,
  tap,
} from 'rxjs/operators';
import {
  CustomerMaster,
  CustomerMasterClass,
} from 'src/app/mainsite/models/CustomerMaster';

@Component({
  selector: 'app-admin-signup-master',
  templateUrl: './admin-signup-master.component.html',
  styleUrls: ['./admin-signup-master.component.scss'],
})
export class AdminSignupMasterComponent implements OnInit {
  formattedaddress = ' ';
  @Input()
  options: any = {
    componentRestrictions: { country: ['in'] },
    fields: ['address_components', 'geometry', 'formatted_address'],
    //types: ["address"],
  };
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
  loader = false;
  pageTitle: any;

  constructor(
    private loginService: LoginService,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private sanitizer: DomSanitizer,
    private customerSignupService: CustomerSignupService,
    private adminSignupMasterService: AdminSignupMasterService,
    private route: ActivatedRoute,
    private http: HttpClient,
    // private notifier: NotificationService,
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
  addressLat;
  addressLong;
  cityName;
  cityservice = false;
  cityServiceResult;
  AddressChange(address: any) {
    //setting address from API to local variable
    console.log(address);
    this.formattedaddress = address.formatted_address;
    console.log('this.formattedaddress', this.formattedaddress);
    this.addressLat = address.geometry.location.lat();
    this.addressLong = address.geometry.location.lng();
    address.address_components.forEach((element) => {
      console.log(element);
      let componentType = element.types[0];
      if (componentType == 'locality') {
        // alert(element.long_name);
        this.customerSignupForm.get('nCityId')?.setValue(element.long_name);
        this.cityName = element.long_name;
        this.cityNameCheck(element.long_name);
        return;
      }
    });
  }
  cityNameCheck(cityName) {
    this.customerSignupService
      .GetCityIdAgainstCityName(cityName)
      .subscribe((res) => {
        console.log('res', res);
        if (typeof res == 'string') {
          this.cityservice = true;
          this.cityServiceResult = res;
        } else {
          this.cityservice = false;
          this.cityServiceResult = '';
          this.cityId = res[0].nCityId;
        }
      });
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
    this.pageTitle = this.route.snapshot.queryParams.title;
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
        vFullName: [null, [Validators.required]],
        vMobileNo: [null, [Validators.required]],
        // vEmailId: [null,],
        vPassword: [null, [Validators.required]],
        vConfirmPassword: [null, [Validators.required]],
      },
      {
        validator: this.ConfirmedValidator('vPassword', 'vConfirmPassword'),
      }
    );
  }

  //  signup customer  //
  errorMobileTxt = false;
  errorEmailTxt = false;
  errorCityTxt = false;
  addressError = false;
  addSignupMasterModel: AdminSignupMaster;
  listCustomer: AdminSignupMaster[] = [];
  CustomerMasterClass: RootUserSave;

  submitCustomerSignup() {
    if (this.verifiedMobileText == true) {
      this.loader = true;
      this.addSignupMasterModel = {
        vFullName: this.customerSignupForm.controls.vFullName.value,
        vMobileNo: this.customerSignupForm.controls.vMobileNo.value,
        vPassword: this.customerSignupForm.controls.vPassword.value,
      };

      this.listCustomer.push(this.addSignupMasterModel);
      this.CustomerMasterClass = {
        UserMaster: this.listCustomer,
      };

      console.log('this.CustomerMasterClass', this.CustomerMasterClass);
      this.adminSignupMasterService
        .PostCreateAdmin(this.addSignupMasterModel)
        .subscribe(
          (status: any) => {
            // this.apiStatus = `Congratulations, User has been created successfully with member Code:  ${status[0].MemberCode}. You may further use it to login in the APP.
            // Though, it has to be approved by the APP Administrator before logging in. Thanks, for your kind patience.`;

            if (status) {
              this.showSuccessMessage(
                'Login Created Successfully.',
                'success',
                true
              );
              this.customerSignupForm.reset();
            }
            setTimeout(() => {
              this.loader = false;
            }, 300);
          },
          (error: HttpErrorResponse) => {
            this.showWarningMessage(error.statusText, 'error', true);
          }
        );
    } else {
      this.showWarningMessage(
        'Please Verify your Mobile number before Signup.',
        'error',
        true
      );
    }
  }

  //  signup customer  //

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
    if (event.target.value.length < 10) {
      this.otpVerify = false;
    }
    if (!!event.target.value) {
      if (event.target.value.length > 9) {
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
  verifiedMobileText = false;

  onKeyUpEventForMobile(event: any) {
    if (event.target.value.length == 4) {
      if (this.otp == event.target.value) {
        this.OTPmodalRef.hide();
        this.errorMobileTxt = false;
        this.mobileDisable = true;
        this.otpVerify = false;
        this.verifiedMobileText = true;
        // this.mobileVerified = true;
      } else {
        // this.notifier.showError('OTP not matched');
        this.mobileDisable = false;
        // this.mobileVerified = false;
      }
    }
  }

  verifiedEmailText = false;
  onKeyUpEventForEmail(event: any) {
    if (event.target.value.length == 4) {
      if (this.otp == event.target.value) {
        this.OTPmodalRef.hide();
        this.errorEmailTxt = false;
        this.emailDisable = true;
        this.emailOtpVerify = false;
        this.verifiedEmailText = true;
        // this.emailVerified = true;
      } else {
        alert('OTP not matched');
        this.emailDisable = false;
        // this.emailVerified = false;
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
    this.loader = true;
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
            this.loader = false;
          }
        },
        (error: HttpErrorResponse) => {
          // this.notifier.showError(error.statusText);
        }
      );
  }
  userEmail;
  sendOtpToEmail() {
    this.loader = true;
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
            this.loader = false;
          }
        },
        (error: HttpErrorResponse) => {
          // this.notifier.showError(error.statusText);
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
