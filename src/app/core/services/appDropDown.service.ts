import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
    providedIn: 'root'
})
export class AppDropDownService {

    constructor(private http: HttpClient) {

    }
    apiUrl = environment.dromeApiUrl;
    getCityDetailsByCityName(cityName: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/Open/CityMaster_SelectAll_ActiveLikeSearch/${cityName}`)
    }
    getCityDetailsByCityNameInner(cityName: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/CityMaster/CityMaster_SelectAll_ActiveLikeSearch/${cityName}`)
    }
    CityMaster_SelectAllForCredits_ActiveLikeSearch(cityName: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/CostPerCreditPoint/CityMaster_SelectAllForCredits_ActiveLikeSearch/${cityName}`)
    }
    getCityDetailsByCityNameOrg(cityName: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/CityMaster/CityMaster_SelectAll_ActiveLikeSearchForOrg/${cityName}`)
    }
    getSpecialistDetailsBySpecialistName(speciaList: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/Open/SpecialistMaster_SelectAll_ActiveLikeSearch/${speciaList}`)
    }
    GetPLDetailsLikeSearch(nRoleId,vGeneric: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/PLDetails/GetPLDetailsLikeSearch/${nRoleId}/${vGeneric}`)
    }
    getPatientByPatientName(userId : string,primaryPatientUser: string ): Observable<any> {
        return this.http.get(`${this.apiUrl}/PatientMaster/GetSecondaryPatientDetailsLikeSearch/${userId}/${primaryPatientUser}`, )
    }
    getClinicCodinatorName(nDoctorUserId : string,clinicCodinatorName: string ): Observable<any> {
        return this.http.get(`${this.apiUrl}/ClinicCoordinatorDoctorLinkage/GetCoordinatorForClinicCoordinatorDoctorLinkage_LikeSearch/${nDoctorUserId}/${clinicCodinatorName}`, )
    }
    getNonDromeClinicCodinatorName(nDoctorUserId : string,clinicCodinatorName: string ): Observable<any> {
        return this.http.get(`${this.apiUrl}/ClinicCoordinatorDoctorLinkage/GetCCForCCDoctorLinkage_LikeSearchND/${nDoctorUserId}/${clinicCodinatorName}`, )
    }
    getDoctorName(nClinicCoordinatorUserId : string,clinicCodinatorName: string ): Observable<any> {
        return this.http.get(`${this.apiUrl}/ClinicCoordinatorDoctorLinkage/GetDoctorForClinicCoordinatorDoctorLinkage_LikeSearch/${nClinicCoordinatorUserId}/${clinicCodinatorName}`, )
    }
    geNonDromeDoctorName(nClinicCoordinatorUserId : string,clinicCodinatorName: string ): Observable<any> {
        return this.http.get(`${this.apiUrl}/ClinicCoordinatorDoctorLinkage/GetDoctorForCCDoctorLinkage_LikeSearchND/${nClinicCoordinatorUserId}/${clinicCodinatorName}`, )
    }
    getNonDromeDoctorNameLikeSeaarch(DoctorName: string ): Observable<any> {
        return this.http.get(`${this.apiUrl}/ClinicCoordinatorDoctorLinkage/DM_sp_GetDoctorDetailsNDLikeSearch/${DoctorName}`, )
    }
    getDoctorTimeName(nClinicCoordinatorUserId : string,clinicCodinatorName: string ): Observable<any> {
        return this.http.get(`${this.apiUrl}/DoctorsTimeMaster/GetDoctorForClinicCoordinators_LikeSearch/${nClinicCoordinatorUserId}/${clinicCodinatorName}`, )
    }
    GetPatientDetailsLikeSearchForEntity(nLoggedInUserId,vGeneric): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/EntityMemberLinkage/GetPatientDetailsLikeSearchForEntity/${nLoggedInUserId}/${vGeneric}`);
      }
}
