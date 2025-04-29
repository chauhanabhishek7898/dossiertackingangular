export class ApproveDriverMaster {
    vRoleName: string
    nUserId: number;
    vFullName: string;
    vPassword: string;
    vMobileNo: string;
    vEmailId: string;
    btMobileVerified: boolean;
    btEmailVerified: boolean;
    btIsActive: true;
    btFromFacebook: boolean;
    btPromotion: boolean
    vUserName: string;
    vPasswordDec: string;
    vUserDetail: string;

}
export class DriverDetails {
    nDriverId: any;
    vDriverId: String;
    vVehicleType: String;
    DriverDetails: String;
    RegistrationDate: String;
    CityDetails: String;
    DOB: String;
    nVId: Number;
    vGender: String;
    dtDOB: String;
    nCityId: Number;
    vPresentAddress: String;
    vPermanentAddress: String;
    vAlternateNo: String;
    vLicenseNo: String;
    vLicenseNoFilePath: String;
    vAadhaarNo: String;
    vAadhaarNoFilePath: String;
    vPANNo: String;
    vPANNoFilePath: String;
    vVehicleRegistrationNo: String;
    vVehicleRegistrationNoFilePath: String;
    vVehicleInsuranceFilePath: String;
    vPhotoFilePath: String;
    vFullName: String;
    vMobileNo: String;
    vPassword: String;
    vEmailId: String;
    btPromotion: String;
    btIsActive: boolean;
    nUserId: number
}
export class ApproveDriverMasterList {
    nDriverId: any;
    vDriverId: String;
    vVehicleType: String;
    DriverDetails: String;
    RegistrationDate: String;
    CityDetails: String;
    DOB: String;
    nVId: Number;
    vGender: String;
    dtDOB: String;
    nCityId: Number;
    vPresentAddress: String;
    vPermanentAddress: String;
    vAlternateNo: String;
    vLicenseNo: String;
    vLicenseNoFilePath: String;
    vAadhaarNo: String;
    vAadhaarNoFilePath: String;
    vPANNo: String;
    vPANNoFilePath: String;
    vVehicleRegistrationNo: String;
    vVehicleRegistrationNoFilePath: String;
    vVehicleInsuranceFilePath: String;
    vPhotoFilePath: String;
    vFullName: String;
    vMobileNo: String;
    vPassword: String;
    vEmailId: String;
    btPromotion: String;
    btIsActive: boolean;
    btSupervisor: boolean;
    nUserId: number
}

export class GetCorporateAssistants {
    nCLinkId: number
    vFullName: string
    vMobileNo: string
    vEmailId: string
    MaskedMobileNo: string
    MaskedEmailId: string
    btActive: true
}
export class GetUsersDetails_Report {
    nUserId: number
    vFullName: string
    vUserName: string
    vPassword: string
    vMobileNo: string
    vEmailId: string
    nRoleId: number
    btActive: boolean
    btPromotion: boolean
    vAlias: string
    vPasswordDec: string
    MaskedMobileNo: string
    MaskedEmailId: string
}