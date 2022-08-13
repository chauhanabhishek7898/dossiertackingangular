import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private storageService: StorageService,
        private router: Router
    ) { }
    canActivate(): boolean {
        if (this.storageService.isUserLogedIn) {
            return true;
        }
        else {
            this.router.navigate(['/login']);
            return false;
        }
    }
}
