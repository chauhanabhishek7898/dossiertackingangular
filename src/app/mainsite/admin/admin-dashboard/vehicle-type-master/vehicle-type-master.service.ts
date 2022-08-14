import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VehicleTypeMasterService {
  constructor(private http: HttpClient) {

  }
  apiUrl = environment.dossiarApiUrl;
  VehicleTypeMaster_SelectAll(): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/VehicleTypeMaster/VehicleTypeMaster_SelectAll`);

  }
  VehicleTypeMaster(vehicleTypeMaster: object, formType: String): Observable<any> {
      if (formType == "Submit") {
          return this.http.post(`${this.apiUrl}/VehicleTypeMaster`, vehicleTypeMaster);
      }

      else {
          return this.http.put(`${this.apiUrl}/VehicleTypeMaster`, vehicleTypeMaster);
          
      }
  }

}
