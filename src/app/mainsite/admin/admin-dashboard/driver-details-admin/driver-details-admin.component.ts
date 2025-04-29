import { UtilityService } from 'src/app/core/services/utility.service';
import { DriverMaster, DriverMasterClass } from './../../../models/DriverMaster';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { DataTableDirective } from 'angular-datatables';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
// import { NotificationService } from 'src/app/core/service/notification.service';
import { environment } from 'src/environments/environment';
import { DriverDetailsAdminService } from './driver-details-admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApproveDriverMasterList, DriverDetails } from 'src/app/mainsite/models/approve-driver';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { CitymasterService } from 'src/app/services/citymaster.service';
import { LoginService } from 'src/app/mainsite/Login/login.service';
import { OtpSenderApiService } from 'src/app/services/otp-sender-api.service';
import { CustomerSignupService } from 'src/app/mainsite/SignUp/customer-signup/customer-signup.service';
import { DriverSignupService } from 'src/app/mainsite/SignUp/DriverSignup/driver-signup.service';
import { VehicleTypeMasterService } from '../vehicle-type-master/vehicle-type-master.service';
import { CityMasterList } from 'src/app/mainsite/models/city-master';
import { debounceTime, distinctUntilChanged, filter, finalize, switchMap, tap } from 'rxjs/operators';
import { VehicleTypeMaster } from '../vehicle-type-master/vehicle-type-master';
import { parseDateToString } from 'src/app/mainsite/shared-function/sharedFunction';
import * as signalR from '@microsoft/signalr';
@Component({
  selector: 'app-driver-details-admin',
  templateUrl: './driver-details-admin.component.html',
  styleUrls: ['./driver-details-admin.component.scss'],
})
export class DriverDetailsAdminComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  ModalTitle: string;
  conutryModel: DriverMaster;
  // driverSignupForm: FormGroup;
  formType: string;
  imageUrl: string;
  isDtInitialized: boolean = false;
  approveDriverMasterModel: DriverDetails
  userDetailList: ApproveDriverMasterList[] = [];
  dtTrigger: Subject<any> = new Subject<any>();
  modalRef: BsModalRef;
  conformaitonmodalRef: BsModalRef;
  IsWait: boolean;
  loader = false;
  @Input() disabled: boolean = true;
  myNoteForm: UntypedFormGroup;
  connection: any
  pageTitle: any;

  constructor(
    private doctorDetailService: DriverDetailsAdminService,
    // private notifier: NotificationService,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private utilityService: UtilityService,
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,

    private router: Router,
    private loginService: LoginService,
    private cityDropDownService: CitymasterService,
    private otpSenderApiService: OtpSenderApiService,
    private driverSignupService: DriverDetailsAdminService,
    private http: HttpClient,
    private customerSignupService: CustomerSignupService,
    private vehicleTypeMasterService: VehicleTypeMasterService,
  ) { }


  driverSignupForm: UntypedFormGroup;
  apiUrl = environment.dossiarApiUrl;
  @Input() mobileDisabled: boolean = false;
  @Input() emailDisabled: boolean = false;
  OTPModalTitle: string;
  OTPmodalRef: BsModalRef;
  maxDate;

  mobileVerified = false;

  btnLoader = false;
  center: google.maps.LatLngLiteral = {
    lat: 28.5179644,
    lng: 77.2316918
  };
  latitude=28.5179644
  longitude=77.2316918
  markerPositions: google.maps.LatLngLiteral[] = [];
  markerPos={lat:26.760759,lng:83.373703}
  trackLocation=false;
  trackingDriverId:number;
