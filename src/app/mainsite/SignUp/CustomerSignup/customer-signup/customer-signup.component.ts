import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/mainsite/Login/login.service';

@Component({
  selector: 'app-customer-signup',
  templateUrl: './customer-signup.component.html',
  styleUrls: ['./customer-signup.component.scss']
})
export class CustomerSignupComponent implements OnInit {

  constructor( private loginService: LoginService,
    private formBuilder: FormBuilder,
    private router: Router,
    private sanitizer: DomSanitizer,) { }
    customerSignupForm: FormGroup;
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
  opentermConditionComponent(){
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
          this.ifSelect=true
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
}
