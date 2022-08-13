import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {

  constructor(private http: HttpClient) { }
  apiUrl = environment.dossiarApiUrl;
  getProfileDetailsByUserId(userId): Observable<any> {
    return this.http.get(`${this.apiUrl}/UserMaster/GetProfileDetails/${userId}`);
  }
}
