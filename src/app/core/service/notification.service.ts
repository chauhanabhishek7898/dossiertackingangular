import { Injectable, NgZone } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    constructor(
        private zone: NgZone,
        private toastrService: ToastrService,
    ) { }

    showSuccess(message: string, title?: string): void {
        // Had an issue with the snackbar being ran outside of angular's zone.
        this.zone.run(() => {
            // this.snackBar.open(message);
            this.toastrService.success(message, title,{
                timeOut:3000,
                // positionClass: 'toast-center-center',
            });
        });
    }
    fakeMessage(message: string, title?: string): void {
        // Had an issue with the snackbar being ran outside of angular's zone.
        this.zone.run(() => {
            // this.snackBar.open(message);
            this.toastrService.success(message, title,{
                timeOut:10,
                // positionClass: 'toast-center-center',
            });
        });
    }

    // showCustomSuccess(message: string, title?: string): void {
    //     // Had an issue with the snackbar being ran outside of angular's zone.
    //     this.zone.run(() => {
    //         // this.snackBar.open(message);
    //         this.toastrService.show(message, title, {
    //             enableHtml: true,
    //             timeOut:1000,
    //             positionClass: 'toast-center-center',

    //         });
    //     });
    // }
    showCustomSuccess(message: string, title?: string): void {
        // Had an issue with the snackbar being ran outside of angular's zone.
        this.zone.run(() => {
            // this.snackBar.open(message);
            this.toastrService.show( message, title, {
                enableHtml: true,
                timeOut: 5000,
                positionClass: 'toast-center-center',

            });
        });
    }
    showError(message: string, title?: string): void {
        this.zone.run(() => {
            // The second parameter is the text in the button.
            // In the third, we send in the css class for the snack bar.
            // this.snackBar.open(message, 'X', {
            //   panelClass: ['error'],
            //   verticalPosition: 'top'
            // });
            this.toastrService.error(message, title,{
                timeOut:3000,
                // positionClass: 'toast-center-center',
            });
        });
    }

}