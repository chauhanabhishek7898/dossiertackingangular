import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage.service';

@Injectable({
    providedIn: 'root'
})
export class DoctorAuthorizationGuard implements CanActivate {
    constructor(
        private storageService: StorageService,
        private router: Router
    ) { }
    canActivate(): boolean {
        if (this.storageService.roleId == "2") {
            return true;
        }
        else {
            this.router.navigate(['/home']);
            return false;
        }
    }
}
