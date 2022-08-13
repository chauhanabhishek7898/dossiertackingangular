import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminStorageService } from '../services/adminStorage.service';
import { SuperAdminStorageService } from '../services/super-admin-storage.service';


@Injectable({
    providedIn: 'root'
})
export class SuperAdminAuthGuard implements CanActivate {
    constructor(
        private storageService: SuperAdminStorageService,
        private router: Router
    ) { }
    canActivate(): boolean {
        if (this.storageService.sadminRoleId == "5") {
            return true;
        }
        else {
            this.router.navigate(['/sad/login']);
            return false;
        }
    }
}
