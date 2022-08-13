import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminStorageService } from '../services/adminStorage.service';


@Injectable({
    providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {
    constructor(
        private storageService: AdminStorageService,
        private router: Router
    ) { }
    canActivate(): boolean {
        if (this.storageService.adminRoleId == "4") {
            return true;
        }
        else {
            this.router.navigate(['/ad/login']);
            return false;
        }
    }
}