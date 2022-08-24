import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomersSavedAddressesService {

  constructor(private http: HttpClient) {

  }
  apiUrl = environment.dossiarApiUrl;
  getDoctorList(vGeneric:any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/CustomerMaster/GetCustomerSavedAddressForAdmin/${vGeneric}`);
  }}
