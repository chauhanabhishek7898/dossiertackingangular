import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApproveDriverMasterService {

  constructor(private http: HttpClient) {

  }
  apiUrl = environment.dossiarApiUrl;
  getUserList(vGeneric): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/DriverMaster/GetDrivers_ForApproval/${vGeneric}`);
}

updateRevokeUserDetial(updateRevokeUserMaster: object): Observable<any> {
  return this.http.put(`${this.apiUrl}/DriverMaster/RevokeUsersRight/`, updateRevokeUserMaster);
}
updateActivateUserDetial(updateActivateUserMaster: object): Observable<any> {
  return this.http.put(`${this.apiUrl}/DriverMaster/ApproveDrivers`, updateActivateUserMaster);
}
}
