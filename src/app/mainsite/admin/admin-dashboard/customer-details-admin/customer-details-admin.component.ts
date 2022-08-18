import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
// import { NotificationService } from 'src/app/core/service/notification.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { CustomerMaster, CustomerMasterList } from 'src/app/mainsite/models/CustomerMaster';
import { environment } from 'src/environments/environment';
import { CustomerDetailsMasterService } from './customer-details-master.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-customer-details-admin',
  templateUrl: './customer-details-admin.component.html',
  styleUrls: ['./customer-details-admin.component.scss']
})
export class CustomerDetailsAdminComponent implements OnInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  ModalTitle: string;
  conutryModel: CustomerMaster
  countryMasterForm: FormGroup
  formType: string
  
  isDtInitialized: boolean = false
  PatientDetailList: CustomerMasterList[] = [];
  dtTrigger: Subject<any> = new Subject<any>();
  modalRef: BsModalRef;
  IsWait: boolean;
  @Input() disabled:boolean = true;
  imageUrl: string
  loader = false;
  pageTitle: any;
  constructor(
    private patientDetailService: CustomerDetailsMasterService,
    // private notifier: NotificationService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    ) { }

  ngOnInit(): void {
    this.pageTitle = this.route.snapshot.queryParams.title;
    this.imageUrl = environment.dossiarApiUrl;
    this.dtOptions = {
      //destroy: true,
      dom: 'lBfrtip',
      "lengthMenu": [5, 10, 25, 50, 100],
      "pageLength": 5,
      "scrollX": true,

      // Configure the buttons
      buttons: [
        { extend: 'excel', text: 'Export To Excel', filename: "MIS: Patients Details" }
      ],
      columnDefs: [{
        orderable: false,
        targets: "no-sort"
      }]
    }
    console.log("storageiid", this.storageService.userId)

    this.bindPatientDetailService(false);
  }
  bindPatientDetailService(isReInitilized) {
    this.loader = true;
    //this.loaderService.isLoading = new BehaviorSubject<boolean>(true);;
    if (isReInitilized) {
      this.isDtInitialized = false;
    }
    this.patientDetailService.GetCustomerMasterByUserId(21
    ).subscribe((res) => {
      console.log("res", res)
      this.PatientDetailList = res;

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
  conformaitonmodalRef: BsModalRef;
  conformationConfig: ModalOptions = {
    animated: true,
    backdrop: 'static',
    class: 'modal-dialog-centered modal-md',
  };
  UserId
  btActive
  openConformaitionModel(template: TemplateRef<any>, nUserId,btActive) {
    this.conformaitonmodalRef = this.modalService.show(
      template,
      this.conformationConfig
    );
    this.btActive=btActive
    this.UserId = nUserId;
  }
  modelCencelBtn() {
    this.conformaitonmodalRef.hide();
  }
  ActivateUserDetail(): void {
    // this.loader = true;
    let user = {
      nUserId: this.UserId,
    };
    this.patientDetailService.ActivateRevokeRightsOfCustomer(user).subscribe(
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
      this.bindPatientDetailService(true);
    });
  }
}
