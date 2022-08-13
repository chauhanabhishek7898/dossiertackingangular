import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { ClinicCoodinatorNonDromeFamilyStorageService } from '../services/clinic-coordinator-non-drome-family';



@Injectable({
    providedIn: 'root'
})
export class ClinicCoodinatorNonDromeFamilyAdminAuthGuard implements CanActivate {
    constructor(
        private storageService: ClinicCoodinatorNonDromeFamilyStorageService,
        private router: Router
    ) { }
    canActivate(): boolean {
        if (this.storageService.clNdadminRoleId == "9") {
            return true;
        }
        else {
            this.router.navigate(['/ccnd/login']);
            return false;
        }
    }
}
