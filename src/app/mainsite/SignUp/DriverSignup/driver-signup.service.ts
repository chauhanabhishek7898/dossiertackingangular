import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DriverSignupService {

  constructor(private http: HttpClient) {

  }
  apiUrl = environment.dossiarApiUrl;

  PostPLDetails(PharmacyDetails: object, file1: File,file2: File, file3: File,fileSize,file4: File): Observable<any> {
    // if(FormType == "Submit"){
      const formDataAdd = new FormData();
      formDataAdd.append("AuthorizedSignatoryFile", file1);
      formDataAdd.append("LogoFile", file2);
      formDataAdd.append("ShopPhotoFile", file3);
      formDataAdd.append("fileSize", fileSize);
      formDataAdd.append("LicenseFile", file4);
      formDataAdd.append("PLDetails", JSON.stringify(PharmacyDetails));
      return this.http.post(`${this.apiUrl}/Open`, formDataAdd);
  }
  
}
