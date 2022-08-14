import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceTypeMasterService {
  constructor(private http: HttpClient) {

  }
  apiUrl = environment.dossiarApiUrl;
  ServiceTypeMaster_SelectAll(): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/ServiceTypeMaster/ServiceTypeMaster_SelectAll`);

  }
  ServiceTypeMaster(ServiceTypeMaster: object, formType: String): Observable<any> {
      if (formType == "Submit") {
          return this.http.post(`${this.apiUrl}/ServiceTypeMaster`, ServiceTypeMaster);
      }

      else {
          return this.http.put(`${this.apiUrl}/ServiceTypeMaster`, ServiceTypeMaster);
          
      }
  } 
}
