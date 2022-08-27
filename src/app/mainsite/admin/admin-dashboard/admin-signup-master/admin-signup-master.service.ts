import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminSignupMasterService {

  constructor(private http: HttpClient) {
  }
  apiUrl = environment.dossiarApiUrl;

  PostCreateAdmin(CreateAdmin){
    return this.http.post(`${this.apiUrl}/UserMaster/AdminSignUp_Insert`, CreateAdmin);
  }
  CorporateAssistantSignUp_Insert(CreateAdmin){
    return this.http.post(`${this.apiUrl}/CorporateMaster/CorporateAssistantSignUp_Insert`, CreateAdmin);
  }
}
