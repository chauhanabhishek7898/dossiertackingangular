import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { NotificationService } from 'src/app/core/services/notification.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { CustomersSavedAddresses } from 'src/app/mainsite/models/customers-saved-addresses';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { CustomersSavedAddressesService } from './customers-saved-addresses.service';

@Component({
  selector: 'app-customers-saved-addresses-master',
  templateUrl: './customers-saved-addresses-master.component.html',
  styleUrls: ['./customers-saved-addresses-master.component.scss']
})

export class CustomersSavedAddressesMasterComponent implements OnInit {

@ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  ModalTitle: string;
  userModel: CustomersSavedAddresses
  getFindMemberForm: UntypedFormGroup
  formType: string

  isDtInitialized: boolean = false
  findMemberDetails: CustomersSavedAddresses[] = [];
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
  
  constructor(
    private findMemberDetailsService: CustomersSavedAddressesService,
    private formBuilder: UntypedFormBuilder,
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
    this.findMemberDetailsService.getDoctorList(vGeneric).subscribe((res) => {
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
