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
  GetCityIdAgainstCityName(vCityName): Observable<any> {
    return this.http.get(`${this.apiUrl}/CityMaster/GetCityIdAgainstCityName/${vCityName}`)
  }

  PostCreateUserCustomer(postCreateCustomers){
    // const formData = new FormData();
    // // Store form name as "file" with file data
    // formData.append("AadharNoFile", AadharNoFile);
    // // formData.append("fileSize", fileSize);
    // formData.append("CustomerMaster", JSON.stringify(postCreateCustomers));
    return this.http.post(`${this.apiUrl}/CustomerMaster`, postCreateCustomers);
  }

}
