import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ConnectionService } from 'ng-connection-service';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Subject, Observable } from 'rxjs';
import { NotificationService } from 'src/app/core/service/notification.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { environment } from 'src/environments/environment';
import { PageDetails } from '../../models/page-details';
import { AdminDashboardService } from './admin-dashboard.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  // @Output() getPicture = new EventEmitter<WebcamImage>();
  showWebcam = false;
  isCameraExist = true;
  // webcamImage: WebcamImage;
  // errors: WebcamInitError[] = [];
  options: boolean = true;
  ModalTitle: string;
  formType: string;
  CityMasterForm: any;
  modalRef: BsModalRef;
  file: File// Var
  // urlLink: string
  urlLink: any = "assets/images/defult-user.png";
  urlLink2: string = "assets/images/beta_logo.png";
  showText: boolean = false
  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();
  showMoreLinks: boolean = false;
  rotateToggle: boolean = false;

  pageDetails: PageDetails[] = [];
  parentPageList: PageDetails[] = []
  pageDetailsFirsList: PageDetails[] = [];
  pageDetailsLastList: PageDetails[] = [];
  userRole: string;
  count: any
  messageCountInterval: any;
  compressedImage: File
  roleId;
  constructor(
    private modalService: BsModalService,
    private adminDashboardService: AdminDashboardService,
    private notifier: NotificationService,
    private storageService: StorageService,
    private router: Router,
    private connectionService: ConnectionService
  ) {
    // communicationService.changeEmitted$.subscribe(
    //   data => {
    //     //     if (data == "true") {
    //     //       // if (fullPageDisplay()) {
    //     //       this.toggleMenuProfile = true;
    //     //       //}
    //     //     } else if (data == "false") {
    //     //       this.toggleMenuProfile = false;
    //     //     } else if (typeof data == "object") {
    //     if (data.count) {
    //       this.count = data.count;
    //     }
    //     //     }
    //   });
  }
  fullName
  userId;
  roleName: string;
  vGender: string;
  memberId: string;
  establishmentName: string;
  sideBarHide: any
  isConnected: boolean = true
  connection: any
  ngOnInit(): void {
    this.connectionService.monitor().subscribe(isConnected => {
      if (isConnected) {
        this.isConnected = true
      } else {
        this.isConnected = false;
      }
    })
    // this.connection = new signalR.HubConnectionBuilder()
    //   .configureLogging(signalR.LogLevel.Information)
    //   .withUrl(environment.dromeImageUrl + '/ChatHub')
    //   .build();

    // this.connection.start().then(function () {
    //   console.log('SignalR Connected!');
    // }).catch(function (err) {
    //   return console.error(err.toString());
    // });

    // this.connection.on("SendDashboardMessageCount", (userid) => {
    //   console.log(userid);
    //   if (parseInt(this.storageService.userId) == userid)
    //     this.count = parseInt(this.count) + 1;
    // });
    // this.connection.on("UnreadMessageCount", (userid, messageCount) => {
    //   console.log(userid);
    //   if (parseInt(this.storageService.userId) == userid)
    //     this.count = parseInt(messageCount);
    // });

    //this.requestPermission();
    //this.listen();
    this.roleId = this.storageService.roleId;
    // WebcamUtil.getAvailableVideoInputs()
    //   .then((mediaDevices: MediaDeviceInfo[]) => {
    //     this.isCameraExist = mediaDevices && mediaDevices.length > 0;
    //   });
    this.userId = this.storageService.userId?.toString();
    this.fullName = this.storageService.userName?.toString();

    this.setUserRole();
    this.loadProfilePic();
    // this.getDashboardLink();
    // if (this.roleId != '1') {
    //   this.bindOrganizationDetailsList();
    // }

    // get unread message count for user
    // if (this.roleId == 1 || this.roleId == 2 || this.roleId == 3 || this.roleId == 8 || this.roleId == 11 || this.roleId == 12 || this.roleId == 13) {
    //   this.doctorMessageCount();
    // }

    // if (this.storageService.roleId == "2" || this.storageService.roleId == "8") {
    //   this.doctorMessageCount();
    //   this.messageCountInterval = window.setInterval(() => {
    //     this.doctorMessageCount();
    //   }, 30000)

    // } else {
    //   this.patientMessageCount();
    //   this.messageCountInterval = window.setInterval(() => {
    //     this.patientMessageCount();
    //   }, 30000)

    // }
  }
  uploadBtn: boolean = false;
  fileName
  imageChangedEvent: any = '';
  croppedImage: any = '';
  imageCroperConfig: ModalOptions = {
    animated: true,
    backdrop: 'static',
    class: 'modal-dialog-centered modal-xl',
  };
  selectFiles(template: TemplateRef<any>, event) {
    this.uploadBtn = false
    this.urlLink = "";
    this.file = null!!
    this.fileName = "";
    this.imageChangedEvent = event;
    if (event.target.files) {
      this.file = event.target.files[0];
      if (this.file.name.split('.').pop() == 'jpg') {
        if (this.file.size > 5000000) {
          this.notifier.showError(`Please Select File less then 2 MB`);
        } else {
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
  files: any;
  selectedFileBLOB;

  // selectFiles(event) {
  //   if (event.target.files) {
  //     this.file = event.target.files[0];

  //     if(this.file.name.split('.').pop() == 'jpg' ){
  //     var reader = new FileReader()
  //     reader.readAsDataURL(event.target.files[0])
  //     reader.onload = (event: any) => {
  //       this.urlLink = event.target.result
  //     }
  //     this.uploadBtn = true
  //   } else{
  //     this.notifier.showError(`Invalid file format. Please select .JPG file format.`);
  //     this.uploadBtn = false
  //   }
  //   }

  // }
  images
  fileBits
  // imageCropped(event: ImageCroppedEvent) {
  //   this.croppedImage = event.base64;
  //   this.urlLink = event.base64;
  //   this.convertBase64ToImageFile(this.croppedImage);
  //   //     // this.urlLink = event.file;
  //   //     // this.file =this.imageChangedEvent.target.files[0];
  //   //     this.file =this.imageChangedEvent.target.files[0];
  //   //     this.fileName = this.file.name
  //   // this.file = new File(fileBits:[event.file],filesUpload.name 
  //   //   , options:{type:filesUpload.type});
  //   // this.file = new File(this.fileBits:[event.file], this.fileName= filesUpload.name, options?type:filesUpload.type);
  // }
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
  // // resize image
  // MAX_WIDTH = 320;
  // MAX_HEIGHT = 180;
  // MIME_TYPE = "image/jpeg";
  // QUALITY = 0.7;
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
  //         let nRoleId = parseInt(this.storageService.roleId!!);
  //         this.viewUpdateProfileService.fileUpload(this.compressedImage, fileSize, this.userId, nRoleId).subscribe(
  //           (status: any) => {
  //             if (status) {
  //               this.notifier.showSuccess("Uploaded!");
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
  // calculateSize(img, maxWidth, maxHeight) {
  //   let width = img.width;
  //   let height = img.height;

  //   // calculate the width and height, constraining the proportions
  //   if (width > height) {
  //     if (width > maxWidth) {
  //       height = Math.round((height * maxWidth) / width);
  //       width = maxWidth;
  //     }
  //   } else {
  //     if (height > maxHeight) {
  //       width = Math.round((width * maxHeight) / height);
  //       height = maxHeight;
  //     }
  //   }
  //   return [width, height];
  // }
  loadProfilePic() {

    this.adminDashboardService.getProfileDetailsByUserId(this.userId).subscribe(
      (status: any) => {
        if (status) {
          this.storageService.setCityDetails = status.TAB1[0].CityDetails;
          this.storageService.setvCountryName = status.TAB1[0].vCountryName;
          this.storageService.setCityId = status.TAB1[0].nCityId;
          this.storageService.setMobileNoCompany = status.TAB1[0].MobileNoCompany;
          this.storageService.setEmailIdCompany = status.TAB1[0].EmailIdCompany;
          this.storageService.setMemberId = status.TAB1[0].MemberId;
          // this.storageService.setvGender = status[0].vGender;
          // this.storageService.setPatientAge = status[0].PatientAge;

          // this.storageService.setRoleNameDetails = status[0].vRoleName;
          // if (status.TAB1[0].vPhotoFilePath != null) {
          //   this.urlLink = `${environment.dromeImageUrl}/${status.TAB1[0].vPhotoFilePath}`
          // }

          this.memberId = status.TAB1[0].MemberId
          this.roleName = status.TAB1[0].vRoleName
          // this.vGender = status[0].vGender
          this.establishmentName = status.TAB1[0].EstablishmentName

          this.pageDetails = status.TAB2;
          this.parentPageList = this.pageDetails.filter((page) => page.nPageDependentId == null)
          if (this.parentPageList.length > 4) {
            this.pageDetailsFirsList = this.parentPageList.slice(0, 4);
            this.pageDetailsLastList = this.parentPageList.slice(4);
          } else {
            this.pageDetailsFirsList = this.parentPageList;
          }
        }
        else {
          this.notifier.showSuccess("Something Wrong");
        }
      }
    );
  }

  logout() {
    clearInterval(this.messageCountInterval)
    this.storageService.logout();

    this.router.navigate(['/login']);
  }
  takeSnapshot(): void {
    this.trigger.next();
    this.modalRef.hide();
    this.uploadBtn = true;
  }
  OffWebCame() {
    this.showWebcam = false;
    this.showText = true;
  }
  onWebCame() {
    this.showWebcam = true;
    this.showText = false;
  }

  // handleInitError(error: WebcamInitError) {
  //   this.errors.push(error);
  // }

  // changeWebCame(directionOrDeviceId: boolean | string) {
  //   this.nextWebcam.next(directionOrDeviceId);
  // }

  // handleImage(webcamImage: WebcamImage) {
  //   debugger;
  //   this.getPicture.emit(webcamImage);
  //   this.webcamImage = webcamImage;
  //   this.urlLink = webcamImage.imageAsDataUrl;
  //   this.showWebcam = false;

  //   const arr = this.webcamImage.imageAsDataUrl.split(",");
  //   if (arr != null) {
  //     const mime = 'image/jpeg'//arr[0].match(/:(.*?);/)[1];
  //     const bstr = atob(arr[1]);
  //     let n = bstr.length;
  //     const u8arr = new Uint8Array(n);
  //     while (n--) {
  //       u8arr[n] = bstr.charCodeAt(n);
  //     }
  //     this.file = new File([u8arr], this.userId + "_profile.jpg", { type: mime })
  //   }
  //   //this.onUpload();
  // }
  // convertBase64ToImageFile(base64) {
  //   const arr = base64.split(",");
  //   if (arr != null) {
  //     const mime = 'image/jpeg'//arr[0].match(/:(.*?);/)[1];
  //     const bstr = atob(arr[1]);
  //     let n = bstr.length;
  //     const u8arr = new Uint8Array(n);
  //     while (n--) {
  //       u8arr[n] = bstr.charCodeAt(n);
  //     }
  //     this.file = new File([u8arr], this.userId + "_profile.jpg", { type: mime })
  //   }
  // }
  // config: ModalOptions = {
  //   animated: true,
  //   backdrop: 'static',
  //   class: 'modal-dialog-centered modal-md',
  // };
  // openWebCam(template: TemplateRef<any>) {
  //   this.modalRef = this.modalService.show(template, this.config);

  //   this.ModalTitle = "Click Profile Picture";
  //   this.showWebcam = true;
  // }


  // get triggerObservable(): Observable<void> {
  //   return this.trigger.asObservable();
  // }

  // get nextWebcamObservable(): Observable<boolean | string> {
  //   return this.nextWebcam.asObservable();
  // }
  showMoreLink() {
    this.showMoreLinks = !this.showMoreLinks;
    this.rotateToggle = !this.rotateToggle;
  }
  toggleMenuProfile = false;
  mobileProfileMenu() {
    this.toggleMenuProfile = true;
  }

  sideMenuBar($event) {
    $event.stopPropagation();
    this.toggleMenuProfile = true;

  }
  closeProfilesMenu() {
    // $event.stopPropagation();
    this.toggleMenuProfile = false;
  }
  // onClick(){
  //   this.toggleMenuProfile=true;

  // }
  subMenuHide = false;
  closeMatSideBar(event) {
    this.submenu = true
    this.toggleMenuProfile = false
    this.subMenuHide = false;
    this.states = this.navType;

    event.stopPropagation();
    if (window.screen.width < 1080) {
      //The device is a Mobile
      this.closeProfilesMenu();
      this.clickOutSide();
    }
  }
  @HostListener('document:click', ['$event']) onDocumentClick(event) {
    this.toggleMenuProfile = false;
    this.menuShow = false;
  }
  clickOutSide() {
    this.toggleMenuProfile = false
    this.menuShow = false;
  }
  // getDashboardLink() {
  //   this.utilityService.getDashBoardLinks(parseInt(this.storageService.userId!!)).subscribe((res) => {
  //     this.pageDetails = res;
  //     this.parentPageList = this.pageDetails.filter((page) => page.nPageDependentId == null)
  //     if (this.parentPageList.length > 4) {
  //       this.pageDetailsFirsList = this.parentPageList.slice(0, 4);
  //       this.pageDetailsLastList = this.parentPageList.slice(4);
  //     } else {
  //       this.pageDetailsFirsList = this.parentPageList;
  //     }
  //   })
  // }
  setUserRole() {
    if (this.storageService.roleId == "1") {
      this.userRole = "pt";
    } else if (this.storageService.roleId == "2") {
      this.userRole = "dr";
    }
    else if (this.storageService.roleId == "3") {
      this.userRole = "pharmacy";
    }
    else if (this.storageService.roleId == "4") {
      this.userRole = "ad";
    }
    else if (this.storageService.roleId == "5") {
      this.userRole = "sad";
    }
    else if (this.storageService.roleId == "6") {
      this.userRole = "cc";
    }
    else if (this.storageService.roleId == "9") {
      this.userRole = "ccnd";
    }

    else if (this.storageService.roleId == "8") {
      this.userRole = "nd";
    }
    else if (this.storageService.roleId == "11") {
      this.userRole = "lab";
    }
    else if (this.storageService.roleId == "12") {
      this.userRole = "pa";
    }
    else if (this.storageService.roleId == "13") {
      this.userRole = "la";
    }
    else if (this.storageService.roleId == "14") {
      this.userRole = "entity";
    }
    else if (this.storageService.roleId == "15") {
      this.userRole = "corporate";
    }
    else if (this.storageService.roleId == "16") {
      this.userRole = "institute";
    }
    else if (this.storageService.roleId == "17") {
      this.userRole = "institute-assistent";
    }
  }
  states: any;
  arrowRotate = false;
  navType
  submenu = false
  toggleSubNav(type, event) {
    this.navType = type
    this.submenu = false
    if (this.states == type) {
      this.states = 0;
      this.arrowRotate = true
      this.subMenuHide = true;
    } else {
      this.states = type;
      this.arrowRotate = false
      this.subMenuHide = false;
      // $event.stopPropagation();
    }
    event.stopPropagation();
  }
  // vContactNo
  // vEmailId
  // organizationDetailsLists: OrganizationDetailsList[] = [];

  // bindOrganizationDetailsList() {

  //   this.organizationDetailsServices.getOrganizationDetailsForheader(this.storageService.userId!!).subscribe((res) => {
  //     this.organizationDetailsLists = res;
  //     if (res != []) {
  //       this.urlLink2 = `${environment.dromeImageUrl}/${res[0].vLogoFilePath}`
  //       this.vContactNo = res[0].vContactNo
  //       this.vEmailId = res[0].vEmailId
  //     } else {
  //       this.urlLink2 = "assets/images/beta_logo.png"
  //     }
  //     if (res[0].vLogoFilePath == null || res[0].vLogoFilePath == '') {
  //       this.urlLink2 = "assets/images/beta_logo.png"
  //     }

  //   }, (error: HttpErrorResponse) => {
  //     this.notifier.showError(error.statusText);
  //   });
  // }
  // listen() {
  //   const messaging = getMessaging();
  //   onMessage(messaging, (payload) => {
  //     this.message = payload;
  //     this.messageCount++;
  //   });
  // }
  // requestPermission() {
  // const messaging = getMessaging();
  // getToken(messaging, { vapidKey: environment.firebase.vapidKey }).then((currentToken) => {
  //   if (currentToken) {
  //     this.firebaseToken = currentToken;
  //     this.getDashboardLink();
  //     // Send the token to your server and update the UI if necessary
  //     // ...
  //   } else {
  //     // Show permission request UI
  //     // ...
  //   }
  // }).catch((err) => {
  //   // ...
  // });

  //}
  // patientMessageCount() {
  //   this.messageDoctorService.UnReadMessageCount(parseInt(this.storageService.userId!!)).subscribe((res) => {
  //     this.count = res[0].UnReadMessageCount;
  //   }, (error: HttpErrorResponse) => {
  //     this.notifier.showError(error.statusText);
  //   });
  // }
  // doctorMessageCount() {
  //   this.messageDoctorService.UnReadMessageCount(parseInt(this.storageService.userId!!)).subscribe((res) => {
  //     this.count = res[0].UnReadMessageCount;
  //   }, (error: HttpErrorResponse) => {
  //     this.notifier.showError(error.statusText);
  //   });
  // }
  configButtons: ModalOptions = {
    animated: true,
    backdrop: 'static',
    class: 'modal-dialog-centered modal-lg',
  };
  openModalFirst(template: TemplateRef<any>) {

    this.modalRef = this.modalService.show(template, this.configButtons);

  }
  //  redairect(){
  //   window.open("https://drome.co.in", "_blank");
  //  }
  menuShow: boolean = false;
  menuClick($event) {
    $event.stopPropagation();
    this.menuShow = !this.menuShow
  }
}
