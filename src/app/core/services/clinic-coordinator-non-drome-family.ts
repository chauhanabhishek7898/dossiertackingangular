import { Injectable } from '@angular/core';
import { UserMaster } from 'src/app/main-site/models/user';

@Injectable({
    providedIn: 'root'
})
export class ClinicCoodinatorNonDromeFamilyStorageService {
    constructor() { }

    set loginclNddetails(admin: UserMaster) {
        localStorage.setItem('nclNdUserId', admin.nUserId.toString());
        localStorage.setItem('nclNdRoleId', admin.nRoleId.toString());
        if (admin.vEmailId) {
            localStorage.setItem('vclNdEmailId', admin.vEmailId.toString());
        }
        localStorage.setItem('vclNdUserName', admin.vUserName.toString());

        localStorage.setItem('vclNdMobileNo', admin.vMobileNo.toString());
        localStorage.setItem('vclNdFullName', admin.vFullName.toString());
    }

    set setMemberToken(value) {
        localStorage.setItem('ccndtoken', value);
    }
    get getMemberToken() {
        return localStorage.getItem('ccndtoken')?.toString();;
    }

    set clNdUserRememberMe(value) {
        localStorage.setItem('isRememberMe', value);
    }
    set clNdSetRememberMe(value) {
        localStorage.setItem('uRemberMe', value);
    }
    get isclNdAdminUserRemberMe() {
        return localStorage.getItem('isRememberMe')?.toString();;
    }
    get getRememberMeclNdAdminUser() {
        return localStorage.getItem('uRemberMe')?.toString();;
    }

    get isclNdAdminLogedIn() {
        return !!localStorage.getItem('vclNdUserName');
    }
    get clNdadminEmail() {
        return localStorage.getItem('vclNdEmailId')?.toString();
    }
    get clNdadminId() {
        return localStorage.getItem('nclNdUserId')?.toString();
    }
    get clNdadminName() {
        return localStorage.getItem('vclNdFullName')?.toString();
    }
    get clNdadminMobile() {
        return localStorage.getItem('vclNdMobileNo')?.toString();
    }
    get clNdadminRoleId() {
        return localStorage.getItem('nclNdRoleId')?.toString();
    }
    logout() {

        localStorage.removeItem('nclNdUserId');
        localStorage.removeItem('nclNdRoleId');
        localStorage.removeItem('vclNdEmailId');
        localStorage.removeItem('vclNdMobileNo');
        localStorage.removeItem('vclNdFullName');
        localStorage.removeItem('vclNdUserName');
        localStorage.removeItem('token');
    }
}