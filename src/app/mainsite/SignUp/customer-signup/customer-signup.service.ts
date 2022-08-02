import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerSignupService {

  constructor(private http: HttpClient) { }

  apiUrl = environment.dossiarApiUrl;

  GetOTPMsgSMSVerifyMobile(mobileNumber): Observable<any> {
    return this.http.get(`${this.apiUrl}/Utility/GetOTPMsgSMSVerifyMobile/${mobileNumber}`)
  }
  GetOTPMsgMailVerifyEmail(email): Observable<any> {
    return this.http.get(`${this.apiUrl}/Utility/GetOTPMsgMailVerifyEmail/${email}`)
  }
}
