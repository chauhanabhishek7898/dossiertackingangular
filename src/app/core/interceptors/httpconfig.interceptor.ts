import { Injectable, Injector } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpErrorResponse,
    HttpHandler,
    HttpEvent
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry, finalize } from 'rxjs/operators';
//import { JwtService } from '../services/jwt.service';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { AdminStorageService } from '../services/adminStorage.service';
import { SuperAdminStorageService } from '../services/super-admin-storage.service';
import { ClinicCoodinatorStorageService } from '../services/clinic-coodinator-Storage.service';
import { ClinicCoodinatorNonDromeFamilyStorageService } from '../services/clinic-coordinator-non-drome-family';
import { DoctorNonDromeFamilyStorageService } from '../services/doctor-non-drome-family';

@Injectable()
export class HttpconfigInterceptor implements HttpInterceptor {

    constructor(
        private session: StorageService,
        private AdminSession: AdminStorageService,
        private SuperAdminSession: SuperAdminStorageService,
        private CCSession: ClinicCoodinatorStorageService,
        private CCNDSession: ClinicCoodinatorNonDromeFamilyStorageService,
        private DNDSession: DoctorNonDromeFamilyStorageService,
        private router: Router,
        private injector: Injector
    ) { }


    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const jwt = this.getJwtToken();
        if (!!jwt) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${jwt}`
                }
            });
        }

        return next.handle(request).pipe(
            
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    this.session.logout();
                    window.location.href = "/login";
                }
                else {
                    return throwError(error);
                }
                return throwError(error);
            }),
            finalize(() => {
            })
        );
    }
   
   
    
    
   
    // jwt token according to roleId

    getJwtToken() {
        let loginType = window.location.pathname.split('/')[1];
        if (loginType == "nd") {
            return this.nonDromeDoctorToken();
        }
        
        else if (loginType == "ccnd") {
            return this.ccNonDromDoctorToken();
        }
        
        else if(loginType == "cc"){
            return this.clinicCoodinatorToken();
        }
        else if(loginType == "ad"){
            return this.AdminToken();
        }
        else if(loginType == "sad"){
            return this.SuperAdminToken();
        }
        else {
            return this.patientDoctorToken();
        }
    }

    
    patientDoctorToken() {
        const user = this.session.isUserLogedIn;
        let jwt;
        if (!!user) {
            jwt = this.session.getMemberToken;
        }
        return jwt;
    }
    nonDromeDoctorToken() {
        const user = this.DNDSession.isdNdAdminLogedIn;
        let jwt;
        if (!!user) {
            jwt = this.DNDSession.getMemberToken;
        }
        return jwt;
    }

    ccNonDromDoctorToken() {
        const user = this.CCNDSession.isclNdAdminLogedIn;
        let jwt;
        if (!!user) {
            jwt = this.CCNDSession.getMemberToken;
        }
        return jwt;
    }
    clinicCoodinatorToken() {
        const user = this.CCSession.isCCAdminLogedIn;
        let jwt;
        if (!!user) {
            jwt = this.CCSession.getMemberToken;
        }
        return jwt;
    }
    AdminToken() {
        const user = this.AdminSession.isAdminLogedIn;
        let jwt;
        if (!!user) {
            jwt = this.AdminSession.getMemberToken;
        }
        return jwt;
    }
    SuperAdminToken() {
        const user = this.SuperAdminSession.isSAdminLogedIn;
        let jwt;
        if (!!user) {
            jwt = this.SuperAdminSession.getMemberToken;
        }
        return jwt;
    }
   

}
