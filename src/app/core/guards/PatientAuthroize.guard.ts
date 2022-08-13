import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage.service';

@Injectable({
    providedIn: 'root'
})
export class PatientAuthorizationGuard {
    //     constructor(
    //         private storageService: StorageService,
    //         private router: Router
    //     ) { }
    //     canActivate(): boolean {

    //         if (this.storageService.roleId == "1") {

    //             return true;
    //         }

    //     }
}
