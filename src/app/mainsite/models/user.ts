
export class UserMaster {
    nUserId: number;
    vUserName: string;
    vRoleName: string;
    
    vFullName: string;
    vPassword: string;
    vMobileNo: string;
    vEmailId: string;
    vGender: string;
    btMobileVerified: boolean;
    btEmailVerified: boolean;
    nRoleId: number;
    btIsActive: boolean;
    btFromFacebook: boolean;
    btPromotion: boolean;
    vEmailVerificationCode: string;
    nCityId :number | null;

    
}
export class UserMasterList extends UserMaster{
    dtDOB:number | null;
    // nNonDromeDoctorId : number;
    // nCreatedByUserId:number;
}
export class UserMasterNdList extends UserMaster{
    dtDOB:number | null;
    // nNonDromeDoctorId : number;
    nCreatedByUserId:number;
    nNDDoctorUserId:number;
}
export class AdminUserMasterList extends UserMaster{
    // dtDOB:number | null;
    // nNonDromeDoctorId : number;
    nCityId :number | null;
}
export class CCUserMasterList extends UserMaster{
    // dtDOB:number | null;
    // nNonDromeDoctorId : number;
    // nCityId :number | null;
    nDoctorUserId :number | null;
}
export class DoctoreUserMasterList extends UserMaster{
    // dtDOB:number | null;
    // nNonDromeDoctorId : number;
    // nCityId :number | null;
    nSpecialistId:number | null;
    vLicenseNo :string;
    vLicenseNoFilePath : string;
    nLicenseNoFileSizeInKB : number;
}
export class PharmacistUserMasterList extends UserMaster{
    // nEId:number|null;
    nCreatedByUserId:number;
}

export class RootUserSave {
    UserMaster: UserMaster[] = []
}
// export class RootDoctorUserSave {
//     UserMaster: DoctoreUserMasterList[] = []
// }


export class UserMasterForgetPassword extends UserMaster {
    // vMobileNoOrEmailId: string
    vUserIdORMemberCode: string
}

export class UserMasterCommanList extends UserMaster{
    dtDOB:number | null;
    // nNonDromeDoctorId : number;
    nCreatedByUserId:number;
    nNDDoctorUserId:number;
    nRelationshipId:number;
}
export class ForStoregeService extends UserMaster{
    vGender: string;
}
