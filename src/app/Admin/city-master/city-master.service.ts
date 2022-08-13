import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { CityMaster, CityMasterList } from '../../mainsite/models/city-master';
import { environment } from 'src/environments/environment';
import { delay } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CityMasterService {

  constructor(private http: HttpClient) {

  }
  apiUrl = environment.dossiarApiUrl;

  // // // // //
  getCityList(): Observable<CityMasterList[]> {
    return this.http.get<CityMasterList[]>(`${this.apiUrl}/CityMaster`);
  }
  // // // // //

  saveCity(cityMaster: object, formType: string): Observable<any> {
    if (formType == "Submit") {

      return this.http.post(`${this.apiUrl}/CityMaster`, cityMaster);
    }

    else {

      return this.http.put(`${this.apiUrl}/CityMaster`, cityMaster);

    }
  }

  // // // // //
  updateCity(cityMaster: object): Observable<any> {
    return this.http.put(`${this.apiUrl}/CityMaster`, cityMaster);
  }
  // // // // //

  getActiveCityList(): Observable<CityMaster[]> {
    return this.http.get<CityMaster[]>(`${this.apiUrl}/CityMaster/GetAllActiveCities`);

  }
  
  getActiveCityListForOpen(): Observable<CityMaster[]> {
    return this.http.get<CityMaster[]>(`${this.apiUrl}/GetAllActiveCities`);

  }
  CityMaster_SelectAll_ActiveLikeSearch(vGeneric): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/CityMaster_SelectAll_ActiveLikeSearch/${vGeneric}`);

  }
  //#endregion CDE Services.

  //==================== view and update ==================

 
}
