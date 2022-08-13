import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map} from "rxjs/operators";
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserValidationService {

    constructor(private http: HttpClient) {

    }
    apiUrl = environment.dromeApiUrl;
    checkUsersOldPassword(password: string,userId: number,): Observable<any> {
        return this.http.get(`${this.apiUrl}/UserMaster/CheckUsersOldPassword/${password}/${userId}`)
    }
    checkExistsMobileNo(mobileNumber: string, roleId: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/UserMaster/CheckExistsMobileNo/${mobileNumber}/${roleId}`)
    }
    CheckExistsEmailId(emailId: string, roleId: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/UserMaster/CheckExistsEmailId/${emailId}/${roleId}`)
    }
    CheckExistsUserName(vUserName: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/UserMaster/CheckExistsUsername/${vUserName}`)
    }
    CheckExistsLicenseNo(vLicenseNo: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/UserMaster/CheckExistsLicenseNo/${vLicenseNo}`)
    }
    GetAge(dtDOB): Observable<any> {
        return this.http.get(`${this.apiUrl}/UserMaster/GetAge/${dtDOB}`)
    }
      
}
