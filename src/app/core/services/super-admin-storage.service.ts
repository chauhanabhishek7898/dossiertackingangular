import { Injectable } from '@angular/core';
import { UserMaster } from 'src/app/main-site/models/user';

@Injectable({
    providedIn: 'root'
})
export class SuperAdminStorageService {
    constructor() { }

    set loginSuperAdmindetails(admin: UserMaster) {
        localStorage.setItem('nSAdUserId', admin.nUserId.toString());
        localStorage.setItem('nSAdRoleId', admin.nRoleId.toString());
        if(admin.vEmailId){
            localStorage.setItem('vSAdEmailId', admin.vEmailId.toString());
        }
        localStorage.setItem('vSAdUserName', admin.vUserName.toString());
        
        localStorage.setItem('vSAdMobileNo', admin.vMobileNo.toString());
        localStorage.setItem('vSAdFullName', admin.vFullName.toString());

    }
    set setMemberToken(value) {
        localStorage.setItem('token', value);
    }
    get getMemberToken() {
        return localStorage.getItem('token')?.toString();;
    }

    set SpUserRememberMe(value) {
        localStorage.setItem('isRememberMe', value);
    }
    set SpSetRememberMe(value) {
        localStorage.setItem('uRemberMe', value);
    }
    get isSpAdminUserRemberMe() {
        return localStorage.getItem('isRememberMe')?.toString();;
    }
    get getRememberMeSpAdminUser() {
        return localStorage.getItem('uRemberMe')?.toString();;
    }
    get isSAdminLogedIn() {
        return !!localStorage.getItem('vSAdUserName');
    }
    get sadminEmail() {
        return localStorage.getItem('vSAdEmailId')?.toString();
    }
    get sadminId() {
        return localStorage.getItem('nSAdUserId')?.toString();
    }
    get sadminName() {
        return localStorage.getItem('vSAdFullName')?.toString();
    }
    get sadminMobile() {
        return localStorage.getItem('vSAdMobileNo')?.toString();
    }
    get sadminRoleId() {
        return localStorage.getItem('nSAdRoleId')?.toString();
    }
    logout() {

        localStorage.removeItem('nSAdUserId');
        localStorage.removeItem('nSAdRoleId');
        localStorage.removeItem('vSAdEmailId');
        localStorage.removeItem('vSAdMobileNo');
        localStorage.removeItem('vSAdFullName');
        localStorage.removeItem('vSAdUserName');
    }
}