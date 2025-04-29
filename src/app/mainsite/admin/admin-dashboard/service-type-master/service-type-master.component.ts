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
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  UntypedFormControl,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { ServiceTypeMaster } from './service-type-master';
import { ServiceTypeMasterService } from './service-type-master.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-service-type-master',
  templateUrl: './service-type-master.component.html',
  styleUrls: ['./service-type-master.component.scss'],
})
export class ServiceTypeMasterComponent implements OnInit {
  constructor(
    private formBuilder: UntypedFormBuilder,
    private serviceTypeMasterService: ServiceTypeMasterService,
    // // private notifier: NotificationService,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    // public loaderService: LoaderService,
    public breakpointObserver: BreakpointObserver
  ) {}

  // variable declarations
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  ModalTitle: string;
  ServiceTypeMaster: ServiceTypeMaster;
  countryMasterForm: UntypedFormGroup;
  formType: string;
  //  UpdateCountryForm: FormGroup
  //  // dtInstance: DataTables.Api;
  isDtInitialized: boolean = false;
  countryList: ServiceTypeMaster[] = [];
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

    this.bindCountryList(false);
    this.countryMasterForm = this.formBuilder.group({
      nSTId: [0],
      vServiceType: [null, [Validators.required]],

      btActive: new UntypedFormControl({ value: 'true', disabled: true }),
    });
  }

  get createCountryMasterFormControls(): any {
    return this.countryMasterForm.controls;
  }
  countryMaster;
  onSubmitCountryMasterForm(): void {
    if (this.formType == 'Submit') {
      let country = this.countryList.find(
        (e) =>
          e.vServiceType == this.countryMasterForm.controls.vServiceType.value
      );
      if (country) {
        // this.notifier.showError("Country is already added")
      } else {
        this.loader = true;
        this.ServiceTypeMaster = {
          nSTId: 0,
          vServiceType: this.countryMasterForm.controls.vServiceType.value,

          btActive: this.countryMasterForm.controls.btActive.value,
        };
        this.serviceTypeMasterService
          .ServiceTypeMaster(this.ServiceTypeMaster, this.formType)
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
    } else {
      this.loader = true;
      this.ServiceTypeMaster = {
        nSTId: this.countryMasterForm.controls.nSTId.value== null ? 0 : this.countryMasterForm.controls.nSTId.value,
        vServiceType: this.countryMasterForm.controls.vServiceType.value,

        btActive: this.countryMasterForm.controls.btActive.value,
      };
      this.serviceTypeMasterService
        .ServiceTypeMaster(this.ServiceTypeMaster, this.formType)
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
      this.bindCountryList(true);
    });
  }
  bindCountryList(isReInitilized) {
    this.loader = true;
    if (isReInitilized) {
      this.isDtInitialized = false;
    }
    this.serviceTypeMasterService.ServiceTypeMaster_SelectAll().subscribe(
      (res) => {
        this.countryList = res;

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
  config: ModalOptions = {
    animated: true,
    backdrop: 'static',
    class: 'modal-dialog-centered modal-md',
  };
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
    this.ModalTitle = 'Add Service Type';
    this.formType = 'Submit';
    this.countryMasterForm.get('btActive')?.disable();
    this.countryMasterForm.get('btActive')?.setValue(true);
    this.modalRef.onHide.subscribe(() => {
      this.countryMasterForm.reset();
    });
  }

  editClick(template: TemplateRef<any>, countryId: number) {
    this.modalRef = this.modalService.show(template, this.config);
    this.countryMasterForm.get('btActive')?.enable();
    this.ModalTitle = 'Edit Service Type ';
    this.formType = 'Update';
    this.editCountryRowItem(countryId);
    this.modalRef.onHide.subscribe(() => {
      this.countryMasterForm.reset();
    });
  }
  editCountryRowItem(nSTId: number) {
    let country = this.countryList.find((e) => e.nSTId == nSTId);
    this.countryMasterForm.patchValue({
      nSTId: country?.nSTId,
      vServiceType: country?.vServiceType,
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
