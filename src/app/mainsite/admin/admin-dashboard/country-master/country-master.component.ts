import { BreakpointObserver } from '@angular/cdk/layout';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { CountryMaster } from '../../../models/counntry.model';
import { CountryService } from './country-services';

// import { NotificationService } from 'src/app/core/services/notification.service';
// import { LoaderService } from 'src/app/loader/loader.service';

@Component({
  selector: 'app-country-master',
  templateUrl: './country-master.component.html',
  styleUrls: ['./country-master.component.scss']
})
export class CountryMasterComponent implements OnInit {


  constructor(
    private formBuilder: FormBuilder,
    private countryService: CountryService,
    // // private notifier: NotificationService,
    private modalService: BsModalService,
    // public loaderService: LoaderService,
    public breakpointObserver: BreakpointObserver
  ) { }

  // variable declarations
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  ModalTitle: string;
  conutryModel: CountryMaster
  countryMasterForm: FormGroup
  formType: string
  //  UpdateCountryForm: FormGroup
  //  // dtInstance: DataTables.Api;
  isDtInitialized: boolean = false
  countryList: CountryMaster[] = [];
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

    this.bindCountryList(false);
    this.countryMasterForm = this.formBuilder.group({
      nCountryId: [0],
      vCountryName: [null, [Validators.required]],
      vCountryPrefix: [null, [Validators.required]],
      vCountryPSTNCode: [null, [Validators.required]],
      btActive: new FormControl({ value: 'true', disabled: true }),
    });

  }


  get createCountryMasterFormControls(): any {
    return this.countryMasterForm.controls;
  }
  countryMaster
  onSubmitCountryMasterForm(): void {
    if (this.formType == "Submit") {
      this.loader=true
      let country = this.countryList.find(e => e.vCountryName == this.countryMasterForm.controls.vCountryName.value);
      if (country) {
        // this.notifier.showError("Country is already added")
      } else {

        this.conutryModel = {
          nCountryId: this.countryMasterForm.controls.nCountryId.value == null ? 0 : this.countryMasterForm.controls.nCountryId.value,
          vCountryName: this.countryMasterForm.controls.vCountryName.value,
          vCountryPrefix: this.countryMasterForm.controls.vCountryPrefix.value,
          vCountryPSTNCode: this.countryMasterForm.controls.vCountryPSTNCode.value,
          btActive: this.countryMasterForm.controls.btActive.value
        };
        this.countryService.saveCountry(this.conutryModel, this.formType)
          .subscribe((status: string) => {
            if (status) {
              this.loader=false
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
            // // this.notifier.showError(error.statusText)
          });
      }
    }
    else {
      this.loader=true
      this.conutryModel = {
        nCountryId: this.countryMasterForm.controls.nCountryId.value == null ? 0 : this.countryMasterForm.controls.nCountryId.value,
        vCountryName: this.countryMasterForm.controls.vCountryName.value,
        vCountryPrefix: this.countryMasterForm.controls.vCountryPrefix.value,
        vCountryPSTNCode: this.countryMasterForm.controls.vCountryPSTNCode.value,
        btActive: this.countryMasterForm.controls.btActive.value
      };
      this.countryService.saveCountry(this.conutryModel, this.formType)
        .subscribe((status: string) => {
          if (status) {
            this.loader=false
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
          // // this.notifier.showError(error.statusText)
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
    this.countryService.getCountryList(
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
    class: 'modal-dialog-centered modal-lg',
  };
  openModal(template: TemplateRef<any>) {

    this.modalRef = this.modalService.show(template, this.config);

    this.ModalTitle = "Add Country";
    this.formType = "Submit"
    this.countryMasterForm.get('btActive')?.disable();
    this.countryMasterForm.get('btActive')?.setValue(true);
    // this.modalRef.onHide.subscribe(() => {
    //   this.countryMasterForm.reset();
    // });
  }

  editClick(template: TemplateRef<any>, countryId: number) {
    this.modalRef = this.modalService.show(template, {
      animated: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-lg',
    });
    this.countryMasterForm.get('btActive')?.enable();
    this.ModalTitle = "Edit Country ";
    this.formType = "Update";
    this.editCountryRowItem(countryId);
    // this.modalRef.onHide.subscribe(() => {
    //   this.countryMasterForm.reset();
    // });
  }
  editCountryRowItem(countryId: number) {
    let country = this.countryList.find(e => e.nCountryId == countryId);
    this.countryMasterForm.patchValue({
      nCountryId: country?.nCountryId,
      vCountryName: country?.vCountryName,
      vCountryPrefix: country?.vCountryPrefix,
      vCountryPSTNCode: country?.vCountryPSTNCode,
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
}
