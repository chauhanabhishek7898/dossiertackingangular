import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DriverDetailsAdminService {

  constructor(private http: HttpClient) {

  }
  apiUrl = environment.dossiarApiUrl;
  getDoctorList(vGeneric:any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/DriverMaster/DriverMaster_SelectAll/${vGeneric}`);
  }
  getDriverDetailsByUserId(nDriverUserId:any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/DriverMaster/GetDriverByUserId/${nDriverUserId}`);
  }
  getDriverCurrentLocation(nDriverUserId:any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/DriverMaster/GetDriver_CurrentLocation/${nDriverUserId}`);
  }
  DriverMasterUpdate(DriverMasterSave: object, file1: File,file2: File, file3: File,file4: File,file5: File,file6: File): Observable<any> {
    // if(FormType == "Submit"){
      console.log('file1',file1)
      console.log('file2',file2)
      console.log('file3',file3)
      console.log('file4',file4)
      console.log('file5',file5)
      console.log('file6',file6)
      const formDataAdd = new FormData();
      formDataAdd.append("AadharNoFile", file1);
      formDataAdd.append("PANNoFile", file2);
      formDataAdd.append("DriverPhotoFile", file3);
      formDataAdd.append("LicenseFile", file4);
      formDataAdd.append("VehicleRegFile", file5);
      formDataAdd.append("VehicleInsuranceFile", file6);
     
      formDataAdd.append("DriverMaster", JSON.stringify(DriverMasterSave));
      return this.http.put(`${this.apiUrl}/DriverMaster`, formDataAdd);
  }
  UpdateDriverSupervisorStatus(data: object): Observable<any> {
      return this.http.put(`${this.apiUrl}/DriverMaster/UpdateDriverSupervisorStatus`, data);
  }
  // ActivateRevokeDoctorPraticeWithDrome(DriverMaster:object): Observable<any> {
  //   return this.http.put<any>(`${this.apiUrl}/DriverMaster/ActivateRevokeDoctorPraticeWithDrome`,DriverMaster);
  // }
}
