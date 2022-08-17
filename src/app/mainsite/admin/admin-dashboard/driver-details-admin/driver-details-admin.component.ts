import { UtilityService } from 'src/app/core/services/utility.service';
import { DriverMaster } from './../../../models/DriverMaster';
import { HttpErrorResponse } from '@angular/common/http';
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
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { DataTableDirective } from 'angular-datatables';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
// import { NotificationService } from 'src/app/core/service/notification.service';
import { environment } from 'src/environments/environment';
import { DriverDetailsAdminService } from './driver-details-admin.service';
import { ActivatedRoute } from '@angular/router';
import { ApproveDriverMasterList } from 'src/app/mainsite/models/approve-driver';
import Swal from 'sweetalert2/dist/sweetalert2.js';

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
  countryMasterForm: FormGroup;
  formType: string;
  imageUrl: string;
  isDtInitialized: boolean = false;
  userDetailList: ApproveDriverMasterList[] = [];
  dtTrigger: Subject<any> = new Subject<any>();
  modalRef: BsModalRef;
  conformaitonmodalRef: BsModalRef;
  IsWait: boolean;
  loader = false;
  @Input() disabled: boolean = true;
  myNoteForm: FormGroup;
  pageTitle: any;

  constructor(
    private doctorDetailService: DriverDetailsAdminService,
    // private notifier: NotificationService,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private utilityService: UtilityService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
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
  }

  searchPastConsultation() {
    this.rerender();
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
    class: 'modal-dialog-centered modal-md',
  };
  nDriverId;
  PracticeWithDrome;
  activateConfirmationModel(
    template: TemplateRef<any>,
    nDriverId
  ) {
    this.conformaitonmodalRef = this.modalService.show(template, this.config);
    this.nDriverId = nDriverId;
  }

  activateDoctor() {
    this.loader=true
    this.conformaitonmodalRef.hide();
    let driver = {
      nDriverId: this.nDriverId,
    };
    // this.doctorDetailService.ActivateRevokeDoctorPraticeWithDrome(driver).subscribe((res) => {
    //     if(res){
      this.loader=false
    //       this.notifier.showSuccess(res);
    //       this.rerender();
    //     }
    //   }, (error: HttpErrorResponse) => {
    //   // this.notifier.showError(error.statusText);
    // });
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
