import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VehicleRateMasterService {
  constructor(private http: HttpClient) {

  }
  apiUrl = environment.dossiarApiUrl;
  VehicleRateMaster_SelectAll(): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/VehicleRateMaster/VehicleRateMaster_SelectAll`);

  }
 
  VehicleRateMaster(vehicleRateMaster: object, formType: String): Observable<any> {
      if (formType == "Submit") {
          return this.http.post(`${this.apiUrl}/VehicleRateMaster`, vehicleRateMaster);
      }

      else {
          return this.http.put(`${this.apiUrl}/VehicleRateMaster`, vehicleRateMaster);
          
      }
  }
}
