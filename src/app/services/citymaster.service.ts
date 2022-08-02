import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CitymasterService {
  constructor(private http: HttpClient) {}
  apiUrl = environment.dromeApiUrl;

  getCityDetailsByCityName(vGeneric: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/CityMaster/CityMaster_SelectAll_ActiveLikeSearch/${vGeneric}`
    );
  }
}
