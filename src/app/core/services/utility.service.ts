import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UtilityService {

    constructor(private http: HttpClient) {

    }
    apiUrl = environment.dromeApiUrl;
    getCurrentDate(): Observable<any> {
        return this.http.get(`${this.apiUrl}/Utility/GetCurrentDBDate`);

    }
    getCurrentDBDateDDMMMYYYY(): Observable<any> {
        return this.http.get(`${this.apiUrl}/Utility/GetCurrentDBDateDDMMMYYYY`);

    }
    getUserDob(nUserId: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/PatientMaster/GetPatientDOB/${nUserId}`);

    }
    updateUserDob(user: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/PatientMaster/PatientDOB_Update`, user);

    }
    getCurrentDBTime(): Observable<any> {
        return this.http.get(`${this.apiUrl}/Utility/GetCurrentDBTime`);
    }
    getDashBoardLinks(nUserId: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/UserMaster/GetDashBoardLinks/${nUserId}`);
    }
    GetCountSecondaryUsers(primaryPatientUserId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/PatientSuperUserDetails/GetCountSecondaryUsers/${primaryPatientUserId}`);
    }
    getSecondaryPatientSuperUserDetailsWithPrimary(primaryPatientUserId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/PatientSuperUserDetails/GetSecondaryPatientSuperUserDetailsWithPrimary/${primaryPatientUserId}`);
    }
}
