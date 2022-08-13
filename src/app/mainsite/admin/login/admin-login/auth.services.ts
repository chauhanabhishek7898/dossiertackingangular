import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';


@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private http: HttpClient) {

    }
    apiUrl = environment.dossiarApiUrl;
    registerUser(user: object): Observable<any> {
        return this.http.post(`${this.apiUrl}/UserMaster`, user);
    }
    PostCreateUserDoctors(postCreateUserDoctors: object, file: File, fileSize): Observable<any> {

        const formData = new FormData();


        // Store form name as "file" with file data
        formData.append("imageFile", file);
        formData.append("fileSize", fileSize);
        formData.append("UserMaster", JSON.stringify(postCreateUserDoctors));
        return this.http.post(`${this.apiUrl}/UserMaster/PostCreateUserDoctors`, formData);

    }

    sendOtp(userMobileNo: string, userEmail: string = ""): Observable<any> {
        if (userMobileNo) {
            return this.http.get(`${this.apiUrl}/Utility/SendOtpToMobleToChangeMobileNo/${userMobileNo}`);
        } else {
            return this.http.get(`${this.apiUrl}/Utility/SendOtpToEmailToChangeEmailId/${userEmail}`);
        }
    }
    verifiedUserEmailByToken(user: object): Observable<any> {
        return this.http.put(`${this.apiUrl}/UserMaster/UserMasterVerifyEmailId_Update`, user);
    }
    //Deprecated
    loginByUNandPw(nRoleId: number, vMobileNoOrEmailId: string, vPassword: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/UserMaster/GetUserDetailsUsingUNandPW/${nRoleId}/${vMobileNoOrEmailId}/${vPassword}`);
    }
    loginByvUserNameOrMemberCode(vUserName, vPassword): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/UserMaster/GetUserDetailsUsingUNandPW/${vUserName}/${vPassword}`);
    }
    getUserDetailsByMobOrEmail(nRoleId: number, vMobileNoOrEmailId: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/UserMaster/GetUserDetails/${nRoleId}/${vMobileNoOrEmailId}`);
    }
    // loginToOtp(nRoleId: number, vMobileNoOrEmailId: string, isOTPOnMobile: boolean, isOTPOnEmail: boolean): Observable<any> {
    //     return this.http.get(`${this.apiUrl}/Utility/SendOtpToMobileOrEmail/${nRoleId}/${vMobileNoOrEmailId}/${isOTPOnMobile}/${isOTPOnEmail}`);
    // }
    loginToOtp(vMobileNoOrEmailId: string, isOTPOnMobile: boolean, isOTPOnEmail: boolean): Observable<any> {
        return this.http.get(`${this.apiUrl}/Utility/SendOtpToMobileOrEmailByUNorMC/${vMobileNoOrEmailId}/${isOTPOnMobile}/${isOTPOnEmail}`);
    }
    SendOtpToMobileOrEmailByUNorMCFP(vMobileNoOrEmailId: string, isOTPOnMobile: boolean, isOTPOnEmail: boolean): Observable<any> {
        return this.http.get(`${this.apiUrl}/Utility/SendOtpToMobileOrEmailByUNorMCFP/${vMobileNoOrEmailId}/${isOTPOnMobile}/${isOTPOnEmail}`);
    }
    // userMasterForgetPassword(user: object): Observable<any> {
    //     return this.http.put(`${this.apiUrl}/UserMaster/UserMasterForgetPassword`, user);
    // }
    userMasterForgetPassword(user: object): Observable<any> {
        return this.http.put(`${this.apiUrl}/UserMaster/UserMasterForgetPasswordUsingUserIdorMemberCode`, user);
    }
    getUserDetailsByUserId(nUserId: number,vDeviceId): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/UserMaster/GetUserDetailsByUserId/${nUserId}/${vDeviceId}`);
    }
    
}