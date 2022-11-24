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
        return this.http.put(`${this.apiUrl}/UserMaster/UserEmailId_Update`, user);

    }
    CorporateEmail_Update(user: object): Observable<any> {
        return this.http.put(`${this.apiUrl}/CorporateMaster/CorporateEmail_Update`, user);

    }
    CorporateMobileNo_Update(user: object): Observable<any> {
        return this.http.put(`${this.apiUrl}/CorporateMaster/CorporateMobileNo_Update`, user);

    }
    updateUserMobile(user: object): Observable<any> {
        return this.http.put(`${this.apiUrl}/UserMaster/UserMobileNo_Update`, user);

    }
    updateUserPassword(user: object): Observable<any> {
        return this.http.put(`${this.apiUrl}/UserMaster/UserChangePassword_Update`, user);

    }

}
