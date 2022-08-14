import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrgMobnoAndEmailIdService {

  constructor(private http: HttpClient) {

  }
  apiUrl = environment.dossiarApiUrl;
  getOrgMobileNoAndEmailId(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/OrgMobileNoAndEmailId`);

}

updateOrgMobileNoAndEmailId(OrgMobileNoAndEmailIdDetails: object, formType: String): Observable<any> {
      if (formType == "Submit") {
          return this.http.post(`${this.apiUrl}/OrgMobileNoAndEmailId`,OrgMobileNoAndEmailIdDetails);
      }

      else {
          return this.http.put(`${this.apiUrl}/OrgMobileNoAndEmailId`,OrgMobileNoAndEmailIdDetails);
          
      }
  }
}
