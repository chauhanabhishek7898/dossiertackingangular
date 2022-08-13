import { Injectable } from '@angular/core';
import { UserMaster } from 'src/app/main-site/models/user';

@Injectable({
    providedIn: 'root'
})
export class AdminStorageService {
    constructor() { }

    set loginAdmindetails(admin: UserMaster) {
        localStorage.setItem('nAdUserId', admin.nUserId.toString());
        localStorage.setItem('nAdRoleId', admin.nRoleId.toString());
        if(admin.vEmailId){
            localStorage.setItem('vAdEmailId', admin.vEmailId.toString());
        }
        localStorage.setItem('vAdUserName', admin.vUserName.toString());
        
        localStorage.setItem('vAdMobileNo', admin.vMobileNo.toString());
        localStorage.setItem('vAdFullName', admin.vFullName.toString());

    }

    set setMemberToken(value) {
        localStorage.setItem('token', value);
    }
    get getMemberToken() {
        return localStorage.getItem('token')?.toString();;
    }

    set AdminUserRememberMe(value) {
        localStorage.setItem('isRememberMe', value);
    }
    set AdminSetRememberMe(value) {
        localStorage.setItem('uRemberMe', value);
    }
    get isAdminUserRemberMe() {
        return localStorage.getItem('isRememberMe')?.toString();;
    }
    get getRememberMeAdminUser() {
        return localStorage.getItem('uRemberMe')?.toString();;
    }
    get isAdminLogedIn() {
        return !!localStorage.getItem('vAdUserName');
    }
    get adminEmail() {
        return localStorage.getItem('vAdEmailId')?.toString();
    }
    get adminId() {
        return localStorage.getItem('nAdUserId')?.toString();
    }
    get adminName() {
        return localStorage.getItem('vAdFullName')?.toString();
    }
    get adminMobile() {
        return localStorage.getItem('vAdMobileNo')?.toString();
    }
    get adminRoleId() {
        return localStorage.getItem('nAdRoleId')?.toString();
    }
    logout() {

        localStorage.removeItem('nAdUserId');
        localStorage.removeItem('nAdRoleId');
        localStorage.removeItem('vAdEmailId');
        localStorage.removeItem('vAdMobileNo');
        localStorage.removeItem('vAdFullName');
        localStorage.removeItem('vAdUserName');
        localStorage.removeItem('token');
    }
}