//zoom = 4;
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
    }else{
      this.getCityDetsils()
    }
  }


  ngOnInit(): void {
        //ading signalR
      this.connection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl(environment.dossiarImageUrl + '/TrackingHub')
      .build();

    this.connection.start().then(function () {
      console.log('SignalR Connected!');
    }).catch(function (err) {
      return console.error(err.toString());
    });
     // start
     this.connection.on("CurrentLocationHub", (ndriverId, subscriberList, currentLocation) => {
      console.log('CurrentLocationHub')
      if(this.trackLocation){
        if(this.trackingDriverId==ndriverId){
      console.log('subscriberList', subscriberList);
      let driverLocation = JSON.parse(currentLocation)
      console.log('driverLocation', driverLocation);
      let dlat = parseFloat(driverLocation.lat);
      let dlong = parseFloat(driverLocation.lng);
      this.markerPos={lat:dlat,lng:dlong}
          this.center.lat=dlat
          this.center.lng=dlong
        }
      }
     });
     //end
    this.pageTitle = this.route.snapshot.queryParams.title;
    this.imageUrl = environment.dossiarApiUrl;
    this.dtOptions = {
      //destroy: true,
      dom: 'lBfrtip',
      lengthMenu: [5, 10, 25, 50, 100],
      pageLength: 10,
      scrollX: true,
      // Configure the buttons
      buttons: [
        {
          extend: 'excel',
          text: 'Export To Excel',
          filename: 'Doctor Detail MIS',
        },
      ],
      columnDefs: [
        {
          orderable: false,
          targets: 'no-sort',
        },
      ],
    };
    this.myNoteForm = this.formBuilder.group({
      txtSearch: [null],
      nDriverId: [null],
    });
    this.bindDoctorDetailService(false);



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

    this.driverSignupForm = this.formBuilder.group(
      {
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
        vPassword: [null],
        vEmailId: [null, [Validators.required]],
        btPromotion: [false],
        vDiriverCurrentLat: [null],
        vDiriverCurrentLong: [null],
        vConfirmPassword: [null]

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
    getCityDetsils(){
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
    }
  opentermConditionComponent() {
    this.router.navigate(['/termsandcondition']);
  }
  // mobileNo: string;
  available: boolean = false;
  Unavailable: boolean = false;
  @ViewChild('searchInput') searchInput: ElementRef;
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
          alert(`Please Select File less than 2 MB`);
          // alert('Please Select File less than 2 MB');
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
  ifSelect4 = false;
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
          this.ifSelect4 = true;
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
  ifSelect5 = false;
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
            this.selectedFileBLOB5 =
              this.sanitizer.bypassSecurityTrustUrl(url5);
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
          this.ifSelect6 = true;
        }
      } else {
        alert(`Invalid file format. Please select .JPG or .PDF file formats.`);
        this.fileFormetValid = false;
      }
    }
  }
  // upload pan sample code //

  // upload license sample code //
  file3: File;
  files3: any;
  LicenseFiles3: any;
  fileSize3: number;
  LicenseUrlLink3: string;
  LicenseFileName3: string;
  LicenseSelectedFileBLOB3;
  // fileFormetValid = true
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
          alert(`Please Select File less than 2 MB`);
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
        alert(`Invalid file format. Please select .JPG or .PDF file formats.`);
        this.fileFormetValid = false;
      }
    }
  }
  //  fourth, fifth, sixth file driver code end  //
  vehicleTypeMaster: VehicleTypeMaster[] = []
  VehicleTypeMaster_SelectAll() {
    this.AllCity = [];
    this.vehicleTypeMasterService.VehicleTypeMaster_SelectAll().subscribe(
      (res) => {
        this.vehicleTypeMaster = res
        // this.loaderService.isLoading.next(false);
      },
      (error: HttpErrorResponse) => {
        alert(error.statusText);
      }
    );
  }
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
  showMobileOtpBtn: boolean = false;
  showEmailOtpBtn: boolean = false;
  MobileIconVerified = false;
  emailIconVerified = false;
  // mobileVerified = false;
  mobileNo;
  emailId;
  onMobileNo = false;
  onEmail = false;
  userMobileNo;
  userEmail;
  //send otp model
  OTPconfig: ModalOptions = {
    animated: true,
    backdrop: 'static',
    class: 'modal-dialog-centered modal-md',
  };


  isOtp: boolean = false;
  otpBtnDisable: boolean = false;
  countDownTimer: any;
  MobileNo;
  timerOn = true;
  otp: string;
  resendOtpBtnDisabled: boolean = true;
  mobileDisable = false;
  emailDisable = false;



  // mobileVerified = false;
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
        // this.notifier.showError('OTP not matched');
        this.mobileDisable = true;
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
        // this.isSubmitDisable = true;
        this.emailDisabled = true;
        this.emailIconVerified = true;
      } else {
        alert('OTP not matched');
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


  bindDoctorDetailService(isReInitilized) {
    this.loader = true;
    if (isReInitilized) {
      this.isDtInitialized = false;
    }
    let txtSearchData = this.myNoteForm.controls.txtSearch.value;
    if (txtSearchData == '') {
      txtSearchData = 'null';
    }
    this.doctorDetailService.getDoctorList(txtSearchData).subscribe(
      (res) => {
        console.log("res", res)

        this.userDetailList = res;
        if (!this.isDtInitialized) {
          this.dtTrigger.next();
        }
        this.isDtInitialized = true;
        setTimeout(() => {
          this.loader = false;
        }, 300);
      },
      (error: HttpErrorResponse) => {
        // this.notifier.showError(error.statusText);
      }
    );
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      this.bindDoctorDetailService(true);
    });
  }

  config: ModalOptions = {
    animated: true,
    backdrop: 'static',
    class: 'modal-dialog-centered modal-xl',
  };
  alertconfig: ModalOptions = {
    animated: true,
    backdrop: 'static',
    class: 'modal-dialog-centered modal-md',
  };
  mapconfig: ModalOptions = {
    animated: true,
    backdrop: 'static',
    class: 'modal-dialog-centered modal-xl',
  };
  nDriverId;
  PracticeWithDrome;
  activateConfirmationModel(template: TemplateRef<any>,nDriverId,PracticeWithDrome) {
    this.conformaitonmodalRef = this.modalService.show(template, this.alertconfig);
    this.nDriverId = nDriverId;
    this.PracticeWithDrome=PracticeWithDrome
  }
  openmap(template: TemplateRef<any>,nDriverId) {
    this.doctorDetailService.getDriverCurrentLocation(nDriverId).subscribe(
      (res) => {
         console.log('current location',res)
         if(res.length>0){
          this.trackLocation=true;
          this.trackingDriverId=nDriverId;
          this.conformaitonmodalRef = this.modalService.show(template, this.mapconfig);
          this.nDriverId = nDriverId;
          console.log('dd',nDriverId)
         let lat=parseFloat(res[0].vDiriverCurrentLat);
         let lng=parseFloat(res[0].vDiriverCurrentLong);
         this.center.lat=lat;
         this.center.lng=lng
        //  this.markerPositions=[];
        //  this.markerPositions.push({
        //   lat:lat,
        //   lng:lng,              
        // });
        this.markerPos={lat:lat,lng:lng,}
        console.log('le', this.markerPositions.length)      
      }
      else{
        alert('Driver location not available!')
      }
      });
    
   
    
  }
  closeDriverTrackingModel(){
    this.conformaitonmodalRef.hide();
    this.trackLocation=false;
    this.trackingDriverId=0;

  }
  activateDoctor() {
    this.loader = true
    this.conformaitonmodalRef.hide();
    let driver = {
      nUserId: this.nDriverId,
    };
    console.log('driver',driver)
    this.doctorDetailService.UpdateDriverSupervisorStatus(driver).subscribe((res) => {
        if(res){
        this.loader = false
        this.showSuccessMessage(res, 'success', true);
        this.rerender();
        }
      }, (error: HttpErrorResponse) => {
      // this.notifier.showError(error.statusText);
    });
  }

  modelCencelBtn() {
    this.conformaitonmodalRef.hide();
  }
  // getDriverByUserId(){

  // }
  editClick(template: TemplateRef<any>, items, countryId: number) {
    this.modalRef = this.modalService.show(template, this.config);
    this.ModalTitle = "Edit Driver Details ";
    this.formType = "Update";
    this.driverSignupForm.get('vMobileNo')?.disable();
    this.driverSignupForm.get('vEmailId')?.disable();

    this.editCountryRowItem(items, countryId);
    this.modalRef.onHide.subscribe(() => {
      this.driverSignupForm.reset();
    });
  }
  fileNameAadhar
  fileNamePAN
  driverDetailsList
  fileNameLicense
  fileNameVehicleRegistration
  fileNameVehicleInsurance
  fileNameProfilePhoto

  editAadharpath
  editPANpath
  editLicensepath
  editVehicleRegistrationpath
  editVehicleInsurancepath
  editProfilePhotopath
  editCountryRowItem(items, nDriverId) {
    console.log("nDriverId", nDriverId)
    let country = this.userDetailList.find(e => e.nDriverId == nDriverId);
    this.selectedCity= { CityStateDetails: country?.CityDetails };
    this.driverSignupForm.get('vAadhaarNoFilePath')?.setValue(country?.vAadhaarNoFilePath);
    this.urlLink = `${environment.dossiarImageUrl}/${country?.vAadhaarNoFilePath}`;
    this.fileNameAadhar = country?.vAadhaarNoFilePath.split("//").slice(-1).pop()!!;
    if (this.fileNameAadhar.length > 6) {
      this.fileNameAadhar = this.fileNameAadhar.slice(0, 10);
    }
    if (country?.vAadhaarNoFilePath!="") {
      this.ifSelect1 = true;
    }else{
      this.ifSelect1 = false;
    }
    this.editAadharpath = country?.vAadhaarNoFilePath
    this.cityId = country?.nCityId

    this.driverSignupForm.get('vPANNoFilePath')?.setValue(country?.vPANNoFilePath);
    this.LogoUrlLink = `${environment.dossiarImageUrl}/${country?.vPANNoFilePath}`;
    this.fileNamePAN = country?.vPANNoFilePath.split("//").slice(-1).pop()!!;
    if (this.fileNamePAN.length > 6) {
      this.fileNamePAN = this.fileNamePAN.slice(0, 10);
    }
    if (country?.vPANNoFilePath!="") {
      this.ifSelect2 = true;
    }else{
      this.ifSelect2 = false;
    }
    this.editPANpath = country?.vPANNoFilePath

    this.driverSignupForm.get('vLicenseNoFilePath')?.setValue(country?.vLicenseNoFilePath);
    this.LicenseUrlLink = `${environment.dossiarImageUrl}/${country?.vLicenseNoFilePath}`;
    this.fileNameLicense = country?.vLicenseNoFilePath.split("//").slice(-1).pop()!!;
    if (this.fileNameLicense.length > 6) {
      this.fileNameLicense = this.fileNameLicense.slice(0, 10);
    }
    if (country?.vLicenseNoFilePath!="") {
      this.ifSelect4 = true;
    }else{
      this.ifSelect4 = false;
    }
    this.editLicensepath = country?.vLicenseNoFilePath

    this.driverSignupForm.get('vVehicleRegistrationNoFilePath')?.setValue(country?.vVehicleRegistrationNoFilePath);
    this.urlLink5 = `${environment.dossiarImageUrl}/${country?.vVehicleRegistrationNoFilePath}`;
    this.fileNameVehicleRegistration = country?.vVehicleRegistrationNoFilePath.split("//").slice(-1).pop()!!;
    if (this.fileNameVehicleRegistration.length > 6) {
      this.fileNameVehicleRegistration = this.fileNameVehicleRegistration.slice(0, 10);
    }
    if (country?.vVehicleRegistrationNoFilePath!="") {
      this.ifSelect5 = true;
    }else{
      this.ifSelect5 = false;
    }
    this.editVehicleRegistrationpath = country?.vVehicleRegistrationNoFilePath

    this.driverSignupForm.get('vVehicleInsuranceFilePath')?.setValue(country?.vVehicleInsuranceFilePath);
    this.LogoUrlLink6 = `${environment.dossiarImageUrl}/${country?.vVehicleInsuranceFilePath}`;
    this.fileNameVehicleInsurance = country?.vVehicleInsuranceFilePath.split("//").slice(-1).pop()!!;
    if (this.fileNameVehicleInsurance.length > 6) {
      this.fileNameVehicleInsurance = this.fileNameVehicleInsurance.slice(0, 10);
    }
    if (country?.vVehicleInsuranceFilePath!="") {
      this.ifSelect6 = true;
    }else{
      this.ifSelect6 = false;
    }
    this.editVehicleInsurancepath = country?.vVehicleInsuranceFilePath

    this.driverSignupForm.get('vPhotoFilePath')?.setValue(country?.vPhotoFilePath);
    this.LicenseUrlLink3 = `${environment.dossiarImageUrl}/${country?.vPhotoFilePath}`;
    this.fileNameProfilePhoto = country?.vPhotoFilePath.split("//").slice(-1).pop()!!;
    if (this.fileNameProfilePhoto.length > 6) {
      this.fileNameProfilePhoto = this.fileNameProfilePhoto.slice(0, 10);
    }
    if (country?.vPhotoFilePath!="") {
      this.ifSelect3 = true;
    }else{
      this.ifSelect3 = false;
    }
    this.editProfilePhotopath = country?.vPhotoFilePath

    let userId = country?.nUserId
    console.log("userId", userId)

    this.doctorDetailService.getDriverDetailsByUserId(userId).subscribe(
      (res) => {
        console.log("res_driver", res)
        this.driverDetailsList = res
        let driver = this.driverDetailsList.find(e => e.nDriverId == nDriverId);

        console.log("driver", driver)
        console.log("driver.vFullName", driver.vFullName)
        this.driverSignupForm.patchValue({

          nVId: driver?.nVId,
          vGender: driver?.vGender,
          dtDOB: driver?.dtDOB,
          vPresentAddress: driver?.vPresentAddress,
          vPermanentAddress: driver?.vPermanentAddress,
          vAlternateNo: driver?.vAlternateNo,
          vLicenseNo: driver?.vLicenseNo,
          vAadhaarNo: driver?.vAadhaarNo,
          vPANNo: driver?.vPANNo,
          vVehicleRegistrationNo: driver?.vVehicleRegistrationNo,
          vFullName: driver?.vFullName,
          vMobileNo: driver?.vMobileNo,
          vEmailId: driver?.vEmailId,
          nCityId: driver?.nCityId,

          nDriverId: driver?.nDriverId,
          vDriverId: driver?.vDriverId,
    
        });

        setTimeout(() => {
          this.loader = false;
        }, 300);
      },
      (error: HttpErrorResponse) => {
        // this.notifier.showError(error.statusText);
      }
    );

  }
  //  submit  start  //
  errorMobileTxt = false;
  errorEmailTxt = false;
  errorCityTxt = false;

  DriverDetailsModel: DriverMaster;
  DriverDetailsList: DriverMaster[] = [];
  DriverMasterClass: DriverMasterClass;
  signUp() {

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
  searchPastConsultation() {
    this.rerender();
  }

  countryMaster
  onSubmitCountryMasterForm(): void {
    this.btnLoader = true;

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

    fp1 = this.editAadharpath;
    fp2 = this.editPANpath;
    fp3 = this.editLicensepath;
    fp4 = this.editVehicleRegistrationpath;
    fp5 = this.editVehicleInsurancepath;
    fp6 = this.editProfilePhotopath;

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
    // if (this.driverSignupForm.controls.dtDOB.value != null) {
    //   if (typeof this.driverSignupForm.controls.dtDOB.value == 'object') {
    //     let dobDate = this.driverSignupForm.controls.dtDOB.value._d;
    //     let month = dobDate.getMonth() + 1;
      //   dob = dobDate.getFullYear() + '-' + month + '-' + dobDate.getDate();
      // } else {
        dob = this.driverSignupForm.controls.dtDOB.value;
      // }
    // }
    this.DriverDetailsList = [];
    this.DriverDetailsModel = {
      nDriverId:
        this.driverSignupForm.controls.nDriverId.value == null
          ? 0
          : this.driverSignupForm.controls.nDriverId.value,
      // vDriverId: this.driverSignupForm.controls.vDriverId.value,
      nVId: parseInt(this.driverSignupForm.controls.nVId.value),
      vGender: this.driverSignupForm.controls.vGender.value,
      dtDOB: parseDateToString(dob),
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
      .DriverMasterUpdate(
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
            this.showSuccessMessage(status, 'success', true);
            this.driverSignupForm.reset();
            this.modalRef.hide();
            setTimeout(() => {
              this.btnLoader = false;
            }, 300);
          }
        },
        (error: HttpErrorResponse) => {
          alert(error.statusText);
        }
      );
  };
}