import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { NotificationService } from 'src/app/core/service/notification.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { CustomerMaster } from 'src/app/mainsite/models/CustomerMaster';
import { environment } from 'src/environments/environment';
import { CustomerDetailsMasterService } from './customer-details-master.service';

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
  PatientDetailList: CustomerMaster[] = [];
  dtTrigger: Subject<any> = new Subject<any>();
  modalRef: BsModalRef;
  IsWait: boolean;
  @Input() disabled:boolean = true;
  imageUrl: string
  loader = false;
  pageTitle: any;
  constructor(
    private patientDetailService: CustomerDetailsMasterService,
    private notifier: NotificationService,
    private storageService: StorageService,
    private route: ActivatedRoute,
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

    this.bindPatientDetailService(false);
  }
  bindPatientDetailService(isReInitilized) {
    this.loader = true;
    //this.loaderService.isLoading = new BehaviorSubject<boolean>(true);;
    if (isReInitilized) {
      this.isDtInitialized = false;
    }
    this.patientDetailService.getPatientList(parseInt(this.storageService.userId!!)
    ).subscribe((res) => {
      this.PatientDetailList = res;

      if (!this.isDtInitialized) {
        this.dtTrigger.next();
      }
      this.isDtInitialized = true;
      setTimeout(() => {
        this.loader = false
      }, 300)
    }, (error: HttpErrorResponse) => {
      this.notifier.showError(error.statusText);
    });
  }

}
