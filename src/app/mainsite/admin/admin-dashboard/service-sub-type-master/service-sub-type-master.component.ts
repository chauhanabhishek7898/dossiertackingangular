import { BreakpointObserver } from '@angular/cdk/layout';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { CityMasterList } from 'src/app/mainsite/models/city-master';
import { CityMasterService } from '../city-master/city-master.service';
import { ServiceTypeMaster } from '../service-type-master/service-type-master';
import { ServiceTypeMasterService } from '../service-type-master/service-type-master.service';


import { VehicleTypeMaster } from '../vehicle-type-master/vehicle-type-master';
import { VehicleTypeMasterService } from '../vehicle-type-master/vehicle-type-master.service';
import { ServiceSubTypeGet, ServiceSubTypeMaster } from './service-sub-type-master';
import { ServiceSubTypeMasterService } from './service-sub-type-master.service';

@Component({
  selector: 'app-service-sub-type-master',
  templateUrl: './service-sub-type-master.component.html',
  styleUrls: ['./service-sub-type-master.component.scss']
})
export class ServiceSubTypeMasterComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private serviceSubTypeMasterService: ServiceSubTypeMasterService,
    // private notifier: NotificationService,
    private modalService: BsModalService,
    // public loaderService: LoaderService,
    public breakpointObserver: BreakpointObserver,
    private CityService: CityMasterService,
    private vehicleTypeMasterService: VehicleTypeMasterService,
    private serviceTypeMasterService: ServiceTypeMasterService,
  ) { }

  // variable declarations
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  ModalTitle: string;
  vehicleTypeMasterModel: ServiceSubTypeMaster
  countryMasterForm: FormGroup
  formType: string
  //  UpdateCountryForm: FormGroup
  //  // dtInstance: DataTables.Api;
  isDtInitialized: boolean = false
  serviceSubTypeMaster: ServiceSubTypeGet[] = [];
  CityMasterList: CityMasterList[] = [];
  vehicleTypeMaster: VehicleTypeMaster[] = [];
  countryList: ServiceTypeMaster[] = [];
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

    this.bindserviceSubTypeMaster(false);
    this.countryMasterForm = this.formBuilder.group({
      nSSTId: [0],
      nVId: [0, [Validators.required]],
      nCityId: [0, [Validators.required]],
      nSTId: [0, [Validators.required]],
      nFromKM: [0, [Validators.required]],
      nToKM: [0, [Validators.required]],
      vServiceSubType: [null, [Validators.required]],
      nRate: [0, [Validators.required]],
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
        nSSTId: 0,
        nVId: this.countryMasterForm.controls.nVId.value,
        nCityId: this.countryMasterForm.controls.nCityId.value,
        nRate: this.countryMasterForm.controls.nRate.value,
        vServiceSubType: this.countryMasterForm.controls.vServiceSubType.value,
        nToKM: this.countryMasterForm.controls.nToKM.value,
        nFromKM: this.countryMasterForm.controls.nFromKM.value,
        nSTId: this.countryMasterForm.controls.nSTId.value,

        btActive: this.countryMasterForm.controls.btActive.value
      };
      this.serviceSubTypeMasterService.ServiceSubTypeMaster(this.vehicleTypeMasterModel, this.formType)
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
      this.bindserviceSubTypeMaster(true);
    });
  }
  bindserviceSubTypeMaster(isReInitilized) {
    this.loader = true;
    if (isReInitilized) {
      this.isDtInitialized = false;
    }
    this.serviceSubTypeMasterService.ServiceSubTypeMaster_SelectAll(
    ).subscribe((res) => {
      this.serviceSubTypeMaster = res;

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
  bindCountryList() {
   
    this.serviceTypeMasterService.ServiceTypeMaster_SelectAll(
    ).subscribe((res) => {
      this.countryList = res;
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
    class: 'modal-dialog-centered modal-lg',
  };
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
    this.ModalTitle = "Add Service Sub Type";
    this.formType = "Submit"
    this.countryMasterForm.get('btActive')?.disable();
    this.countryMasterForm.get('btActive')?.setValue(true);
    this.getActiveCityList()
    this.bindCountryList()
    this.VehicleTypeMaster_SelectAll()
    this.modalRef.onHide.subscribe(() => {
      this.countryMasterForm.reset();
    });
  }

  editClick(template: TemplateRef<any>, countryId: number) {
    this.modalRef = this.modalService.show(template, this.config);
    this.countryMasterForm.get('btActive')?.enable();
    this.ModalTitle = "Edit Service Sub Type ";
    this.formType = "Update";
    this.getActiveCityList()
    this.bindCountryList()
    this.VehicleTypeMaster_SelectAll()
    this.editCountryRowItem(countryId);
    this.modalRef.onHide.subscribe(() => {
      this.countryMasterForm.reset();
    });
  }
  editCountryRowItem(nSSTId: number) {
    let country = this.serviceSubTypeMaster.find(e => e.nSSTId == nSSTId);
    this.countryMasterForm.get('nCityId')?.setValue(country?.nCityId);
    this.countryMasterForm.patchValue({
      nSSTId: country?.nSSTId,
      nVId: country?.nVId,
      nCityId: country?.nCityId,
      nRate:country?.nRate,
      vServiceSubType:country?.vServiceSubType,
      nToKM:country?.nToKM,
      nFromKM:country?.nFromKM,
      nSTId:country?.nSTId,
      btActive: country?.btActive

    });
  }


}
