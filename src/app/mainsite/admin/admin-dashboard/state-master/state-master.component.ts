
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
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
// import { NotificationService } from 'src/app/core/service/notification.service';
import { CountryMaster } from '../../../models/counntry.model';
import { StateMaster, stateMasterList } from '../../../models/state.model';
import { CountryService } from '../country-master/country-services';


import { StateService } from './state.service';
// import { NotificationService } from 'src/app/core/services/notification.service';
// import { LoaderService } from 'src/app/loader/loader.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-state-master',
  templateUrl: './state-master.component.html',
  styleUrls: ['./state-master.component.scss'],
})
export class StateMasterComponent implements OnInit {
  ModalTitle: string;
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'determinate';
  constructor(
    private formBuilder: UntypedFormBuilder,
    private stateService: StateService,
    private countryService: CountryService,
    // private notifier: NotificationService,
    // public loaderService: LoaderService,
    private route: ActivatedRoute,
    private modalService: BsModalService
  ) {}

  // variable declarations
  selectedCountry = null;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  stateModel: StateMaster;
  stateMasterForm: UntypedFormGroup;
  // UpdateStateForm: FormGroup
  // dtInstance: DataTables.Api;
  isDtInitialized: boolean = false;
  alert = false;
  StateList: StateMaster[] = [];
  countryMaster: CountryMaster[] = [];
  StateMasterList: stateMasterList[] = [];
  formType: string;
  dtTrigger: Subject<any> = new Subject<any>();
  modalRef: BsModalRef;
  loader = false;
  @Input() disabled: boolean = true;
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
        { extend: 'excel', text: 'Export To Excel', filename: 'State master' },
      ],
      columnDefs: [
        {
          orderable: false,
          targets: 'no-sort',
        },
      ],
    };

    this.bindAllCountryList();
    this.bindstateMasterList(false);
    this.stateMasterForm = this.formBuilder.group({
      nStateId: [0],
      nCountryId: [0, [Validators.required, Validators.min(1)]],
      vStateName: [null, [Validators.required]],
      vStatePrefix: [null, [Validators.required]],
      btActive: new UntypedFormControl({ value: 'true', disabled: this.disabled }),
    });
  }
  get createStateMasterFormControls(): any {
    return this.stateMasterForm.controls;
  }
  onSubmitStateMasterForm(): void {
    if (this.formType == 'Submit') {
      this.loader=true
      let state = this.StateMasterList.find(
        (e) => e.vStateName == this.stateMasterForm.controls.vStateName.value
      );
      if (state) {
        // this.notifier.showError("State is already added")
      } else {
        this.stateModel = {
          nCountryId: this.stateMasterForm.controls.nCountryId.value,
          // vCountryName: this.stateMasterForm.controls.vCountryName.value,
          nStateId:
            this.stateMasterForm.controls.nStateId.value == null
              ? 0
              : this.stateMasterForm.controls.nStateId.value,
          vStateName: this.stateMasterForm.controls.vStateName.value,
          btActive: this.stateMasterForm.controls.btActive.value,
          vStatePrefix: this.stateMasterForm.controls.vStatePrefix.value,
        };
        this.stateService.saveState(this.stateModel, this.formType).subscribe(
          (status: string) => {
            if (status) {
              this.loader=false
              this.showSuccessMessage(status, 'success', true);
              this.stateMasterForm.reset();
              this.modalRef.hide();
              this.rerender();
            } else {
            }
          },
          (error: HttpErrorResponse) => {
            this.showWarningMessage(error.statusText, 'error', true);
          }
        );
      }
    } else {
      this.loader=true
      this.stateModel = {
        nCountryId: this.stateMasterForm.controls.nCountryId.value,
        // vCountryName: this.stateMasterForm.controls.vCountryName.value,
        nStateId:
          this.stateMasterForm.controls.nStateId.value == null
            ? 0
            : this.stateMasterForm.controls.nStateId.value,
        vStateName: this.stateMasterForm.controls.vStateName.value,
        btActive: this.stateMasterForm.controls.btActive.value,
        vStatePrefix: this.stateMasterForm.controls.vStatePrefix.value,
      };
      this.stateService.saveState(this.stateModel, this.formType).subscribe(
        (status: string) => {
          if (status) {
            this.loader=false
            this.showSuccessMessage(status, 'success', true);
            this.stateMasterForm.reset();
            this.modalRef.hide();
            this.rerender();
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
      this.bindstateMasterList(true);

      // Call the dtTrigger to rerender again
      // setTimeout(() => {
      //   this.dtTrigger.next();
      // }, 500);
    });
  }
  bindstateMasterList(isReInitilized) {
    this.loader = true;
    if (isReInitilized) {
      this.isDtInitialized = false;
    }
    this.stateService.getStateList().subscribe(
      (res) => {
        this.StateMasterList = res;
        console.log('res', res);
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

  bindAllCountryList() {
    this.countryService.getCountryList().subscribe(
      (res) => {
        this.countryMaster = res;

        // this.loaderService.isLoading.next(false);
      },
      (error: HttpErrorResponse) => {
        // // this.notifier.showError(error.statusText);
        //// this.notifier.showError(error.statusText);
      }
    );
  }

  config: ModalOptions = {
    animated: true,
    backdrop: 'static',
    class: 'modal-dialog-centered modal-lg',
  };
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);

    this.ModalTitle = 'Add State';
    this.formType = 'Submit';
    this.stateMasterForm.get('btActive')?.setValue(true);
    this.stateMasterForm.get('btActive')?.disable();
    // this.modalRef.onHide.subscribe(() => {
    //    this.stateMasterForm.reset();;
    // });
  }

  editClick(template: TemplateRef<any>, stateId: number) {
    this.modalRef = this.modalService.show(template, {
      animated: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-lg',
    });
    this.stateMasterForm.get('btActive')?.enable();
    this.ModalTitle = 'Edit State ';
    this.formType = 'Update';
    this.editStateRowItem(stateId);
    // this.modalRef.onHide.subscribe(() => {
    //    this.stateMasterForm.reset();;
    // });
  }
  editStateRowItem(stateId: number) {
    // let country = this.StateList.find(e => e.nCountryId == countryId);
    let state = this.StateMasterList.find((e) => e.nStateId == stateId);
    this.stateMasterForm.patchValue({
      nCountryId: state?.nCountryId,
      nStateId: state?.nStateId,
      vStateName: state?.vStateName,
      vStatePrefix: state?.vStatePrefix,
      btActive: state?.btActive,
    });
  }
  resetStateMasterFormValue() {
    this.stateMasterForm.patchValue({
      nCountryId: 0,
      nStateId: 0,
      vStateName: null,
      btActive: true,
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
