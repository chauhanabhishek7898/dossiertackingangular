import { BreakpointObserver } from '@angular/cdk/layout';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { CityMasterList } from 'src/app/mainsite/models/city-master';
import { CityMasterService } from '../city-master/city-master.service';
import { VehicleTypeMaster } from '../vehicle-type-master/vehicle-type-master';
import { VehicleTypeMasterService } from '../vehicle-type-master/vehicle-type-master.service';
import { VehicleGet, VehicleRateMaster } from './vehicle-rate-master';
import { VehicleRateMasterService } from './vehicle-rate-master.service';

@Component({
  selector: 'app-vehicle-rate-master',
  templateUrl: './vehicle-rate-master.component.html',
  styleUrls: ['./vehicle-rate-master.component.scss']
})
export class VehicleRateMasterComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private vehicleRateMasterService: VehicleRateMasterService,
    // private notifier: NotificationService,
    private modalService: BsModalService,
    // public loaderService: LoaderService,
    public breakpointObserver: BreakpointObserver,
    private CityService: CityMasterService,
    private vehicleTypeMasterService: VehicleTypeMasterService,
  ) { }

  // variable declarations
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  ModalTitle: string;
  vehicleTypeMasterModel: VehicleRateMaster
  countryMasterForm: FormGroup
  formType: string
  //  UpdateCountryForm: FormGroup
  //  // dtInstance: DataTables.Api;
  isDtInitialized: boolean = false
  vehicleRateMaster: VehicleGet[] = [];
  CityMasterList : CityMasterList[]=[];
  vehicleTypeMaster: VehicleTypeMaster[] = [];
  //  bsModalRef: BsModalRef
  dtTrigger: Subject<any> = new Subject<any>();
  modalRef: BsModalRef;
  IsWait: boolean;
  @Input() disabled: boolean = true;
  loader = false;


  ngOnInit(): void {

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

    this.bindvehicleRateMaster(false);
    this.countryMasterForm = this.formBuilder.group({
      nVRId: [0],
      nVId: [0, [Validators.required]],
      nCityId: [0, [Validators.required]],
      nRatePerKM: [0, [Validators.required]],
      btActive: new FormControl({ value: 'true', disabled: true }),


    });

  }


  get createCountryMasterFormControls(): any {
    return this.countryMasterForm.controls;
  }
  countryMaster
  onSubmitCountryMasterForm(): void {
    if (this.formType == "Submit") {
      this.vehicleTypeMasterModel = {
        nVRId: this.countryMasterForm.controls.nVRId.value == null ? 0 : this.countryMasterForm.controls.nVRId.value,
        nVId: this.countryMasterForm.controls.nVId.value,
        nCityId: this.countryMasterForm.controls.nCityId.value,
        nRatePerKM: this.countryMasterForm.controls.nRatePerKM.value,

        btActive: this.countryMasterForm.controls.btActive.value
      };
      this.vehicleRateMasterService.VehicleRateMaster(this.vehicleTypeMasterModel, this.formType)
        .subscribe((status: string) => {
          if (status) {
            // this.notifier.showSuccess(status)
            this.countryMasterForm.reset();
            //  this. resetCountryMasterFormValue()
            this.modalRef.hide();
            setTimeout(() => {
              this.rerender();
            }, 100)
          } else {
          }
        }, (error: HttpErrorResponse) => {
          // this.notifier.showError(error.statusText)
        });
    };
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first

      dtInstance.destroy();
      this.bindvehicleRateMaster(true);
    });
  }
  bindvehicleRateMaster(isReInitilized) {
    this.loader = true;
    if (isReInitilized) {
      this.isDtInitialized = false;
    }
    this.vehicleRateMasterService.VehicleRateMaster_SelectAll(
    ).subscribe((res) => {
      this.vehicleRateMaster = res;

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
  getActiveCityList() {
    this.CityService.getActiveCityList(
    ).subscribe((res) => {
      this.CityMasterList = res;
  setTimeout(() => {
    this.loader = false
  }, 300)
    }, (error: HttpErrorResponse) => {
      alert(error.statusText);
    });
  }
  VehicleTypeMaster_SelectAll() {
   
    this.vehicleTypeMasterService.VehicleTypeMaster_SelectAll(
    ).subscribe((res) => {
      this.vehicleTypeMaster = res;

      setTimeout(() => {
        this.loader = false
      }, 300)


    }, (error: HttpErrorResponse) => {
      // this.notifier.showError(error.statusText);
    });
  }
  config: ModalOptions = {
    animated: true,
    backdrop: 'static',
    class: 'modal-dialog-centered modal-md',
  };
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
    this.ModalTitle = "Add Vehicle Rate";
    this.formType = "Submit"
    this.countryMasterForm.get('btActive')?.disable();
    this.countryMasterForm.get('btActive')?.setValue(true);
    this.getActiveCityList()
    this.VehicleTypeMaster_SelectAll()
    this.modalRef.onHide.subscribe(() => {
      this.countryMasterForm.reset();
    });
  }

  editClick(template: TemplateRef<any>, countryId: number) {
    this.modalRef = this.modalService.show(template, this.config);
    this.countryMasterForm.get('btActive')?.enable();
    this.ModalTitle = "Edit Vehicle Rate ";
    this.formType = "Update";
    this.getActiveCityList()
    this.VehicleTypeMaster_SelectAll()
    this.editCountryRowItem(countryId);
    this.modalRef.onHide.subscribe(() => {
      this.countryMasterForm.reset();
    });
  }
  editCountryRowItem(nVRId: number) {
    let country = this.vehicleRateMaster.find(e => e.nVRId == nVRId);
    this.countryMasterForm.get('nCityId')?.setValue(country?.nCityId);
    this.countryMasterForm.patchValue({
      nVRId: country?.nVId,
      nVId: country?.nVId,
      nCityId: country?.nCityId,
      nRatePerKM: country?.nRatePerKM,
      btActive: country?.btActive

    });
  }

  // resetCountryMasterFormValue() {
  //   this.countryMasterForm.patchValue({
  //     nCountryId: 0,
  //     vCountryName: null,
  //     btActive: true
  //   });
  // }
}
