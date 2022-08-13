import { Injectable } from '@angular/core';
import { UserMaster } from 'src/app/main-site/models/user';

@Injectable({
    providedIn: 'root'
})
export class ClinicCoodinatorStorageService {
    constructor() { }

    set loginClinicdetails(admin: UserMaster) {
        localStorage.setItem('nclUserId', admin.nUserId.toString());
        localStorage.setItem('nclRoleId', admin.nRoleId.toString());
        if(admin.vEmailId){
            localStorage.setItem('vclEmailId', admin.vEmailId.toString());
        }
        localStorage.setItem('vclUserName', admin.vUserName.toString());

        localStorage.setItem('vclMobileNo', admin.vMobileNo.toString());
        localStorage.setItem('vclFullName', admin.vFullName.toString());
    }

    set setMemberToken(value) {
        localStorage.setItem('token', value);
    }
    get getMemberToken() {
        return localStorage.getItem('token')?.toString();;
    }

    set clUserRememberMe(value) {
        localStorage.setItem('isRememberMe', value);
    }
    set clSetRememberMe(value) {
        localStorage.setItem('uRemberMe', value);
    }
    get isclAdminUserRemberMe() {
        return localStorage.getItem('isRememberMe')?.toString();;
    }
    get getRememberMeclAdminUser() {
        return localStorage.getItem('uRemberMe')?.toString();;
    }

    get isCCAdminLogedIn() {
        return !!localStorage.getItem('vclUserName');
    }
    get adminEmail() {
        return localStorage.getItem('vclEmailId')?.toString();
    }
    get adminId() {
        return localStorage.getItem('nclUserId')?.toString();
    }
    get adminName() {
        return localStorage.getItem('vclFullName')?.toString();
    }
    get adminMobile() {
        return localStorage.getItem('vclMobileNo')?.toString();
    }
    get adminRoleId() {
        return localStorage.getItem('nclRoleId')?.toString();
    }
    logout() {

        localStorage.removeItem('nclUserId');
        localStorage.removeItem('nclRoleId');
        localStorage.removeItem('vclEmailId');
        localStorage.removeItem('vclMobileNo');
        localStorage.removeItem('vclFullName');
        localStorage.removeItem('vclUserName');
        localStorage.removeItem('token');
    }
}