import { BreakpointObserver } from '@angular/cdk/layout';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { VehicleTypeMaster } from './vehicle-type-master';
import { VehicleTypeMasterService } from './vehicle-type-master.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-vehicle-type-master',
  templateUrl: './vehicle-type-master.component.html',
  styleUrls: ['./vehicle-type-master.component.scss']
})
export class VehicleTypeMasterComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private vehicleTypeMasterService: VehicleTypeMasterService,
    // // private notifier: NotificationService,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    // public loaderService: LoaderService,
    public breakpointObserver: BreakpointObserver
  ) { }

  // variable declarations
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  ModalTitle: string;
  vehicleTypeMaster: VehicleTypeMaster
  countryMasterForm: FormGroup
  formType: string
  //  UpdateCountryForm: FormGroup
  //  // dtInstance: DataTables.Api;
  isDtInitialized: boolean = false
  countryList: VehicleTypeMaster[] = [];
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
      "lengthMenu": [5, 10, 25, 50, 100],
      "pageLength": 5,
      "scrollX": true,

      // Configure the buttons
      buttons: [
        { extend: 'excel', text: 'Export To Excel', filename: "country master" }
      ],
      columnDefs: [{
        orderable: false,
        targets: "no-sort"
      }]
    }

    this.bindCountryList(false);
    this.countryMasterForm = this.formBuilder.group({
      nVId: [0],
      vVehicleType: [null, [Validators.required]],
    
      btActive: new FormControl({ value: 'true', disabled: true }),
      

    });

  }


  get createCountryMasterFormControls(): any {
    return this.countryMasterForm.controls;
  }
  countryMaster
  onSubmitCountryMasterForm(): void {
    if (this.formType == "Submit") {
      let country = this.countryList.find(e => e.vVehicleType == this.countryMasterForm.controls.vVehicleType.value);
      if (country) {
        // this.notifier.showError("Country is already added")
      } else {
        this.loader=true
        this.vehicleTypeMaster = {
          nVId: this.countryMasterForm.controls.nVId.value == null ? 0 : this.countryMasterForm.controls.nVId.value,
          vVehicleType: this.countryMasterForm.controls.vVehicleType.value,
          btActive: this.countryMasterForm.controls.btActive.value
        };
        this.vehicleTypeMasterService.VehicleTypeMaster(this.vehicleTypeMaster, this.formType)
          .subscribe((status: string) => {
            if (status) {
              this.loader=false
              this.showSuccessMessage(status, 'success', true);
              this.countryMasterForm.reset();
              //  this. resetCountryMasterFormValue()
              this.modalRef.hide();
              setTimeout(() => {
                this.rerender();
              }, 100)
            } else {
            }
          }, (error: HttpErrorResponse) => {
            this.showWarningMessage(error.statusText, 'error', true);
          });
      }
    }
    else {
      this.loader=true
      this.vehicleTypeMaster = {
        nVId: this.countryMasterForm.controls.nVId.value == null ? 0 : this.countryMasterForm.controls.nVId.value,
          vVehicleType: this.countryMasterForm.controls.vVehicleType.value,
       
          btActive: this.countryMasterForm.controls.btActive.value
      };
      this.vehicleTypeMasterService.VehicleTypeMaster(this.vehicleTypeMaster, this.formType)
        .subscribe((status: string) => {
          if (status) {
            this.loader=false
            this.showSuccessMessage(status, 'success', true);
            this.countryMasterForm.reset();
            //  this. resetCountryMasterFormValue()
            this.modalRef.hide();
            setTimeout(() => {
              this.rerender();
            }, 100)
          } else {
          }
        }, (error: HttpErrorResponse) => {
          this.showWarningMessage(error.statusText, 'error', true);
        });
    }
  };
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first

      dtInstance.destroy();
      this.bindCountryList(true);
    });
  }
  bindCountryList(isReInitilized) {
    this.loader = true;
    if (isReInitilized) {
      this.isDtInitialized = false;
    }
    this.vehicleTypeMasterService.VehicleTypeMaster_SelectAll(
    ).subscribe((res) => {
      this.countryList = res;

      if (!this.isDtInitialized) {
        this.dtTrigger.next();
      }
      this.isDtInitialized = true;
      setTimeout(() => {
        this.loader = false
      }, 300)


    }, (error: HttpErrorResponse) => {
      // // this.notifier.showError(error.statusText);
    });
  }
  config: ModalOptions = {
    animated: true,
    backdrop: 'static',
    class: 'modal-dialog-centered modal-md',
  };
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
    this.ModalTitle = "Add Vehicle";
    this.formType = "Submit"
    this.countryMasterForm.get('btActive')?.disable();
    this.countryMasterForm.get('btActive')?.setValue(true);
    this.modalRef.onHide.subscribe(() => {
      this.countryMasterForm.reset();
    });
  }

  editClick(template: TemplateRef<any>, countryId: number) {
    this.modalRef = this.modalService.show(template, this.config);
    this.countryMasterForm.get('btActive')?.enable();
    this.ModalTitle = "Edit Vehicle ";
    this.formType = "Update";
    this.editCountryRowItem(countryId);
    this.modalRef.onHide.subscribe(() => {
      this.countryMasterForm.reset();
    });
  }
  editCountryRowItem(nVId: number) {
    let country = this.countryList.find(e => e.nVId == nVId);
    this.countryMasterForm.patchValue({
      nVId: country?.nVId,
      vVehicleType: country?.vVehicleType,
      btActive: country?.btActive
    });
  }

  resetCountryMasterFormValue() {
    this.countryMasterForm.patchValue({
      nCountryId: 0,
      vCountryName: null,
      btActive: true
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
