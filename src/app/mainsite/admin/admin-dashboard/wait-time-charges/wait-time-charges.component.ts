import { BreakpointObserver } from '@angular/cdk/layout';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

import { VehicleTypeMaster } from '../vehicle-type-master/vehicle-type-master';
import { VehicleTypeMasterService } from '../vehicle-type-master/vehicle-type-master.service';
import { WaitTimeCharges, WaitTimeChargesGet } from './wait-time-charges';
import { WaitTimeChargesService } from './wait-time-charges.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-wait-time-charges',
  templateUrl: './wait-time-charges.component.html',
  styleUrls: ['./wait-time-charges.component.scss'],
})
export class WaitTimeChargesComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private waitTimeChargesService: WaitTimeChargesService,
    // // private notifier: NotificationService,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    // public loaderService: LoaderService,
    public breakpointObserver: BreakpointObserver,
    private vehicleTypeMasterService: VehicleTypeMasterService
  ) {}

  // variable declarations
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  ModalTitle: string;
  waitTimeChargesModel: WaitTimeCharges;
  countryMasterForm: FormGroup;
  formType: string;
  //  UpdateCountryForm: FormGroup
  //  // dtInstance: DataTables.Api;
  isDtInitialized: boolean = false;
  waitTimeCharges: WaitTimeChargesGet[] = [];

  vehicleTypeMaster: VehicleTypeMaster[] = [];
  //  bsModalRef: BsModalRef
  dtTrigger: Subject<any> = new Subject<any>();
  modalRef: BsModalRef;
  IsWait: boolean;
  @Input() disabled: boolean = true;
  loader = false;
  pageTitle: any;
  ngOnInit(): void {
    this.pageTitle = this.route.snapshot.queryParams.title;
    this.dtOptions = {
      //destroy: true,
      dom: 'lBfrtip',
      lengthMenu: [5, 10, 25, 50, 100],
      pageLength: 5,
      scrollX: true,

      // Configure the buttons
      buttons: [
        {
          extend: 'excel',
          text: 'Export To Excel',
          filename: 'country master',
        },
      ],
      columnDefs: [
        {
          orderable: false,
          targets: 'no-sort',
        },
      ],
    };

    this.bindwaitTimeCharges(false);
    this.countryMasterForm = this.formBuilder.group({
      nWId: [0],
      nVId: [0, [Validators.required]],
      nWaitTimeCharges: [0, [Validators.required]],
      btActive: new FormControl({ value: 'true', disabled: true }),
    });
  }

  get createCountryMasterFormControls(): any {
    return this.countryMasterForm.controls;
  }
  countryMaster;
  onSubmitCountryMasterForm(): void {
    if (this.formType == 'Submit') {
      this.loader = true;
      this.waitTimeChargesModel = {
        nWId:
          this.countryMasterForm.controls.nWId.value == null
            ? 0
            : this.countryMasterForm.controls.nWId.value,
        nVId: this.countryMasterForm.controls.nVId.value,
        nWaitTimeCharges:
          this.countryMasterForm.controls.nWaitTimeCharges.value,
        btActive: this.countryMasterForm.controls.btActive.value,
      };

      this.waitTimeChargesService
        .WaitTimeCharges(this.waitTimeChargesModel, this.formType)
        .subscribe(
          (status: string) => {
            if (status) {
              this.loader = false;
              this.showSuccessMessage(status, 'success', true);
              this.countryMasterForm.reset();
              //  this. resetCountryMasterFormValue()
              this.modalRef.hide();
              setTimeout(() => {
                this.rerender();
              }, 100);
            } else {
            }
          },
          (error: HttpErrorResponse) => {
            this.showWarningMessage(error.statusText, 'error', true);
          }
        );
    } else {
      this.loader = true;
      this.waitTimeChargesModel = {
        nWId:
          this.countryMasterForm.controls.nWId.value == null
            ? 0
            : this.countryMasterForm.controls.nWId.value,
        nVId: this.countryMasterForm.controls.nVId.value,
        nWaitTimeCharges:
          this.countryMasterForm.controls.nWaitTimeCharges.value,
        btActive: this.countryMasterForm.controls.btActive.value,
      };

      this.waitTimeChargesService
        .WaitTimeCharges(this.waitTimeChargesModel, this.formType)
        .subscribe(
          (status: string) => {
            if (status) {
              this.loader = false;
              this.showSuccessMessage(status, 'success', true);
              this.countryMasterForm.reset();
              //  this. resetCountryMasterFormValue()
              this.modalRef.hide();
              setTimeout(() => {
                this.rerender();
              }, 100);
            } else {
            }
          },
          (error: HttpErrorResponse) => {
            this.showWarningMessage(error.statusText, 'error', true);
          }
        );
    }
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first

      dtInstance.destroy();
      this.bindwaitTimeCharges(true);
    });
  }
  bindwaitTimeCharges(isReInitilized) {
    this.loader = true;
    if (isReInitilized) {
      this.isDtInitialized = false;
    }
    this.waitTimeChargesService.WaitTimeCharges_SelectAll().subscribe(
      (res) => {
        console.log("onload", res)
        this.waitTimeCharges = res;

        if (!this.isDtInitialized) {
          this.dtTrigger.next();
        }
        this.isDtInitialized = true;
        setTimeout(() => {
          this.loader = false;
        }, 300);
      },
      (error: HttpErrorResponse) => {
        // // this.notifier.showError(error.statusText);
      }
    );
  }

  VehicleTypeMaster_SelectAll() {
    this.vehicleTypeMasterService.VehicleTypeMaster_SelectAll().subscribe(
      (res) => {
        console.log("res", res)
        this.vehicleTypeMaster = res;

        setTimeout(() => {
          this.loader = false;
        }, 300);
      },
      (error: HttpErrorResponse) => {
        // // this.notifier.showError(error.statusText);
      }
    );
  }
  config: ModalOptions = {
    animated: true,
    backdrop: 'static',
    class: 'modal-dialog-centered modal-md',
  };
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
    this.ModalTitle = 'Add Wait Time Rate';
    this.formType = 'Submit';
    this.countryMasterForm.get('btActive')?.disable();
    this.countryMasterForm.get('btActive')?.setValue(true);

    this.VehicleTypeMaster_SelectAll();
    this.modalRef.onHide.subscribe(() => {
      this.countryMasterForm.reset();
    });
  }

  editClick(template: TemplateRef<any>, countryId: number) {
    this.modalRef = this.modalService.show(template, this.config);
    this.countryMasterForm.get('btActive')?.enable();
    this.ModalTitle = 'Edit Wait Time Rate ';
    this.formType = 'Update';
    this.VehicleTypeMaster_SelectAll();
    this.editCountryRowItem(countryId);
    this.modalRef.onHide.subscribe(() => {
      this.countryMasterForm.reset();
    });
  }
  editCountryRowItem(nWId: number) {
    let country = this.waitTimeCharges.find((e) => e.nWId == nWId);
    this.countryMasterForm.patchValue({
      nWId: country?.nWId,
      nVId: country?.nVId,

      nWaitTimeCharges: country?.nWaitTimeCharges,
      btActive: country?.btActive,
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
