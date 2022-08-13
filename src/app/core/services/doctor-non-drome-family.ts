import { Injectable } from '@angular/core';
import { UserMaster } from 'src/app/main-site/models/user';

@Injectable({
    providedIn: 'root'
})
export class DoctorNonDromeFamilyStorageService {
    constructor() { }

    set loginDNddetails(admin: UserMaster) {
        localStorage.setItem('ndNdUserId', admin.nUserId.toString());
        localStorage.setItem('ndNdRoleId', admin.nRoleId.toString());
        if(admin.vEmailId){
            localStorage.setItem('vdNdEmailId', admin.vEmailId.toString());
        }
        localStorage.setItem('vdNdUserName', admin.vUserName.toString());
        
        localStorage.setItem('vdNdMobileNo', admin.vMobileNo.toString());
        localStorage.setItem('vdNdFullName', admin.vFullName.toString());
    }

    set setMemberToken(value) {
        localStorage.setItem('nddtoken', value);
    }
    get getMemberToken() {
        return localStorage.getItem('nddtoken')?.toString();;
    }

    set dNdUserRememberMe(value) {
        localStorage.setItem('isRememberMe', value);
    }
    set dNdSetRememberMe(value) {
        localStorage.setItem('uRemberMe', value);
    }
    get isdNdAdminUserRemberMe() {
        return localStorage.getItem('isRememberMe')?.toString();;
    }
    get getRememberMedNdAdminUser() {
        return localStorage.getItem('uRemberMe')?.toString();;
    }

    get isdNdAdminLogedIn() {
        return !!localStorage.getItem('vdNdUserName');
    }
    get dNdadminEmail() {
        return localStorage.getItem('vdNdEmailId')?.toString();
    }
    get dNdadminId() {
        return localStorage.getItem('ndNdUserId')?.toString();
    }
    get dNdadminName() {
        return localStorage.getItem('vdNdFullName')?.toString();
    }
    get dNdadminMobile() {
        return localStorage.getItem('vdNdMobileNo')?.toString();
    }
    get dNdadminRoleId() {
        return localStorage.getItem('ndNdRoleId')?.toString();
    }
    logout() {

        localStorage.removeItem('ndNdUserId');
        localStorage.removeItem('ndNdRoleId');
        localStorage.removeItem('vdNdEmailId');
        localStorage.removeItem('vdNdMobileNo');
        localStorage.removeItem('vdNdFullName');
        localStorage.removeItem('vdNdUserName');
        localStorage.removeItem('token');
    }
}