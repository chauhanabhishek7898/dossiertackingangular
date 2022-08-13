
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StateMaster, stateMasterList } from '../../mainsite/models/state.model';
import { CountryMaster } from '../../mainsite/models/counntry.model';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class StateService {

    constructor(private http: HttpClient) {

    }
    apiUrl = environment.dossiarApiUrl;
    getStateList(): Observable<stateMasterList[]> {
        return this.http.get<stateMasterList[]>(`${this.apiUrl}/StateMaster`);

    }
    getCountryList(): Observable<CountryMaster[]> {
        return this.http.get<CountryMaster[]>(`${this.apiUrl}/CountryMaster`);

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
    getActiveStateList(): Observable<StateMaster[]> {
        return this.http.get<StateMaster[]>(`${this.apiUrl}/StateMaster/GetAllActiveStates`);

    }
    //#endregion CDE Services.
}

