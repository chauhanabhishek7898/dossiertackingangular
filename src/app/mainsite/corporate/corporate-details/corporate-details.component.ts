import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { filter, distinctUntilChanged, debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { StorageService } from 'src/app/core/services/storage.service';
import { environment } from 'src/environments/environment';
import { CorporatesDetailsService } from '../../admin/admin-dashboard/corporates-details/corporates-details.service';
import { CityMasterList } from '../../models/city-master';
import { CustomersSavedAddresses } from '../../models/customers-saved-addresses';
import { CorporateMasterUpdateClass, CorporateSignup, CorporateUpdae, GetCorporateUserDetail } from '../../models/DriverMaster';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { DriverSignupService } from '../../SignUp/DriverSignup/driver-signup.service';
@Component({
  selector: 'app-corporate-details',
  templateUrl: './corporate-details.component.html',
  styleUrls: ['./corporate-details.component.scss']
})
export class CorporateDetailsComponent implements OnInit {
  loader = false;
  pageTitle: any;
  errorCityTxt = false;
  corporateForm: FormGroup;
  findMemberDetails: GetCorporateUserDetail;
  CorprationModal: CorporateUpdae;
  CorporateDetailsList: CorporateUpdae[] = []
  corporateMasterUpdateClass: CorporateMasterUpdateClass

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    private corporatesDetailsService: CorporatesDetailsService,
    private formBuilder: FormBuilder,
    private storageService: StorageService,
    private driverSignupService: DriverSignupService
  ) { }
  selectedCity: any = { CityStateDetails: '' };
  selectedSpecilization: any = '';
  cityName1 = 'Gurgaon';
  cityId: any = null;
  cityMasterList: CityMasterList[] = [];
  isLoading = false;
  searchCityCtrl = new FormControl();
  errorMsg!: string;
  minLengthTerm = 3;
  apiUrl = environment.dossiarApiUrl;
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
    this.findMemberDetails = new GetCorporateUserDetail();
    this.bindUserDetailService()
    this.pageTitle = this.route.snapshot.queryParams.title;
    this.corporateForm = this.formBuilder.group({
      nEId: 0,
      vEstablishmentName: [null, [Validators.required]],
      vContactPersonOwner: [null, [Validators.required]],
      vCPDesignation: [null, [Validators.required]],
      vCPMobileNo: [null, [Validators.required]],
      vCPEmailId: [null, [Validators.required]],
      nCityId: [null],
      vAddress: [null, [Validators.required]],
      vPinCode: [null, [Validators.required]],
      vContactNo: [null, [Validators.required]],
      vWhatsUpNo: [null],
      vEmailId: [null],
      vWebsiteLink: [null], //  first file  //
      vTaxDetails: [null],
      vAuthorizedSignatory: [null], //  second file  //
      vAuthorizedSignatoryFilePath: [null],
      vLogoFilePath: [null], //  third file  //
    });

  }
  get createdriverSignupFormControls(): any {
    return this.corporateForm.controls;
  }
  file3: File;
  files3: any;
  LicenseFiles3: any;
  fileSize3: number;
  LicenseUrlLink3: string;
  LicenseFileName3: string;
  LicenseSelectedFileBLOB3;
  fileFormetValid = true
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
          this.showWarningMessage(`Please Select File less than 2 MB`, 'error', true);

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
        this.showWarningMessage(`Invalid file format. Please select .JPG or .PDF file formats.`, 'error', true);
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
          this.showWarningMessage(`Please Select File less than 2 MB`, 'error', true);
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
        this.showWarningMessage(`Invalid file format. Please select .JPG or .PDF file formats.`, 'error', true);

        this.fileFormetValid = false;
      }
      // event.target.value = null;
    }
  }
  selectedCitys
  AuthorizedSignatoryFilePath
  LogoFilePath
  bindUserDetailService() {
    this.loader = true;
    this.corporatesDetailsService.GetCorporateDetailsForAdmins(parseInt(this.storageService.userId!!)).subscribe((res) => {
      if (res) {
        this.findMemberDetails = res[0];
        this.selectedCitys = this.findMemberDetails?.CityDetails
        this.selectedCity = { CityStateDetails: this.selectedCitys }
        this.cityId = this.findMemberDetails?.nCityId

        this.LicenseUrlLink3 = `${environment.dossiarApiUrl}/${this.findMemberDetails?.vLogoFilePath}`
        if (this.LicenseUrlLink3) {
          this.ifSelect3 = true
        }
        this.urlLink5 = `${environment.dossiarApiUrl}/${this.findMemberDetails?.vAuthorizedSignatoryFilePath}`
        if (this.urlLink5) {
          this.ifSelect5 = true
        }
        this.corporateForm.patchValue({
          nEId: this.findMemberDetails?.nEId,
          vEstablishmentName: this.findMemberDetails?.vEstablishmentName,
          vContactPersonOwner: this.findMemberDetails?.vContactPersonOwner,
          vCPDesignation: this.findMemberDetails?.vCPDesignation,
          vCPMobileNo: this.findMemberDetails?.vCPMobileNo,
          vCPEmailId: this.findMemberDetails?.vCPEmailId,
          nCityId: this.findMemberDetails?.nCityId,
          vAddress: this.findMemberDetails?.vAddress,
          vPinCode: this.findMemberDetails?.vPinCode,
          vContactNo: this.findMemberDetails?.vContactNo,
          vWhatsUpNo: this.findMemberDetails?.vWhatsUpNo,
          // vEmailId: this.findMemberDetails?.vEmailId,
          vWebsiteLink: this.findMemberDetails?.vWebsiteLink, //  first file  //
          vTaxDetails: this.findMemberDetails?.vTaxDetails,
          vAuthorizedSignatory: this.findMemberDetails?.vAuthorizedSignatory, //  second file  //
          // vAuthorizedSignatoryFilePath: this.findMemberDetails?.vAuthorizedSignatoryFilePath,
          // vLogoFilePath: this.findMemberDetails?.vLogoFilePath,
        })
        if (this.findMemberDetails?.vLogoFilePath != "") {
          this.LogoFilePath = this.findMemberDetails?.vLogoFilePath
        } else {
          this.LogoFilePath = ''
        }
        if (this.findMemberDetails?.vAuthorizedSignatoryFilePath != "") {
          this.AuthorizedSignatoryFilePath = this.findMemberDetails?.vAuthorizedSignatoryFilePath
        } else {
          this.AuthorizedSignatoryFilePath = ''
        }
      }
      setTimeout(() => {
        this.loader = false
      }, 300)
    }, (error: HttpErrorResponse) => {
      // this.notifier.showError(error.statusText);
    });
  }

  submit() {
    this.loader = true
    this.CorporateDetailsList = []
    this.CorprationModal = {
      nEId: this.findMemberDetails?.nEId,
      vEstablishmentName: this.corporateForm.controls.vEstablishmentName.value,
      vContactPersonOwner: this.corporateForm.controls.vContactPersonOwner.value,
      vCPDesignation: this.corporateForm.controls.vCPDesignation.value,
      vCPMobileNo: this.corporateForm.controls.vCPMobileNo.value,
      vCPEmailId: this.corporateForm.controls.vCPEmailId.value,
      nCityId: this.cityId,
      vAddress: this.corporateForm.controls.vAddress.value,
      vPinCode: this.corporateForm.controls.vPinCode.value,
      vContactNo: this.corporateForm.controls.vContactNo.value,
      vWhatsUpNo: this.corporateForm.controls.vWhatsUpNo.value,
      vWebsiteLink: this.corporateForm.controls.vWebsiteLink.value, //  first file  //
      vTaxDetails: this.corporateForm.controls.vTaxDetails.value,
      vAuthorizedSignatory: this.corporateForm.controls.vAuthorizedSignatory.value, //  second file  //
      vAuthorizedSignatoryFilePath: this.AuthorizedSignatoryFilePath,
      vLogoFilePath: this.LogoFilePath,
    }
    this.CorporateDetailsList.push(this.CorprationModal);
    this.corporateMasterUpdateClass = {
      CorporateMaster: this.CorporateDetailsList,
    };
    this.driverSignupService.CorporateMasterUpdate(this.corporateMasterUpdateClass, this.file5, this.file3,).subscribe((status: any) => {
      if (status) {
        this.showSuccessMessage(status, 'success', true);
        this.bindUserDetailService()
        this.loader = true
      }
    },
      (error: HttpErrorResponse) => {
        this.showWarningMessage(error.statusText, 'error', true);
      }
    );
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
