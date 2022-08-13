import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { StateMaster } from 'src/app/mainsite/models/state.model';
import { CityMaster, CityMasterList } from '../../../models/city-master';
import { CityMasterService } from './city-master.service';
import { StateService } from '../state-master/state.service';


// import { NotificationService } from 'src/app/core/services/notification.service';
// import { LoaderService } from 'src/app/loader/loader.service';

@Component({
  selector: 'app-city-master',
  templateUrl: './city-master.component.html',
  styleUrls: ['./city-master.component.scss']
})
export class CityMasterComponent implements OnInit {

  loader = false;

  constructor(
    private formBuilder: FormBuilder,
    private CityService: CityMasterService,
    // private notifier: NotificationService,
    private stateService: StateService,
    private modalService: BsModalService,
    // public loaderService: LoaderService
  ) { }


  // variable declarations
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  cityModel: CityMaster
  CityMasterForm: FormGroup
  // UpdateCityForm: FormGroup
  // dtInstance: DataTables.Api;
  isDtInitialized: boolean = false
  alert = false;
  StateList: StateMaster[] = [];
  activeStateList: StateMaster[] = [];
  cityList: CityMaster[] = [];
  CityMasterList : CityMasterList[]=[];
  bsModalRef: BsModalRef
  dtTrigger: Subject<any> = new Subject<any>();
  ModalTitle: string;
  formType: string;
  selectState = null;
  @Input() disabled:boolean = true;
  ngOnInit(): void {

    this.dtOptions = {
      //destroy: true,
      dom: 'lBfrtip',
      "lengthMenu": [5, 10, 25, 50, 100],
      "pageLength": 5,
      "scrollX": true,
      // Configure the buttons
      buttons: [
        { extend: 'excel', text: 'Export To Excel', filename: "City master" }
      ],
      columnDefs: [{
        orderable: false,
        targets: "no-sort"
      }]
    }


    this.bindStateList();
    this.bindActiveStateList();
    this.bindcityList(false);
    this.CityMasterForm = this.formBuilder.group({
      nStateId: [0 ,[Validators.required, Validators.min(1)]],
      nCityId: [0],
      vCityName: [null, [Validators.required]],
      btActive: new FormControl({ value: 'true', disabled: this.disabled }),
    });
  }

  get createCityMasterFormControls(): any {
    return this.CityMasterForm.controls;
  }
  cityNameFind
  onSubmitCityMasterForm(): void {
    if(this.formType == 'Submit'){
      let city = this.CityMasterList.find(e => e.vCityName == this.CityMasterForm.controls.vCityName.value
                                               && e.nStateId == this.CityMasterForm.controls.nStateId.value);
      if(city){
        alert("City is already added")
      }else{
        this.cityModel = {
          nStateId: this.CityMasterForm.controls.nStateId.value,
          nCityId: this.CityMasterForm.controls.nCityId.value==null?0:this.CityMasterForm.controls.nCityId.value,
          vCityName: this.CityMasterForm.controls.vCityName.value,
          btActive: this.CityMasterForm.controls.btActive.value
        };
        this.CityService.saveCity(this.cityModel , this.formType)
          .subscribe((status: string) => {
            if (status) {
              // this.notifier.showSuccess(status);
               this.CityMasterForm.reset();
              this.modalRef.hide();
              this.rerender();
            } else {
            }
          }, (error: HttpErrorResponse) => {
            alert(error.statusText)
          });
      }
    }else{
      this.cityModel = {
        nStateId: this.CityMasterForm.controls.nStateId.value,
        nCityId: this.CityMasterForm.controls.nCityId.value==null?0:this.CityMasterForm.controls.nCityId.value,
        vCityName: this.CityMasterForm.controls.vCityName.value,
        btActive: this.CityMasterForm.controls.btActive.value
      };
      this.CityService.saveCity(this.cityModel , this.formType)
        .subscribe((status: string) => {
          if (status) {
           alert(status);
             this.CityMasterForm.reset();
            this.modalRef.hide();
            this.rerender();
          } else {
          }
        }, (error: HttpErrorResponse) => {
          alert(error.statusText)
        });
    }
  };
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      this.bindcityList(true);
      // Call the dtTrigger to rerender again
      // this.dtTrigger.next();
    });
  }
  bindStateList() {
    this.stateService.getStateList(
    ).subscribe((res) => {
      this.StateList = res;
   
    }, (error: HttpErrorResponse) => {
      alert(error.statusText);
    });
  }
  bindActiveStateList() {
   
    this.stateService.getActiveStateList(
    ).subscribe((res) => {
      this.activeStateList = res;

    }, (error: HttpErrorResponse) => {
      alert(error.statusText);
    });
  }
  bindcityList(isReInitilized) {
    this.loader = true;
    if (isReInitilized) {
      this.isDtInitialized = false;
    }
    this.CityService.getCityList(
    ).subscribe((res) => {
      this.CityMasterList = res;
      if (!this.isDtInitialized) {
        this.dtTrigger.next();
      }
      this.isDtInitialized = true;
  setTimeout(() => {
    this.loader = false
  }, 300)
    }, (error: HttpErrorResponse) => {
      alert(error.statusText);
    });
  }

  

  modalRef: BsModalRef;

  config: ModalOptions = {
    animated: true,
    backdrop: 'static',
    class: 'modal-dialog-centered modal-lg',
  };
  openModal(template: TemplateRef<any>) {

    this.modalRef = this.modalService.show(template, this.config);

    this.ModalTitle = "Add City";
    this.formType = "Submit"
    this.CityMasterForm.get('btActive')?.setValue(true);
    this.CityMasterForm.get('btActive')?.disable();
    // this.modalRef.onHide.subscribe(() => {
    //    this.CityMasterForm.reset();
    // });
  }

  editClick(template: TemplateRef<any>, cityId:number) {
    this.modalRef = this.modalService.show(template, {
      animated: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-lg',
    });
    this.CityMasterForm.get('btActive')?.enable();
    this.ModalTitle = "Edit City ";
    this.formType = "Update";
    this.editCityRowItem(cityId);
    // this.modalRef.onHide.subscribe(() => {
    //    this.CityMasterForm.reset();
    // });
  }
  editCityRowItem(cityId : number) {
    let city = this.CityMasterList.find(e => e.nCityId == cityId);
    this.CityMasterForm.patchValue({
      nStateId: city?.nStateId,
      nCityId: city?.nCityId,
      vCityName: city?.vCityName,
      btActive: city?.btActive
    });
  }

  resetCityMasterFormValue(){
    this.CityMasterForm.patchValue({
      nStateId:0,
      nCityId: 0,
      vCityName:null,
      btActive: true
    });
  }
}
