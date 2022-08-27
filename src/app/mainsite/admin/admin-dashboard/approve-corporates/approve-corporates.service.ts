import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApproveCorporatesService {
  constructor(private http: HttpClient) {

  }
  apiUrl = environment.dossiarApiUrl;
  ForApprovalNewCorporates(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/CorporateMaster/ForApprovalNewCorporates`);
  }
  ApproveCorporates(data): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/CorporateMaster/ApproveCorporates/`,data);
  }
}
