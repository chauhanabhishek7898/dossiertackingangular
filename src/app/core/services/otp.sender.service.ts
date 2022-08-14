import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
    providedIn: 'root'
})
export class OtpSender {

    constructor(private http: HttpClient) {

    }
    apiUrl = environment.dossiarApiUrl;
    sendOtpToMobileAndEmail(mobileNo: string, email: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/Utility/SendOtpToMobileAndEmail/?m=${mobileNo}&e=${email}`)
    }
    SendOtpToMobileAndEmailToChangePW(mobileNo: string, email: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/Utility/SendOtpToMobileAndEmailToChangePW/?m=${mobileNo}&e=${email}`)
    }
    SendOtpToMobileAndEmailForCustodianRights(mobileNo: string, email: string,nUserId:number): Observable<any> {
        return this.http.get(`${this.apiUrl}/Utility/SendOtpToMobileAndEmailForCustodianRights/?m=${mobileNo}&e=${email}&nUserId=${nUserId}`)
    }
    SendOtpToMobileAndEmailForCCRights(mobileNo: string, email: string,nUserId:number): Observable<any> {
        return this.http.get(`${this.apiUrl}/Utility/SendOtpToMobileAndEmailForCCRights/?m=${mobileNo}&e=${email}&nUserId=${nUserId}`)
    }
    SendOtpToMobileAndEmailForInstitute(mobileNo: string, email: string,nLoggedInUserId:number,nDoctorUserId): Observable<any> {
        return this.http.get(`${this.apiUrl}/Utility/SendOtpToMobileAndEmailForInstitute/?m=${mobileNo}&e=${email}&nLoggedInUserId=${nLoggedInUserId}&nDoctorUserId=${nDoctorUserId}`)
    }
    
    SendOtpToMobileAndEmailForEntity(mobileNo: string, email: string,nLoggedInUserId:number,nPatientUserId): Observable<any> {
        return this.http.get(`${this.apiUrl}/Utility/SendOtpToMobileAndEmailForEntity/?m=${mobileNo}&e=${email}&nLoggedInUserId=${nLoggedInUserId}&nPatientUserId=${nPatientUserId}`)
    }
    sendOtpToMobile(mobileNo: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/Utility/SendOtpToMobleToChangeMobileNo/${mobileNo}`)
    }
    SendOtpToMobleToChangeMobileNo(mobileNo: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/Utility/SendOtpToMobleToChangeMobileNo/${mobileNo}`)
    }
    sendOtpToEmail(email: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/Utility/SendOtpToEmailToChangeEmailId/${email}`)
    }
    SendOtpToEmailToChangeEmailId(email: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/Utility/SendOtpToEmailToChangeEmailId/${email}`)
    }

}
