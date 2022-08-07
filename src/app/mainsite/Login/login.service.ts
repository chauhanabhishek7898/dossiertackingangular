import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}

  apiUrl = environment.dossiarApiUrl;

  checkExistsMobileNo(vMobileNo: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/UserMaster/CheckExistsMobileNo/${vMobileNo}`)
}
GetOTPMsgSMSVerifyMobile(mobileNumber): Observable<any> {
    return this.http.get(`${this.apiUrl}/Utility/GetOTPMsgSMSVerifyMobile/${mobileNumber}`)
}

  loginAndGetUserDetailsByvUserNameOrvPassword(
    vUserName: string,
    vPassword: string
  ): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/UserMaster/GetUserDetailsUsingUNandPW/${vUserName}/${vPassword}`
    );
  }
}
