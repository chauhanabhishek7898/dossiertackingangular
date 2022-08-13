import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { DoctorNonDromeFamilyStorageService } from '../services/doctor-non-drome-family';




@Injectable({
    providedIn: 'root'
})
export class DoctorNonDromeFamilyAdminSignInGuard implements CanActivate {
    constructor(
        private storageService:DoctorNonDromeFamilyStorageService ,
        private router: Router
    ) { }
    canActivate(): boolean {
        if (this.storageService.isdNdAdminLogedIn) {
            this.router.navigate(["nd/doctor/dashboard"]);
            return false;
        }
        return true;
    }
}
