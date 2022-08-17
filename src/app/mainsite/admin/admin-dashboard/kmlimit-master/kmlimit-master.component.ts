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
import { CityMasterList } from 'src/app/mainsite/models/city-master';
import { CityMasterService } from '../city-master/city-master.service';
import { VehicleTypeMaster } from '../vehicle-type-master/vehicle-type-master';
import { VehicleTypeMasterService } from '../vehicle-type-master/vehicle-type-master.service';
import { KMLimitGet, KMLimitMaster } from './kmlimit-master';
import { KMLimitMasterService } from './kmlimit-master.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-kmlimit-master',
  templateUrl: './kmlimit-master.component.html',
  styleUrls: ['./kmlimit-master.component.scss'],
})
export class KMLimitMasterComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private kmLimitMasterService: KMLimitMasterService,
    // // private notifier: NotificationService,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    // public loaderService: LoaderService,
    public breakpointObserver: BreakpointObserver,
    private CityService: CityMasterService,
    private vehicleTypeMasterService: VehicleTypeMasterService
  ) {}

  // variable declarations
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  ModalTitle: string;
  kmLimitMasterModel: KMLimitMaster;
  countryMasterForm: FormGroup;
  formType: string;
  //  UpdateCountryForm: FormGroup
  //  // dtInstance: DataTables.Api;
  isDtInitialized: boolean = false;
  kmLimitMaster: KMLimitGet[] = [];
  CityMasterList: CityMasterList[] = [];
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
    this.getActiveCityList();
    this.bindkmLimitMaster(false);
    this.countryMasterForm = this.formBuilder.group({
      nLimitId: [0],
      nVId: [0],
      nCityId: [0, [Validators.required]],
      nKMLimit: [0, [Validators.required]],
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
      this.kmLimitMasterModel = {
        nLimitId:
          this.countryMasterForm.controls.nLimitId.value == null
            ? 0
            : this.countryMasterForm.controls.nLimitId.value,
        nVId: this.countryMasterForm.controls.nVId.value,
        nCityId: this.countryMasterForm.controls.nCityId.value,
        nKMLimit: this.countryMasterForm.controls.nKMLimit.value,

        btActive: this.countryMasterForm.controls.btActive.value,
      };
      this.kmLimitMasterService
        .KMLimitMaster(this.kmLimitMasterModel, this.formType)
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
      this.kmLimitMasterModel = {
        nLimitId:
          this.countryMasterForm.controls.nLimitId.value == null
            ? 0
            : this.countryMasterForm.controls.nLimitId.value,
        nVId: this.countryMasterForm.controls.nVId.value,
        nCityId: this.countryMasterForm.controls.nCityId.value,
        nKMLimit: this.countryMasterForm.controls.nKMLimit.value,

        btActive: this.countryMasterForm.controls.btActive.value,
      };
      this.kmLimitMasterService
        .KMLimitMaster(this.kmLimitMasterModel, this.formType)
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
      this.bindkmLimitMaster(true);
    });
  }
  bindkmLimitMaster(isReInitilized) {
    this.loader = true;
    if (isReInitilized) {
      this.isDtInitialized = false;
    }
    this.kmLimitMasterService.KMLimitMaster_SelectAll().subscribe(
      (res) => {
        this.kmLimitMaster = res;

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
  getActiveCityList() {
    this.CityService.getActiveCityList().subscribe(
      (res) => {
        console.log("rescity", res)
        this.CityMasterList = res;
       
        setTimeout(() => {
          this.loader = false;
        }, 300);
      },
      (error: HttpErrorResponse) => {
        alert(error.statusText);
      }
    );
  }
  VehicleTypeMaster_SelectAll() {
    this.vehicleTypeMasterService.VehicleTypeMaster_SelectAll().subscribe(
      (res) => {
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
    this.ModalTitle = 'Add KM Limit';
    this.formType = 'Submit';
    this.countryMasterForm.get('btActive')?.disable();
    this.countryMasterForm.get('btActive')?.setValue(true);
    this.countryMasterForm.get('nCityId')?.setValue(null);

    // this.getActiveCityList();
    this.VehicleTypeMaster_SelectAll();
    this.modalRef.onHide.subscribe(() => {
      this.countryMasterForm.reset();
    });
  }

  editClick(template: TemplateRef<any>, countryId: number) {
    this.modalRef = this.modalService.show(template, this.config);
    this.countryMasterForm.get('btActive')?.enable();
    this.ModalTitle = 'Edit KM Limit ';
    this.formType = 'Update';
    // this.getActiveCityList();
    this.VehicleTypeMaster_SelectAll();
    this.editCountryRowItem(countryId);
    this.modalRef.onHide.subscribe(() => {
      this.countryMasterForm.reset();
    });
  }
  editCountryRowItem(nLimitId: number) {
    let country = this.kmLimitMaster.find((e) => e.nLimitId == nLimitId);
    this.countryMasterForm.patchValue({
      nLimitId: country?.nLimitId,
      nVId: country?.nVId,
      nCityId: country?.nCityId,
      nKMLimit: country?.nKMLimit,
      btActive: country?.btActive,
    });
  }showSuccessMessage(message, icon, showCancelButton = true) {
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
