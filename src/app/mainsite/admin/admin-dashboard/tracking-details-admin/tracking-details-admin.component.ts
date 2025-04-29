
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { NotificationService } from 'src/app/core/service/notification.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { environment } from 'src/environments/environment';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { TrackingDetailsAdminService } from './tracking-details-admin.service';
import { TrackingDetailsMaster } from 'src/app/mainsite/models/tracking-details-master';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-tracking-details-admin',
  templateUrl: './tracking-details-admin.component.html',
  styleUrls: ['./tracking-details-admin.component.scss']
})
export class TrackingDetailsAdminComponent implements OnInit {
  myNoteForm: UntypedFormGroup
  buyCreditsa :TrackingDetailsMaster[] = [];

  panelOpenState = false;
  serverFileUrl: string;
  loader = false;
  roleId
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  pageTitle: any
  constructor(
    private formBuilder: UntypedFormBuilder,
    private storageService: StorageService,
    private utilityService: UtilityService,
    // private notifier: NotificationService,
    private buyCreditsaService: TrackingDetailsAdminService,
    private route: ActivatedRoute,

  ) { }
 

 
  ngOnInit(): void {
    this.dtOptions = {
      //destroy: true,
      dom: 'lBfrtip',
      "lengthMenu": [5, 10, 25, 50, 100],
      "pageLength": 5,
      "scrollX": true,
      "searching": false,
      // Configure the buttons
      buttons: [
        { extend: 'excel', text: 'Export To Excel', filename: "ChiefComplaint master" }
      ],
      columnDefs: [{
        orderable: false,
        targets: "no-sort"
      }]
    }
    this.roleId = this.storageService.roleId;
    this.pageTitle = this.route.snapshot.queryParams.title;
    this.serverFileUrl = environment.dossiarApiUrl;
    this.myNoteForm = this.formBuilder.group({
      fromDate: [null],
      toDate: [null],
      txtSearch: [null],
      // nPatientUserId:[null],
    })
    this.getCurrentDateFilter();
  }

  /// filter with date
currentDateFilter: any
pastDate: any;
maxDateFilter: any

getCurrentDateFilter() {
  this.utilityService.getCurrentDate().subscribe((res) => {
    this.currentDateFilter = new Date(res[0].CurrDate);
    this.maxDateFilter = new Date(res[0].CurrDate);

    this.myNoteForm.get('toDate')?.setValue(this.currentDateFilter);
    let pDate = new Date(this.currentDateFilter);
    pDate.setDate(pDate.getDate() - 7);
    this.pastDate = pDate;
    this.myNoteForm.get('fromDate')?.setValue(this.pastDate);
    this.bindCreditsUsageReportList(false);

  }, (error: HttpErrorResponse) => {
    // this.notifier.showError(error.statusText);
  });
}
isDtInitialized: boolean = false
bindCreditsUsageReportList(isReInitilized) {
  this.loader = true;
  if (isReInitilized) {
    this.isDtInitialized = false;
  }
  if (this.pastDate._d) {
    this.pastDate = this.pastDate._d
  }
  if (this.currentDateFilter._d) {
    this.currentDateFilter = this.currentDateFilter._d
  }


  let fromDate = this.parseDateToString(this.pastDate);
  let toDate = this.parseDateToString(this.currentDateFilter);
  let txtSearchData = this.myNoteForm.controls.txtSearch.value;
  // let nPatientUserId = this.storageService.userId!!;
  if (txtSearchData == "") {
    txtSearchData = "null"
  }
  this.buyCreditsaService.GetBuyCreditsSA(fromDate, toDate, txtSearchData).subscribe((res) => {
    this.buyCreditsa = res
    console.log("res", res)
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
parseDateToString(d: any) {
  return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
}
searchPastConsultation() {
  //this.myNoteForm.get('toDate')?.setValue(this.currentDate);
  let toDate = this.myNoteForm.controls.toDate.value;
  let fromDate = this.myNoteForm.controls.fromDate.value;
  if (fromDate > toDate) {
    // this.notifier.showError("From Date should not be greater than To Date. ")
    return;
  } else {
    this.currentDateFilter = toDate
    this.pastDate = fromDate
   this.rerender();
  }
}
rerender(): void {
  this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    dtInstance.destroy();
    this.bindCreditsUsageReportList(true);
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
}
