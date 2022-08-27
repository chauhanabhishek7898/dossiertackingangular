import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { CustomersSavedAddresses, GetCorporateDetailsForAdmin } from 'src/app/mainsite/models/customers-saved-addresses';
import { environment } from 'src/environments/environment';
import { CorporatesDetailsService } from './corporates-details.service';

@Component({
  selector: 'app-corporates-details',
  templateUrl: './corporates-details.component.html',
  styleUrls: ['./corporates-details.component.scss']
})
export class CorporatesDetailsComponent implements OnInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  ModalTitle: string;
  userModel: CustomersSavedAddresses
  getFindMemberForm: FormGroup
  formType: string

  isDtInitialized: boolean = false
  findMemberDetails: GetCorporateDetailsForAdmin[] = [];
  dtTrigger: Subject<any> = new Subject<any>();
  modalRef: BsModalRef;
  conformaitonmodalRef: BsModalRef;
  IsWait: boolean;
  @Input() disabled: boolean = true;
  userMobileNo: string
  isOtp: boolean = false;
  otp: string
  otpBtnDisable: boolean = false;
  resendOtpBtnDisabled: boolean = true;
  isSubmitDisable: boolean = true;
  mobileVerified = false;
  timerOn = true;
  countDownTimer: string;
  UserId: any;
  loader = false;
  pageTitle: any
  imageUrl=environment.dossiarApiUrl
  constructor(
    private corporatesDetailsService: CorporatesDetailsService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {

    this.pageTitle = this.route.snapshot.queryParams.title;
    this.dtOptions = {
      //destroy: true,
      dom: 'lBfrtip',
      "lengthMenu": [5, 10, 25, 50, 100],
      "pageLength": 5,
      "scrollX": true,
      "searching": false,

      // Configure the buttons
      buttons: [],
      columnDefs: [{
        orderable: false,
        targets: "no-sort"
      }]
    }
    this.getFindMemberForm = this.formBuilder.group({
      txtSearch: [null],
    });
    this.bindUserDetailService(false);

  }

  searchLeave(){
    let text =this.getFindMemberForm.controls.txtSearch.value
    if( text == null||text == ''){
      // this.notifier.showError(`Please Enter address`);
    }else{
      this.rerender()
    }
  }

  bindUserDetailService(isReInitilized) {
    this.loader = true;
    let vGeneric = this.getFindMemberForm.controls.txtSearch.value;
    if (isReInitilized) {
      this.isDtInitialized = false;
    }
    this.corporatesDetailsService.GetCorporateDetailsForAdmin(vGeneric).subscribe((res) => {
      this.findMemberDetails = res;
      if (!this.isDtInitialized) {
        this.dtTrigger.next();
      }
      this.isDtInitialized = true;
      setTimeout(() => {
        this.loader = false
      }, 300)
    }, (error: HttpErrorResponse) => {
      // this.notifier.showError(error.statusText);
    });
  }
 
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      this.bindUserDetailService(true);
    });
  }

}
