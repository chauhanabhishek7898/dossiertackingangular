import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OtpSenderApiService {

  constructor(private http: HttpClient) {}
  apiUrl = environment.dossiarApiUrl;


  SendOtpToVerifyMobileNo(mobileNumber: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/Utility/GetOTPMsgSMSVerifyMobile/${mobileNumber}`)
}
GetOTPMsgMailVerifyEmail(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/Utility/GetOTPMsgMailVerifyEmail/${email}`)
}
}
