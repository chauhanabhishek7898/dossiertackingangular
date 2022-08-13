import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage.service';

@Injectable({
    providedIn: 'root'
})
export class IsSignedInGuard implements CanActivate {
    constructor(
        private storageService: StorageService,
        private router: Router
    ) { }
    canActivate(): boolean {
        if (this.storageService.isUserLogedIn) {
            // this.router.navigate(["/dashboard"]);
            if (this.storageService.roleId == "1") {
                this.router.navigate(['/dashboard/pt/doctor-list'], {
                });
              } else if (this.storageService.roleId == "2") {
                //dr/pending-consultations
                this.router.navigate(['/dashboard/dr/taskscalendarview'], {
                });
              }
               else if (this.storageService.roleId == "3") {
                //dr/pending-consultations
                this.router.navigate(['/dashboard/pharmacy/orderdetails'], {
                });
              }
              else if (this.storageService.roleId == "4") {
                //dr/pending-consultations
                this.router.navigate(['/dashboard/ad/view-profile'], {
                });
              }
              else if (this.storageService.roleId == "5") {
                //dr/pending-consultations
                this.router.navigate(['/dashboard/sad/take-action-on-unscbscibe'], {
                });
              }
              else if (this.storageService.roleId == "6") {
                //dr/pending-consultations
                this.router.navigate(['/dashboard/cc/adhoc-appointment'], {
                });
              }
              else if (this.storageService.roleId == "8") {
                //dr/pending-consultations
                this.router.navigate(['/dashboard/nd/taskscalendarview'], {
                });
              }
              else if (this.storageService.roleId == "9") {
                //dr/pending-consultations
                this.router.navigate(['/dashboard/ccnd/view-profile'], {
                });
              } 
              else if (this.storageService.roleId == "11") {
                //dr/pending-consultations
                this.router.navigate(['/dashboard/lab/orderdetails'], {
                });
              } 
              else if (this.storageService.roleId == "12") {
                //dr/pending-consultations
                this.router.navigate(['/dashboard/pa/orderdetails'], {
                });
              } 
              else if (this.storageService.roleId == "13") {
                //dr/pending-consultations
                this.router.navigate(['/dashboard/la/orderdetails'], {
                });
              } 
              else if (this.storageService.roleId == "14") {
                //dr/pending-consultations
                this.router.navigate(['/dashboard/entity/view-profile'], {
                });
              }
              else if (this.storageService.roleId == "15") {
                //dr/pending-consultations
                this.router.navigate(['/dashboard/corporate/view-profile'], {
                });
              }
              else if (this.storageService.roleId == "16") {
                //dr/pending-consultations
                this.router.navigate(['/dashboard/institute/view-profile'], {
                });
              }
              else if (this.storageService.roleId == "17") {
                //dr/pending-consultations
                this.router.navigate(['/dashboard/institute/view-profile'], {
                });
              }
              else {
                this.router.navigate(['/dashboard'], {
                });
              }
            return false;
        }

        return true;

    }
}
