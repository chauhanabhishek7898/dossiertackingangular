import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminStorageService } from '../services/adminStorage.service';


@Injectable({
    providedIn: 'root'
})
export class AdminSignInGuard implements CanActivate {
    constructor(
        private storageService: AdminStorageService,
        private router: Router
    ) { }
    canActivate(): boolean {
        if (this.storageService.isAdminLogedIn) {
            this.router.navigate(["/ad/dashboard"]);
            return false;
        }
        return true;
    }
}