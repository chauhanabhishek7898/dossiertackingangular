import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
// import { NotificationService } from 'src/app/core/services/notification.service';
import { OrgMobnoAndEmailid } from '../../../models/org-mobno-and-emailid';
import { OrgMobnoAndEmailIdService } from './org-mobno-and-email-id.service';

@Component({
  selector: 'app-org-mobno-and-email-id',
  templateUrl: './org-mobno-and-email-id.component.html',
  styleUrls: ['./org-mobno-and-email-id.component.scss']
})
export class OrgMobnoAndEmailIdComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private orgMobnoAndEmailIdService: OrgMobnoAndEmailIdService,
    // private notifier: NotificationService,
    private modalService: BsModalService,
  ) {
    //super(toastrService)
  }

  // variable declarations
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  ModalTitle: string;
  orgMobnoAndEmailidModel: OrgMobnoAndEmailid
  orgMobNoAndEmailIdForm: FormGroup
  formType: string
  //  UpdateCountryForm: FormGroup
  //  // dtInstance: DataTables.Api;
  isDtInitialized: boolean = false
  //  alert = false;
  OrgMobnoAndEmailidList: OrgMobnoAndEmailid[] = [];
  //  bsModalRef: BsModalRef
  dtTrigger: Subject<any> = new Subject<any>();
  modalRef: BsModalRef;
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
        { extend: 'excel', text: 'Export To Excel', filename: "Organization Mobile No. And Email Id" }
      ],
      columnDefs: [{
        orderable: false,
        targets: "no-sort"
      }]
    }
    this.bindOrgShowLimitList(false);
    this.orgMobNoAndEmailIdForm = this.formBuilder.group({
      nID: [0],
      vMobileNoCompany: [null, [Validators.required]],
      vEmailIdCompany: [null, [Validators.required]],

    });
  }
  get createOrgMobNoAndEmailIdFormControls(): any {
    return this.orgMobNoAndEmailIdForm.controls;
  }

  chiefComplaintFind
  onSubmitorgMobNoAndEmailIdForm(): void {    
    this.loader=true
        this.orgMobnoAndEmailidModel = {
          nID: this.orgMobNoAndEmailIdForm.controls.nID.value == null ? 0 : this.orgMobNoAndEmailIdForm.controls.nID.value,
          vMobileNoOrg: this.orgMobNoAndEmailIdForm.controls.vMobileNoCompany.value,
          vEmailIdOrg: this.orgMobNoAndEmailIdForm.controls.vEmailIdCompany.value,
        };
        this.orgMobnoAndEmailIdService.updateOrgMobileNoAndEmailId(this.orgMobnoAndEmailidModel, this.formType)
          .subscribe((status: string) => {
            if (status) {
              this.loader=false
              // this.notifier.showSuccess(status)
              this.orgMobNoAndEmailIdForm.reset();
              this.modalRef.hide();
              this.rerender();
            } else {
              this.loader=false
            }
          }, (error: HttpErrorResponse) => {
            // this.notifier.showError(error.statusText)
          });
  };
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      this.bindOrgShowLimitList(true);
      // Call the dtTrigger to rerender again
      // setTimeout(() => {
      //   this.dtTrigger.next();
      //   this.modalRef.hide();
      // }, 500);
    });
  }
  nSeniorAge
  addButton: boolean= true;
  bindOrgShowLimitList(isReInitilized) {
    this.loader = true;
    if (isReInitilized) {
      this.isDtInitialized = false;
    }
    this.orgMobnoAndEmailIdService.getOrgMobileNoAndEmailId(
    ).subscribe((res) => {
      this.OrgMobnoAndEmailidList = res;
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

  config: ModalOptions = {
    animated: true,
    backdrop: 'static',
    class: 'modal-dialog-centered modal-md',
  };
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
    this.ModalTitle = "Add Organization Mobile No. and EmailId";
    this.formType = "Submit"
    // this.modalRef.onHide.subscribe(() => {
    // this.orgMobNoAndEmailIdForm.reset();
    // });
  }

  editClick(template: TemplateRef<any>, orgId: number) {
    this.modalRef = this.modalService.show(template, {
      animated: true,
      backdrop: 'static',
      class: 'modal-dialog-centered modal-md',
    });
    this.ModalTitle = "Edit Organization Mobile No. and EmailId";
    this.formType = "Update";
    this.editOrgRowItem(orgId);
    // this.modalRef.onHide.subscribe(() => {
    //   this.orgMobNoAndEmailIdForm.reset();
    // });
  }
  editOrgRowItem(orgId: number) {
    let org = this.OrgMobnoAndEmailidList.find(e => e.nID == orgId);
    this.orgMobNoAndEmailIdForm.patchValue({
      nID: org?.nID,
      vMobileNoCompany: org?.vMobileNoOrg,
      vEmailIdCompany: org?.vEmailIdOrg,
    });
    }

}
