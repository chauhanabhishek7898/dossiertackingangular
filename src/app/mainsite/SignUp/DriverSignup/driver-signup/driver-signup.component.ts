import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/mainsite/Login/login.service';
import { CityMasterList } from 'src/app/mainsite/models/city-master';
import { CitymasterService } from 'src/app/services/citymaster.service';
import { debounceTime, map, startWith, switchMap, tap, finalize, distinctUntilChanged, filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { OtpSenderApiService } from 'src/app/services/otp-sender-api.service';
import { DriverSignupService } from '../driver-signup.service';
@Component({
  selector: 'app-driver-signup',
  templateUrl: './driver-signup.component.html',
  styleUrls: ['./driver-signup.component.scss'],
})
export class DriverSignupComponent implements OnInit {
  constructor(
    private router: Router,
    private sanitizer: DomSanitizer,
    private loginService: LoginService,
    private formBuilder: FormBuilder,
    private cityDropDownService: CitymasterService,
    private modalService: BsModalService,
    private otpSenderApiService: OtpSenderApiService,
    private driverSignupService:DriverSignupService,
  ) {}
  driverSignupForm: FormGroup;
  apiUrl = environment.dossiarApiUrl;
  @Input() mobileDisabled:boolean = false;
  @Input() emailDisabled:boolean = false;
  OTPModalTitle: string;
  OTPmodalRef: BsModalRef;

  ngOnInit(): void {


    
    // this.searchCityCtrl.valueChanges
    //   .pipe(
    //     filter((res) => {
    //       return res !== null && res.length >= this.minLengthTerm;
    //     }),
    //     distinctUntilChanged(),
    //     debounceTime(200),
    //     tap(() => {
    //       this.errorMsg = '';
    //       this.cityMasterList = [];
    //       this.isLoading = true;
    //     }),
    //     switchMap((value) =>
    //       this.http
    //         .get(
    //           `${this.apiUrl}/CityMaster/CityMaster_SelectAll_ActiveLikeSearch/${value}`
    //         )
    //         .pipe(
    //           finalize(() => {
    //             this.isLoading = false;
    //           })
    //         )
    //     )
    //   )
    //   .subscribe((data: any) => {
    //     if (data == undefined) {
    //       this.errorMsg = 'error';
    //       this.cityMasterList = [];
    //     } else {
    //       this.errorMsg = '';
    //       this.cityMasterList = data;
    //     }
    //     console.log(this.cityMasterList);
    //   });
    this.driverSignupForm = this.formBuilder.group(
      {
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

        vConfirmPassword: [null, [Validators.required]],
        dTermCondition: [false, [Validators.required]],
      },
      {
        validator: this.ConfirmedValidator('vPassword', 'vConfirmPassword'),
      }
    );
  }
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
  get createdriverSignupFormControls(): any {
    return this.driverSignupForm.controls;
  }
  selectedCity: any = { CityDetails: "" };
  selectedSpecilization: any = "";
  cityName1 = 'Gurgaon'
  cityId :any=null
  cityMasterList: CityMasterList[] = []
  isLoading = false
  onSelected() {
    this.selectedCity = this.selectedCity;
    this.cityId = this.selectedCity.nCityId;
    this.cityName1 = this.selectedCity.vCityName
  }
  displayWith(value: any) {
    return value?.CityDetails;
    
  }
  clearSelection(e) {
    if(e.target.value==''){
      this.selectedCity = "";
      this.cityMasterList = [];
      // console.log('citymasterlist', this.cityMasterList)
      this.cityId = null
    }
  
    
}
  opentermConditionComponent() {
    this.router.navigate(['/termsandcondition']);
  }
  // mobileNo: string;
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
  // upload adhar sample code //
  file: File;
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
          this.ifSelect1 = true;
        }
      } else {
        alert(`Invalid file format. Please select .JPG or .PDF file formats.`);
        // alert('Invalid file format. Please select .JPG or .PDF file formats.');
        this.fileFormetValid = false;
      }
      // event.target.value = null;
    }
  }
  // upload adhar sample code //

  // upload pan sample code //
  file2: File;
  files2;
  LogoFiles: any;
  fileSize2: number;
  LogoUrlLink: string;
  LogoFileName: string;
  LogoSelectedFileBLOB;
  LogoFileNameSlice;
  ifSelect2=false
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
          this.ifSelect2 = true;
        }
      } else {
        alert(`Invalid file format. Please select .JPG or .PDF file formats.`);
        this.fileFormetValid = false;
      }
    }
  }
  // upload pan sample code //

  // upload license sample code //
  ifSelect4=false
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
          this.ifSelect4=true
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
  urlLink5: string;
  fileName5: string;
  selectedFileBLOB5;
  fileNameSlice5;
  ifSelect5=false
  // fileFormetValid = false;
  // ifSelect=false
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
          alert(`Please Select File less than 2 MB`);
          // alert('Please Select File less than 2 MB');
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
            this.selectedFileBLOB5 = this.sanitizer.bypassSecurityTrustUrl(url5);
          };
          this.ifSelect5 = true;
        }
      } else {
        alert(`Invalid file format. Please select .JPG or .PDF file formats.`);
        // alert('Invalid file format. Please select .JPG or .PDF file formats.');
        this.fileFormetValid = false;
      }
      // event.target.value = null;
    }
  }
  // upload adhar sample code //

  // upload pan sample code //
  file6: File;
  files6;
  LogoFiles6: any;
  fileSize6: number;
  LogoUrlLink6: string;
  LogoFileName6: string;
  LogoSelectedFileBLOB6;
  LogoFileNameSlice6;
  ifSelect6=false
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
            var blob6 = new Blob(this.files6, { type: this.file6.type });
            var url6 = window.URL.createObjectURL(blob6);
            this.LogoSelectedFileBLOB6 =
              this.sanitizer.bypassSecurityTrustUrl(url6);
          };
          this.ifSelect6=true
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
  ifSelect7=false
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
          this.ifSelect7=true
        }
      } else {
        alert(`Invalid file format. Please select .JPG or .PDF file formats.`);
        this.fileFormetValid = false;
      }
    }
  }
  //  fourth, fifth, sixth file driver code end  //

  //  city dropdown start here  //
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
        // this.loaderService.isLoading.next(false);
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
    //this.otherCuntryName = this.AllCity.find(e => e.vCountryName != "India");
    this.selectedCity = city;
    this.driverSignupForm
      .get('nCityId')
      ?.setValue(this.selectedCity.CityDetails);
    this.selectList = false;
    this.AllCity = [];
    // this.searchInput.nativeElement.value = '';
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

  //  city dropdown end here  //

  //verify mobile no. and email id
  showMobileOtpBtn: boolean = false
  showEmailOtpBtn: boolean = false
  MobileIconVerified = false;
  emailIconVerified = false;
  mobileVerified = false;
  mobileNo
  emailId
  onMobileNo =false
  onEmail=false
  showSendOtp(event: any, type) {
    this.showMobileOtpBtn = false
    this.showEmailOtpBtn = false
    if (type == 'mobile') {
      if (event.target.value.length < 10) {
        this.showMobileOtpBtn = false;
        this.mobileVerified = false;
        this.onEmail=false;
        this.onMobileNo =true;
        this.isSubmitDisable = false;
      }
      if (!!event.target.value) {
        if (event.target.value.length > 9) {
          this.showMobileOtpBtn = true
          this.mobileNo=event.target.value;
          
        }
      }
    }
    if (type == 'email') {
      this.emailId=event.target.value;
      if (event.target.value.length <= 5) {
        this.showEmailOtpBtn = false;
        this.mobileVerified = false;
        this.onEmail=true;
        this.onMobileNo =false;
        
      }
      if (!!event.target.value) {
        if (event.target.value.length >= 5) {
          this.showEmailOtpBtn = true
        }
      }
    }
  }
  //send otp model
  OTPconfig: ModalOptions = {
    animated: true,
    backdrop: 'static',
    class: 'modal-dialog-centered modal-md',
  };
  openSendOtpForm(template: TemplateRef<any>) {
    this.OTPmodalRef = this.modalService.show(template, this.OTPconfig);
    this.OTPModalTitle = "Enter OTP"
  //   this.OTPmodalRef.onHide.subscribe(() => {
  //     // this.timerOn= false;
  //  });
    this.sendOtp();
    // this.sendOtpToEmail();
  }
  openSendOtpToEmail(template: TemplateRef<any>) {
    this.OTPmodalRef = this.modalService.show(template, this.OTPconfig);
    this.OTPModalTitle = "Enter OTP"
  //   this.OTPmodalRef.onHide.subscribe(() => {
  //     // this.timerOn= false;
  //  });
    // this.sendOtp();
    this.sendOtpToEmail();
  }
  emailOtp: string 
  mobNumber: string;
  resendOtpBtnDisabled: boolean = true;
  timerOn = true;
  sendOtp() {
    // this.loader = true;
    let mobieNumber = this.driverSignupForm.controls.vMobileNo.value;
    this.mobNumber = mobieNumber;
    this.otpSenderApiService.SendOtpToVerifyMobileNo(mobieNumber).subscribe((res) => {
      this.otp = res;
       this.resendOtpBtnDisabled = true;
      this.timerOn= true;
      this.otPtimer(60);
      // setTimeout(() => {
      //   this.loader = false
      // }, 300)
      }, (error: HttpErrorResponse) => {
        alert(error.statusText);
    });

  }
  eMailId: string;
  sendOtpToEmail() {
    // this.loader = true;
    let emailId = this.driverSignupForm.controls.vEmailId.value;
    this.eMailId = emailId;
    this.otpSenderApiService.GetOTPMsgMailVerifyEmail(emailId).subscribe((res) => {
      this.otp = res;
     
      this.resendOtpBtnDisabled = true;
      this.timerOn= true;
      this.otPtimer(60);
      // setTimeout(() => {
      //   this.loader = false
      // }, 300)
    
    }, (error: HttpErrorResponse) => {
      alert(error.statusText);
    });

  }
  resendOtpOnMobileNo() {
    // this.loader = true;
    this.sendOtp()
  }
  resendOtpOnEmail() {
    // this.loader = true;
    this.sendOtpToEmail();
  }
  countDownTimer: string;
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
  isSubmitDisable: boolean;
  otp: string
  onKeyUpEvent(event: any) {
    if (event.target.value.length == 4) {
      if (this.otp == event.target.value) {
        this.OTPmodalRef.hide();
        this.MobileIconVerified = true;
        this.showMobileOtpBtn=false;
        this.showEmailOtpBtn=false;
        // this.isSubmitDisable = true;
        this.mobileDisabled =true;
      }
      else {
        alert("OTP not matched");
        this.isSubmitDisable = false;
        this.mobileDisabled =false;
        this.MobileIconVerified = false;
      }
    }
  }
  onKeyUpEventForEmail(event: any) {
    if (event.target.value.length == 4) {
      if (this.otp == event.target.value) {
        this.OTPmodalRef.hide();
        this.showMobileOtpBtn=false;
        this.showEmailOtpBtn=false;
        // this.isSubmitDisable = true;
        this.emailDisabled =true;
        this.emailIconVerified=true;
      }
      else {
        alert("OTP not matched");
        this.isSubmitDisable = false;
        this.emailDisabled =false;
        this.emailIconVerified=false;
      }
    }
  }



  //  submit  start  //

  // PLDetailsModel: PLDetails
  // CustomerMasterList: CustomerMasterList[]=[]
  // onSubmitdriverSignupForm(){
  //   if(this.Unavailable== true){
  //     alert("Mobile No. already exists !!")
  //   }else{
  //     // this.loader = true;
  //     let docUploadId;
  //     let fp1;
  //     let fp2;
  //     let fp3;
  //     let fp4;
  
  //     let fz1;
  //     let fz2;
  //     let fz3;
  //     let fz4;
  
  //     let fn1;
  //     let fn2;
  //     let fn3;
  //     let fn4;

  //       docUploadId = 0;
  //       fp1 = "";
  //       fp2 = "";
  //       fp3 = "";
  //       fp4 = "";
  
  //       fz1 = 0;
  //       fz2 = 0;
  //       fz3 = 0;
  //       fz4 = 0;
  
  //       fn1 = "";
  //       fn2 = "";
  //       fn3 = "";
  //       fn4 = "";
  //     // }
  //     if (this.file1) {
  //       this.fileSize1 = (this.file1.size / 1024) as number
  //       fz1 = this.fileSize1;
  
  //     }
  //     if (this.file2) {
  //       this.fileSize2 = (this.file2.size / 1024) as number
  //       fz2 = this.fileSize2;
  
  //     }
  //     if (this.file3) {
  //       // this.fileSize3 = (this.file3.size / 1024) as number
  //       fz3 = this.fileSize3;
  
  //     }
  //     if (this.file4) {
  //       this.fileSize4 = (this.file4.size / 1024) as number
  //       fz4 = this.fileSize4;
  
  //     }
  //     this.CustomerMasterList=[];
  //     this.PLDetailsModel = {

  //       // nDriverId: Number;
  //       // nUserId: Number;
  //       // vDriverId: String;
  //       // nVId: Number;
  //       // vGender: String;
  //       // dtDOB: String;
  //       // nCityId: Number;
  //       // vPresentAddress: String;
  //       // vPermanentAddress: String;
  //       // vAlternateNo: String;
  //       // vLicenseNo: String;
  //       // vLicenseNoFilePath: String;
  //       // vAadhaarNo: String;
  //       // vAadhaarNoFilePath: String;
  //       // vPANNo: String;
  //       // vPANNoFilePath: String;
  //       // vVehicleRegistrationNo: String;
  //       // vVehicleRegistrationNoFilePath: String;
  //       // vVehicleInsuranceFilePath: String;
  //       // vPhotoFilePath: String;
  //       // vAnyOtherRemarks: String;
  //       // vFullName: String;
  //       // vMobileNo: String;
  //       // vPassword: String;
  //       // vEmailId: String;
  //       // btPromotion: String;
  //       // btOnDuty: boolean;
  //       // vDiriverCurrentLat: String;
  //       // vDiriverCurrentLong: String;


  //       nEId: this.driverSignupForm.controls.nEId.value == null ? 0:this.driverSignupForm.controls.nEId.value,
  //       // vEId: this.driverSignupForm.controls.vEId.value,
  //       // vEType: this.pharmacyAndLabDiagnostics,
  //       vEstablishmentName: this.driverSignupForm.controls.vEstablishmentName.value,
  //       vContactPersonOwner: this.driverSignupForm.controls.vContactPersonOwner.value,
  //       vCPDesignation: this.driverSignupForm.controls.vCPDesignation.value,
  //       vCPMobileNo: this.driverSignupForm.controls.vCPMobileNo.value,
  //       vAddress: this.driverSignupForm.controls.vAddress.value,
  //       vLocation: this.driverSignupForm.controls.vLocation.value,
  //       nCityId: this.selectedCity.nCityId,
  //       vPinCode: this.driverSignupForm.controls.vPinCode.value,
  //       vContactNo: this.driverSignupForm.controls.vContactNo.value,
  //       vWhatsUpNo: this.driverSignupForm.controls.vWhatsUpNo.value,
  //       vEmailId: this.driverSignupForm.controls.vEmailId.value,
  //       vWebsiteLink: this.driverSignupForm.controls.vWebsiteLink.value,
  //       vTaxDetails: this.driverSignupForm.controls.vTaxDetails.value, 
  //       vAuthorizedSignatory: this.driverSignupForm.controls.vAuthorizedSignatory.value,
  //       vAuthorizedSignatoryFilePath: fp1,
  //       vLogoFilePath: fp2,
  //       vShopPhotoFilePath: fp3,
  //       nShopPhotoFileSizeInKB:fz3,
  //       // btActive: this.driverSignupForm.controls.btActive.value,
  //       vLicenseNo: this.driverSignupForm.controls.vLicenseNo.value,
  //       vLicenseNoFilePath: fp4,
  //       vPassword: this.driverSignupForm.controls.vPassword.value,
  //       vUserName: this.driverSignupForm.controls.vUserName.value,
  //       btPromotion: this.driverSignupForm.controls.btPromotion.value,
  //     };
  //     // this.driverMasterList.push(this.driverModel)
  //     // this.driverModel = {
  //     //   CustomerMaster : this.CustomerMasterList
  //     // }
  //     // this.driverSignupService.PostPLDetails(this.PLDetailsSave, this.file1, this.file2 ,this.file3,this.fileSize3, this.file4)
  //     // .subscribe((status: any) => {
  //     //   if (status) {
  //     //     console.log("status",status)
  //     //     // this.loader=false;
  //     //     // this.apiStatus = `Your ${status[0].vEType} Establishment Registration - ${status[0].vEstablishmentName}, with Drome is Successfully done, with Reg. Code: ${status[0].vEId}. Also, you have successfully registered with Drome for ${status[0].RoleType} login, with Member Code: ${status[0].MemberCode}. Though, Approval awaited from APP Administrator.`;
  //     //     // this.notifier.showSuccess(this.apiStatus);
  //     //     // this.success = true;
  //     //     // this.redirectAfterClose= 'login';
  //     //     // this.parentChildCommunicationService.emitChange({ redirectAfterClose:this.redirectAfterClose });
  //     //     // this.resetSelectedData();
  //     //     this.driverSignupForm.reset();
  //     //     // setTimeout(() => {
  //     //     //   this.loader = false
  //     //     // }, 300)
  //     //   } 
  //     // }, (error: HttpErrorResponse) => {
  //     //   alert(error.statusText)
  //     // });
  //   }
    
  // };

  //  submit  end  //
}
