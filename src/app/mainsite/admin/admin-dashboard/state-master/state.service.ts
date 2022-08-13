
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class StateService {

    constructor(private http: HttpClient) {

    }
    apiUrl = environment.dossiarApiUrl;
    getStateList(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/StateMaster`);

    }
    getCountryList(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/CountryMaster`);

    }
    saveState(stateMaster: object , formType: String): Observable<any> {
        if (formType == "Submit") {
            return this.http.post(`${this.apiUrl}/StateMaster`, stateMaster);
        }

        else {
            return this.http.put(`${this.apiUrl}/StateMaster`, stateMaster);
            
        }
    }
    updateState(stateMaster: object): Observable<any> {
        return this.http.put(`${this.apiUrl}/StateMaster`, stateMaster);

    }
    getActiveStateList(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/StateMaster/GetAllActiveStates`);

    }
    //#endregion CDE Services.
}

