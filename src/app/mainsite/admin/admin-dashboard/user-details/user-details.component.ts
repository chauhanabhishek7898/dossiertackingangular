import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { StorageService } from 'src/app/core/services/storage.service';
import { ApproveDriverMaster, GetCorporateAssistants, GetUsersDetails_Report } from 'src/app/mainsite/models/approve-driver';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { AuthService } from '../../login/admin-login/auth.services';
import { ApproveDriverMasterService } from '../approve-driver-master/approve-driver-master.service';
@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  ModalTitle: string;
  userModel: ApproveDriverMaster;
  UpdateList: UntypedFormGroup;
  formType: string;
  UserId: any;
  isDtInitialized: boolean = false;
  userDetailList: GetUsersDetails_Report[] = [];
  dtTrigger: Subject<any> = new Subject<any>();
  conformaitonmodalRef: BsModalRef;
  IsWait: boolean;
  @Input() disabled: boolean = true;
  userMobileNo: string;
  isOtp: boolean = false;
  otp: string;
  otpBtnDisable: boolean = false;
  resendOtpBtnDisabled: boolean = true;
  isSubmitDisable: boolean = true;
  mobileVerified = false;
  timerOn = true;
  countDownTimer: string;
  imageUrl: string;
  loader = false;
  pageTitle: any;
  myNoteForm: UntypedFormGroup;
  constructor(
    private userDetailService: ApproveDriverMasterService,
    // private notifier: NotificationService,
    private modalService: BsModalService,
    private authService: AuthService,
    private storageService: StorageService,
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.pageTitle = this.route.snapshot.queryParams.title;
    this.imageUrl = environment.dossiarApiUrl;
    this.dtOptions = {
      //destroy: true,
      dom: 'lBfrtip',
      lengthMenu: [5, 10, 25, 50, 100],
      pageLength: 5,
      scrollX: true,

      // Configure the buttons
      buttons: [
        { extend: 'excel', text: 'Export To Excel', filename: 'approve users' },
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
    this.bindUserDetailService(false);
    // this.storageService.
  }
  searchPastConsultation() {
    this.rerender();
  }
  bindUserDetailService(isReInitilized) {
    
    this.loader = true;
    if (isReInitilized) {
      this.isDtInitialized = false;
    }
    this.userDetailService.GetUsersDetails_Report().subscribe(
      (res) => {
        console.log('res', res);
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
  ActivateUserDetail(): void {
    this.loader = true;
    let user = {
      nUserId: this.UserId,
    };
    this.userDetailService.ActivateRevokeRightsOfUser(user).subscribe(
      (status: string) => {
        if (status) {
          this.showSuccessMessage(status, 'success', true);
          this.conformaitonmodalRef.hide();
          setTimeout(() => {
            this.rerender();
          }, 100);
          setTimeout(() => {
            this.loader = false;
          }, 300);
        } else {
          //  this.notifier.showError('faild');
          setTimeout(() => {
            this.loader = false;
          }, 300);
        }
      },
      (error: HttpErrorResponse) => {
        this.showWarningMessage(error.statusText, 'error', true);
      }
    );
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first

      dtInstance.destroy();
      this.bindUserDetailService(true);
    });
  }
  conformationConfig: ModalOptions = {
    animated: true,
    backdrop: 'static',
    class: 'modal-dialog-centered modal-md',
  };
  btActive
  openConformaitionModel(template: TemplateRef<any>, nUserId,btActive) {
    this.conformaitonmodalRef = this.modalService.show(
      template,
      this.conformationConfig
    );
    this.UserId = nUserId;
    this.btActive=btActive
  }
  modelCencelBtn() {
    this.conformaitonmodalRef.hide();
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
