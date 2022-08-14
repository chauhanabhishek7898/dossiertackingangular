import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserSettingService {

    constructor(private http: HttpClient) {

    }
    apiUrl = environment.dossiarApiUrl;
    updateUserEmail(user: object): Observable<any> {
        return this.http.put(`${this.apiUrl}/UserMaster/UserMasterEmailId_Update`, user);

    }
    updateUserMobile(user: object): Observable<any> {
        return this.http.put(`${this.apiUrl}/UserMaster/UserMasterMobileNo_Update`, user);

    }
    updateUserPassword(user: object): Observable<any> {
        return this.http.put(`${this.apiUrl}/UserMaster/UserMasterChangePassword_Update`, user);

    }

}
