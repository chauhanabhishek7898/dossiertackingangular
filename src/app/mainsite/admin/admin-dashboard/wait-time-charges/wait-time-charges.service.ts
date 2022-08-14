import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WaitTimeChargesService {
  constructor(private http: HttpClient) {

  }
  apiUrl = environment.dossiarApiUrl;
  WaitTimeCharges_SelectAll(): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/WaitTimeCharges/WaitTimeCharges_SelectAll`);

  }
 
  WaitTimeCharges(waitTimeCharges: object, formType: String): Observable<any> {
      if (formType == "Submit") {
          return this.http.post(`${this.apiUrl}/WaitTimeCharges`, waitTimeCharges);
      }

      else {
          return this.http.put(`${this.apiUrl}/WaitTimeCharges`, waitTimeCharges);
          
      }
  }
}
