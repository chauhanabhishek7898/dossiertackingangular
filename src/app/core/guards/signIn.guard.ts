import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage.service';

@Injectable({
    providedIn: 'root'
})
export class IsSignedInGuard implements CanActivate {
    constructor(
        private storageService: StorageService,
        private router: Router
    ) { }
    canActivate(): boolean {
        if (this.storageService.isUserLogedIn) {
            // this.router.navigate(["/dashboard"]);
            if (this.storageService.roleId == "1") {
                this.router.navigate(['/ad/country'], {
                });
              } 
              else {
                this.router.navigate(['/dashboard'], {
                });
              }
            return false;
        }

        return true;

    }
}
