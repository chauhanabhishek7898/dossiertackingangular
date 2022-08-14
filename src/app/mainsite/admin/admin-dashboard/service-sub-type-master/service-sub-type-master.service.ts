import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceSubTypeMasterService {
  constructor(private http: HttpClient) {

  }
  apiUrl = environment.dossiarApiUrl;
  ServiceSubTypeMaster_SelectAll(): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/ServiceSubTypeMaster/ServiceSubTypeMaster_SelectAll`);

  }
  ServiceSubTypeMaster(ServiceTypeMaster: object, formType: String): Observable<any> {
      if (formType == "Submit") {
          return this.http.post(`${this.apiUrl}/ServiceSubTypeMaster`, ServiceTypeMaster);
      }

      else {
          return this.http.put(`${this.apiUrl}/ServiceSubTypeMaster`, ServiceTypeMaster);
          
      }
  } 
}
