import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminStorageService } from '../services/adminStorage.service';
import { ClinicCoodinatorNonDromeFamilyStorageService } from '../services/clinic-coordinator-non-drome-family';
import { SuperAdminStorageService } from '../services/super-admin-storage.service';


@Injectable({
    providedIn: 'root'
})
export class ClinicCoodinatorNonDromeFamilyAdminSignInGuard implements CanActivate {
    constructor(
        private storageService: ClinicCoodinatorNonDromeFamilyStorageService,
        private router: Router
    ) { }
    canActivate(): boolean {
        if (this.storageService.isclNdAdminLogedIn) {
            this.router.navigate(["/ccnd/dashboard"]);
            return false;
        }
        return true;
    }
}
