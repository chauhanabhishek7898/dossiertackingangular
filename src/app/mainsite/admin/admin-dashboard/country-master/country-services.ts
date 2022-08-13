
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CountryService {

    constructor(private http: HttpClient) {

    }
    apiUrl = environment.dossiarApiUrl;
    getCountryList(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/CountryMaster`);

    }
    saveCountry(countryMaster: object, formType: String): Observable<any> {
        if (formType == "Submit") {
            return this.http.post(`${this.apiUrl}/CountryMaster`, countryMaster);
        }

        else {
            return this.http.put(`${this.apiUrl}/CountryMaster`, countryMaster);
            
        }
    }
    updateCountry(countryMaster: object): Observable<any> {
        return this.http.put(`${this.apiUrl}/CountryMaster`, countryMaster);
    }

    //#endregion country Services.
}

