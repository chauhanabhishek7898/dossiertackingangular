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
                this.router.navigate(['/ad/country'], {
                });
              } else if (this.storageService.roleId == "4") {
                //dr/pending-consultations
                this.router.navigate(['/cp/manageaddresses'], {
                });
              }
              else {
                this.router.navigate(['/ad/country'], {
                });
              }
            return false;
        }

        return true;

    }
}
