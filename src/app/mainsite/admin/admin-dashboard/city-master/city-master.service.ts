import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { CityMaster, CityMasterList } from '../../../models/city-master';
import { environment } from 'src/environments/environment';
import { delay } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CityMasterService {

  constructor(private http: HttpClient) {

  }
  apiUrl = environment.dossiarApiUrl;


  saveCity(cityMaster: object, formType: string): Observable<any> {
    if (formType == "Submit") {

      return this.http.post(`${this.apiUrl}/CityMaster`, cityMaster);
    }

    else {

      return this.http.put(`${this.apiUrl}/CityMaster`, cityMaster);

    }
  }

  getActiveCityList(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/CityMaster`);

  }
  
  CityMaster_SelectAll_ActiveLikeSearch(vGeneric): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/CityMaster/CityMaster_SelectAll_ActiveLikeSearch/${vGeneric}`);

  }
  GetMainInterrelatedCities(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/CityMaster/GetMainInterrelatedCities`);

  }
  //#endregion CDE Services.

  //==================== view and update ==================

 
}
