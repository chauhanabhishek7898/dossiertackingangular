import { UtilityService } from 'src/app/core/services/utility.service';
import { DriverMaster } from './../../../models/DriverMaster';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { DataTableDirective } from 'angular-datatables';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { NotificationService } from 'src/app/core/service/notification.service';
import { environment } from 'src/environments/environment';
import { DriverDetailsAdminService } from './driver-details-admin.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-driver-details-admin',
  templateUrl: './driver-details-admin.component.html',
  styleUrls: ['./driver-details-admin.component.scss']
})
export class DriverDetailsAdminComponent implements OnInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  ModalTitle: string;
  conutryModel: DriverMaster
  countryMasterForm: FormGroup
  formType: string
  imageUrl: string

  isDtInitialized: boolean = false
  doctorDetailList: DriverMaster[] = [];
  dtTrigger: Subject<any> = new Subject<any>();
  modalRef: BsModalRef;
  conformaitonmodalRef: BsModalRef;
  IsWait: boolean;
  loader = false;
  @Input() disabled: boolean = true;
  myNoteForm: FormGroup
  pageTitle: any;
  constructor(
    private doctorDetailService: DriverDetailsAdminService,
    private notifier: NotificationService,
    private modalService: BsModalService,
    // private viewUpdateProfileService: ViewUpdateProfileService,
    private sanitizer: DomSanitizer,
    private utilityService: UtilityService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.pageTitle = this.route.snapshot.queryParams.title;
    this.imageUrl = environment.dossiarApiUrl;
    this.dtOptions = {
      //destroy: true,
      dom: 'lBfrtip',
      "lengthMenu": [5, 10, 25, 50, 100],
      "pageLength": 10,
      "scrollX": true,

      // Configure the buttons
      buttons: [
        { extend: 'excel', text: 'Export To Excel', filename: "Doctor Detail MIS" }
      ],
      columnDefs: [{
        orderable: false,
        targets: "no-sort"
      }]
    }
    this.myNoteForm = this.formBuilder.group({
      fromDate: [null],
      toDate: [null],
      txtSearch: [null],
      nPatientUserId:[null],
    })
    this.bindDoctorDetailService(false);
  }
  parseDateToString(d: any) {
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }
  searchPastConsultation() {
    //this.myNoteForm.get('toDate')?.setValue(this.currentDate);
    let toDate = this.myNoteForm.controls.toDate.value;
    let fromDate = this.myNoteForm.controls.fromDate.value;
    if (fromDate > toDate) {
      this.notifier.showError("From Date should not be greater than To Date. ")
      return;
    } else {
      this.currentDateFilter = toDate
      this.pastDate = fromDate
      this.rerender();
    }
  
  }
  
    // rerender(): void {
    //   this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //     dtInstance.destroy();
    //     this.bindCreditsUsageReportList(true);
    //   });
    // }
    currentDateFilter: any
    pastDate: any;
    maxDateFilter: any
    PatientUserId= null;
    getCurrentDateFilter() {
      this.utilityService.getCurrentDate().subscribe((res) => {
        this.currentDateFilter = new Date(res[0].CurrDate);
        this.maxDateFilter = new Date(res[0].CurrDate);
    
        this.myNoteForm.get('toDate')?.setValue(this.currentDateFilter);
        let pDate = new Date(this.currentDateFilter);
        pDate.setDate(pDate.getDate() - 365);
        this.pastDate = pDate;
        this.myNoteForm.get('fromDate')?.setValue(this.pastDate);
        this.bindCreditsUsageReportList(false);
    
      }, (error: HttpErrorResponse) => {
        this.notifier.showError(error.statusText);
      });
    }
    bindCreditsUsageReportList(isReInitilized) {
      this.loader = true;
      if (isReInitilized) {
        this.isDtInitialized = false;
      }
      if (this.pastDate._d) {
        this.pastDate = this.pastDate._d
      }
      if (this.currentDateFilter._d) {
        this.currentDateFilter = this.currentDateFilter._d
      }
    
    
      let fromDate = this.parseDateToString(this.pastDate);
      let toDate = this.parseDateToString(this.currentDateFilter);
      let txtSearchData = this.myNoteForm.controls.txtSearch.value;
      if (txtSearchData == "") {
        txtSearchData = "null"
      }
      this.doctorDetailService.getDoctorList(txtSearchData).subscribe((res) => {
        this.doctorDetailList = res
        if (!this.isDtInitialized) {
          this.dtTrigger.next();
        }
        this.isDtInitialized = true;
        setTimeout(() => {
          this.loader = false
        }, 300)
      }, (error: HttpErrorResponse) => {
        this.notifier.showError(error.statusText);
      });
    }
  bindDoctorDetailService(isReInitilized) {
    this.loader = true;
    //this.loaderService.isLoading = new BehaviorSubject<boolean>(true);;
    if (isReInitilized) {
      this.isDtInitialized = false;
    }
    this.doctorDetailService.getDoctorList(null
    ).subscribe((res) => {
      this.doctorDetailList = res;
      if (!this.isDtInitialized) {
        this.dtTrigger.next();
      }
      this.isDtInitialized = true;
      setTimeout(() => {
        this.loader = false
      }, 300)

    }, (error: HttpErrorResponse) => {
      this.notifier.showError(error.statusText);
    });
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first

      dtInstance.destroy();
      this.bindDoctorDetailService(true);
    });
  }
  config: ModalOptions = {
    animated: true,
    backdrop: 'static',
    class: 'modal-dialog-centered modal-md',
  };
  nDoctorId
  PracticeWithDrome
  activateConfirmationModel(template: TemplateRef<any>,nDoctorId,PracticeWithDrome){
    this.conformaitonmodalRef = this.modalService.show(template, this.config);
    this.nDoctorId=nDoctorId
    this.PracticeWithDrome=PracticeWithDrome
  }

  activateDoctor(){
    this.conformaitonmodalRef.hide();
    let doctor={
      nUserId:this.nDoctorId
    }
    // this.doctorDetailService.ActivateRevokeDoctorPraticeWithDrome(doctor).subscribe((res) => {
    //     if(res){
    //       this.notifier.showSuccess(res);
    //       this.rerender();
    //     }
    //   }, (error: HttpErrorResponse) => {
    //   this.notifier.showError(error.statusText);
    // });
  }
  modelCencelBtn(){
    this.conformaitonmodalRef.hide();
  }

  uploadBtn: boolean = false;
  fileName
  imageChangedEvent: any = '';
  croppedImage: any = '';
  file: File// Var
  urlLink: any 
  compressedImage: File
  ProfileImagemodalRef: BsModalRef;
  imageCroperConfig: ModalOptions = {
    animated: true,
    backdrop: 'static',
    class: 'modal-dialog-centered modal-xl',
  };
  profleImageConfig: ModalOptions = {
    animated: true,
    backdrop: 'static',
    class: 'modal-dialog-centered modal-md',
  };

  openProfilePhotoModel(template: TemplateRef<any>,roleIdForPhoto,userIdForPhoto){
    this.ProfileImagemodalRef = this.modalService.show(template, this.profleImageConfig);
    this.roleIdForPhoto=roleIdForPhoto
    this.userIdForPhoto=userIdForPhoto
  }
  roleIdForPhoto
  userIdForPhoto
  selectFiles(template: TemplateRef<any>, event) {
    this.uploadBtn = false
    this.urlLink = "";
    this.file = null!!
    this.fileName = "";
   
    this.imageChangedEvent = event;
    if (event.target.files) {
      this.file = event.target.files[0];
      if (this.file.name.split('.').pop() == 'jpg') {
        if(this.file.size > 1000000){
          this.notifier.showError(`Please Select File less then 1 MB`);
        }else{
          console.log(this.file.size)
          this.fileName = this.file.name;
          var reader = new FileReader()
          reader.readAsDataURL(event.target.files[0])
          this.modalRef = this.modalService.show(template, this.imageCroperConfig);
          reader.onload = (event: any) => {
            this.urlLink = event.target.result
          }
          this.uploadBtn = true
        }
      } else {
        this.notifier.showError(`Invalid file format. Please select .JPG file format.`);
        this.uploadBtn = false
      }
    }
  }
  croped() {
    this.modalRef.hide();
    this.uploadBtn = true
  }
  @ViewChild('ProfileFiles') profileFiles: ElementRef;
  reset() {
    this.profileFiles.nativeElement.value = null;
  }
  // onUpload() {
  //   if (this.file) {
  //     this.resizeImage(this.file);
  //   }
  //   this.uploadBtn = false;
  // }
  // resize image
  MAX_WIDTH = 320;
  MAX_HEIGHT = 180;
  MIME_TYPE = "image/jpeg";
  QUALITY = 0.7;
  // resizeImage(file: File) {
  //   const blobURL = URL.createObjectURL(file);
  //   const img = new Image();
  //   img.src = blobURL;
  //   img.onerror = function () {
  //     URL.revokeObjectURL(img.src);
  //     // Handle the failure properly
  //     console.log("Cannot load image");
  //   };
  //   img.onload = () => {
  //     URL.revokeObjectURL(img.src);
  //     const [newWidth, newHeight] = this.calculateSize(img, this.MAX_WIDTH, this.MAX_HEIGHT);
  //     const canvas = document.createElement("canvas");
  //     canvas.width = newWidth;
  //     canvas.height = newHeight;
  //     const ctx = canvas.getContext("2d");
  //     ctx!.drawImage(img, 0, 0, newWidth, newHeight);
  //     canvas.toBlob(
  //       (blob) => {
  //         //this.compressedImage = blob;
  //         // Handle the compressed image. es. upload or save in local state

  //         this.compressedImage = new File([blob!], 'image.jpeg', {
  //           type: blob!.type,
  //         });
  //         console.log(this.compressedImage);
  //         // upload image
  //         let fileSize = (this.compressedImage.size / 1024);// in kb
  //         this.viewUpdateProfileService.fileUpload(this.compressedImage, fileSize, this.userIdForPhoto, this.roleIdForPhoto).subscribe(
  //           (status: any) => {
  //             if (status) {
  //               this.notifier.showSuccess("Uploaded!");
  //               this.ProfileImagemodalRef.hide()
  //             }
  //             else {
  //               this.notifier.showSuccess("Something Wrong");
  //             }
  //           }
  //         );
  //       },
  //       this.MIME_TYPE,
  //       this.QUALITY
  //     );
  //     // document.getElementById("root").append(canvas);
  //   };
  // }
  calculateSize(img, maxWidth, maxHeight) {
    let width = img.width;
    let height = img.height;

    // calculate the width and height, constraining the proportions
    if (width > height) {
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
    } else {
      if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }
    }
    return [width, height];
  }
  images
  fileBits
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.urlLink = event.base64;
    this.convertBase64ToImageFile(this.croppedImage);
    //     // this.urlLink = event.file;
    //     // this.file =this.imageChangedEvent.target.files[0];
    //     this.file =this.imageChangedEvent.target.files[0];
    //     this.fileName = this.file.name
    // this.file = new File(fileBits:[event.file],filesUpload.name 
    //   , options:{type:filesUpload.type});
    // this.file = new File(this.fileBits:[event.file], this.fileName= filesUpload.name, options?type:filesUpload.type);
  }
  convertBase64ToImageFile(base64) {
    const arr = base64.split(",");
    if (arr != null) {
      const mime = 'image/jpeg'//arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      this.file = new File([u8arr], this.userIdForPhoto + "_profile.jpg", { type: mime })
    }
  }
  selectedFileBLOB;
  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();
  @Output() getPicture = new EventEmitter<WebcamImage>();
  showWebcam = false;
  isCameraExist = true;
  webcamImage: WebcamImage;
  errors: WebcamInitError[] = [];
  showText: boolean = false
  WebmodalRef: BsModalRef;
  webModalTitle: string;

  takeSnapshot(): void {
    this.trigger.next();
    this.uploadBtn = true
  }
  OffWebCame() {
    this.showWebcam = false;
    this.showText = true;
  }
  onWebCame() {
    this.showWebcam = true;
    this.showText = false;
  }

  handleInitError(error: WebcamInitError) {
    this.errors.push(error);
  }

  changeWebCame(directionOrDeviceId: boolean | string) {
    this.nextWebcam.next(directionOrDeviceId);
  }

  handleImage(webcamImage: WebcamImage) {

    this.getPicture.emit(webcamImage);
    this.webcamImage = webcamImage;
    // this.urlLink = webcamImage.imageAsDataUrl;
    this.showWebcam = false;
    this.urlLink = "false";

    const arr = this.webcamImage.imageAsDataUrl.split(",");
    if (arr != null) {
      const mime = 'image/jpeg'//arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      this.fileName = Math.floor(Math.random() * 10111111) + "_medical-record.jpg"
      this.file = new File([u8arr], this.fileName, { type: mime })
      const blob = new Blob([u8arr], { type: mime });
      var url = window.URL.createObjectURL(blob);
      this.selectedFileBLOB = this.sanitizer.bypassSecurityTrustUrl(url);

      this.WebmodalRef.hide();
    }
  }

  Webconfig: ModalOptions = {
    animated: true,
    backdrop: 'static',
    class: 'modal-dialog-centered modal-md',
  };
  openWebCam(template: TemplateRef<any>) {
    this.WebmodalRef = this.modalService.show(template, this.Webconfig);

    this.webModalTitle = "Take picture";
    this.showWebcam = true;
  }


  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }
}
