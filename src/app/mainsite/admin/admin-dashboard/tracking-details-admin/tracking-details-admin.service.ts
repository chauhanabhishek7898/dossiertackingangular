import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrackingDetailsAdminService {

  constructor(private http: HttpClient) {

  }
  apiUrl = environment.dossiarApiUrl;

  GetBuyCreditsSA(FromDt,ToDt,vGeneric): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/TrackingDetails/GetTrackingDetailsForAdmin/${FromDt}/${ToDt}/${vGeneric}`);

  }
}
