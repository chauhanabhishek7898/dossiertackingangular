import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KMLimitMasterService {
  constructor(private http: HttpClient) {

  }
  apiUrl = environment.dossiarApiUrl;
  KMLimitMaster_SelectAll(): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/KMLimitMaster/KMLimitMaster_SelectAll`);

  }
 
  KMLimitMaster(KMLimitMaster: object, formType: String): Observable<any> {
      if (formType == "Submit") {
          return this.http.post(`${this.apiUrl}/KMLimitMaster`, KMLimitMaster);
      }

      else {
          return this.http.put(`${this.apiUrl}/KMLimitMaster`, KMLimitMaster);
          
      }
  }
}
