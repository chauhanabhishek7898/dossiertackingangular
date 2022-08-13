import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { DoctorNonDromeFamilyStorageService } from '../services/doctor-non-drome-family';





@Injectable({
    providedIn: 'root'
})
export class DoctorNonDromeFamilyAdminAuthGuard implements CanActivate {
    constructor(
        private storageService: DoctorNonDromeFamilyStorageService,
        private router: Router
    ) { }
    canActivate(): boolean {
        if (this.storageService.dNdadminRoleId == "8") {
            return true;
        }
        else {
            this.router.navigate(['nd/doctor/login']);
            return false;
        }
    }
}
