import { Injectable } from '@angular/core';
import { UserMaster } from '../mainsite/models/user';
import * as CryptoJS from 'crypto-js';
@Injectable({
    providedIn: 'root'
})
export class StorageService {
    constructor() { }
    tokenFromUI: string = "0123456789123456";
    set loginUserdetails(user: UserMaster) {
        localStorage.setItem('nUserId', this.encryptUsingAES256(user.nUserId.toString()));
        localStorage.setItem('nRoleId', this.encryptUsingAES256(user.nRoleId.toString()));
        if (user.vEmailId) {
            localStorage.setItem('vEmailId', this.encryptUsingAES256(user.vEmailId.toString()));
        }
        if (user.vMobileNo) {
            localStorage.setItem('vMobileNo', this.encryptUsingAES256(user.vMobileNo.toString()));
        }
        localStorage.setItem('vUserName', this.encryptUsingAES256(user.vUserName.toString()));
        // localStorage.setItem('vGender', this.encryptUsingAES256(user.vGender.toString()));

        localStorage.setItem('vFullName', this.encryptUsingAES256(user.vFullName.toString()));
        // localStorage.setItem('MobileNoCompany', this.encryptUsingAES256(user.MobileNoCompany.toString()));
        // localStorage.setItem('EmailIdCompany', this.encryptUsingAES256(user.EmailIdCompany.toString()));

    }
    set setCityId(value) {
        localStorage.setItem('nCityId', this.encryptUsingAES256(value));
    }
    set setHealthParameter(value) {
        localStorage.setItem('healthParm', value);
    }
    set setCityDetails(value) {
        localStorage.setItem('cityDetails', this.encryptUsingAES256(value));
    }
    set setvCountryName(value) {
        localStorage.setItem('vCountryName', this.encryptUsingAES256(value));
    }
    set setMemberToken(value) {
        localStorage.setItem('token', this.encryptUsingAES256(value));
    }
    
    set userRememberMe(value) {
        localStorage.setItem('isRememberMe', this.encryptUsingAES256(value));
    }

    set setRememberMe(value) {
        localStorage.setItem('uRemberMe', this.encryptUsingAES256(value));
    }
    set setMobileNoCompany(value) {
        localStorage.setItem('MobileNoCompany', this.encryptUsingAES256(value));
    }
    set setEmailIdCompany(value) {
        localStorage.setItem('EmailIdCompany', this.encryptUsingAES256(value));
    }
    set setMemberId(value) {
        localStorage.setItem('MemberId', this.encryptUsingAES256(value));
    }
    set setvGender(value) {
        localStorage.setItem('vGender', this.encryptUsingAES256(value));
    }
    get getMemberToken() {
        return this.decryptUsingAES256(localStorage.getItem('token')?.toString());
    }

    get isUserRemberMe() {
        return this.decryptUsingAES256(localStorage.getItem('isRememberMe')?.toString());
    }
    get getRememberMeUser() {
        return this.decryptUsingAES256(localStorage.getItem('uRemberMe')?.toString());
    }

    get isUserLogedIn() {
        return !!this.decryptUsingAES256(localStorage.getItem('vUserName'));
    }
    get userEmail() {
        return this.decryptUsingAES256(localStorage.getItem('vEmailId')?.toString());
    }
    get userUserName() {
        return this.decryptUsingAES256(localStorage.getItem('vUserName')?.toString());
    }
    get userId() {
        return this.decryptUsingAES256(localStorage.getItem('nUserId')?.toString());
    }
    get userName() {
        return this.decryptUsingAES256(localStorage.getItem('vFullName')?.toString());
    }
    get userMobile() {
        return this.decryptUsingAES256(localStorage.getItem('vMobileNo')?.toString());
    }
    get roleId() {
        return this.decryptUsingAES256(localStorage.getItem('nRoleId')?.toString());
    }
    get cityId() {
        return this.decryptUsingAES256(localStorage.getItem('nCityId')?.toString());
    }
    get cityDetails() {
        return this.decryptUsingAES256(localStorage.getItem('cityDetails')?.toString());
    }
    get vCountryName() {
        return this.decryptUsingAES256(localStorage.getItem('vCountryName')?.toString());
    }
    get MobileNoCompany() {
        return this.decryptUsingAES256(localStorage.getItem('MobileNoCompany')?.toString());
    }
    get EmailIdCompany() {
        return this.decryptUsingAES256(localStorage.getItem('EmailIdCompany')?.toString());
    }
    get MemberId() {
        return this.decryptUsingAES256(localStorage.getItem('MemberId')?.toString());
    }
    get vGender() {
        return this.decryptUsingAES256(localStorage.getItem('vGender')?.toString());
    }
    get getHealthParameter() {
        return localStorage.getItem('healthParm');
    }
    logout() {
        localStorage.removeItem('nUserId');
        localStorage.removeItem('nRoleId');
        localStorage.removeItem('vEmailId');
        localStorage.removeItem('vMobileNo');
        localStorage.removeItem('vFullName');
        localStorage.removeItem('vUserName');
        localStorage.removeItem('token');
        localStorage.removeItem('healthParm');
        localStorage.removeItem('MobileNoCompany');
        localStorage.removeItem('EmailIdCompany');
        localStorage.removeItem('MemberId');
        localStorage.removeItem('vGender');
    }
    encryptUsingAES256(value): string {
        let _key = CryptoJS.enc.Utf8.parse(this.tokenFromUI);
        let _iv = CryptoJS.enc.Utf8.parse(this.tokenFromUI);
        if (typeof value == "number") {
            value = JSON.stringify(value)
        }
        let encrypted = CryptoJS.AES.encrypt(
            value, _key, {
            keySize: 16,
            iv: _iv,
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.toString();
    }
    decryptUsingAES256(decryptedText): string {
        if (decryptedText) {
            let _key = CryptoJS.enc.Utf8.parse(this.tokenFromUI);
            let _iv = CryptoJS.enc.Utf8.parse(this.tokenFromUI);

            return CryptoJS.AES.decrypt(
                decryptedText, _key, {
                keySize: 16,
                iv: _iv,
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            }).toString(CryptoJS.enc.Utf8);

        }
        else {
            return decryptedText;
        }
    }
}