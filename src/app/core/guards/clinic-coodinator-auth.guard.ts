import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminStorageService } from '../services/adminStorage.service';
import { ClinicCoodinatorStorageService } from '../services/clinic-coodinator-Storage.service';
import { SuperAdminStorageService } from '../services/super-admin-storage.service';


@Injectable({
    providedIn: 'root'
})
export class ClinicCoordinatorAuthGuard implements CanActivate {
    constructor(
        private storageService: ClinicCoodinatorStorageService,
        private router: Router
    ) { }
    canActivate(): boolean {
        if (this.storageService.adminRoleId == "6") {
            return true;
        }
        else {
            this.router.navigate(['/cc/login']);
            return false;
        }
    }
}
