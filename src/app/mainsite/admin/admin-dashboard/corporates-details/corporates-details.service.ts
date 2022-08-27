import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CorporatesDetailsService {

  constructor(private http: HttpClient) {

  }
  apiUrl = environment.dossiarApiUrl;
  GetCorporateDetailsForAdmin(vGeneric:any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/CorporateMaster/GetCorporateDetailsForAdmin/${vGeneric}`);
  }
  GetCorporateDetailsForAdmins(nUserId): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/CorporateMaster/CorporateMaster_SelectBynEId/${nUserId}`);
  }
  GetUserDetailsByUserId(nUserId): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/UserMaster/GetUserDetailsByUserId/${nUserId}`);
  }
}