import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CustomerDetailsMasterService {
  constructor(private http: HttpClient) {}
  apiUrl = environment.dossiarApiUrl;
  GetCustomerMasterByUserId(vGeneric): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/CustomerMaster/GetCustomerDetailsForAdmin/${vGeneric}`
    );
  }
  ActivateRevokeRightsOfCustomer(updateActivateUserMaster: object): Observable<any> {
    return this.http.put(`${this.apiUrl}/CustomerMaster/ActivateRevokeRightsOfCustomer`, updateActivateUserMaster);
  }
}
