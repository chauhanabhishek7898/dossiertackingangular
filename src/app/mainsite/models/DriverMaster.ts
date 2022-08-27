export class DriverMaster {
  nDriverId: Number;
  // vDriverId: String;
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
}
export class DriverMasterClass {
  DriverMaster: DriverMaster[]
}


export class CorporateSignup {
  nEId:number
  vMobileNo:number
  // vEId:string
  vEType:string
  vEstablishmentName:string
  vContactPersonOwner:string
  vCPDesignation:string
  vCPMobileNo:string
  vCPEmailId:string
  vAddress:string
  nCityId:string
  vPinCode:string
  vContactNo:string
  vWhatsUpNo:string
  vEmailId:string
  vWebsiteLink:string
  vTaxDetails:string
  vAuthorizedSignatory:string
  vAuthorizedSignatoryFilePath:string
  vLogoFilePath:string
  // btActive:boolean
  vPassword:string
}
export class CorporateMasterClass {
  CorporateMaster: CorporateSignup[]
}
export class GetCorporateUserDetail extends CorporateSignup{
  CityDetails:string
  CityStateDetails:string
}
export class CorporateUpdae {
  nEId:number
  // vMobileNo:number
  // vEId:string
  // vEType:string
  vEstablishmentName:string
  vContactPersonOwner:string
  vCPDesignation:string
  vCPMobileNo:string
  vCPEmailId:string
  vAddress:string
  nCityId:string
  vPinCode:string
  vContactNo:string
  vWhatsUpNo:string
  // vEmailId:string
  vWebsiteLink:string
  vTaxDetails:string
  vAuthorizedSignatory:string
  vAuthorizedSignatoryFilePath:string
  vLogoFilePath:string
}
export class CorporateMasterUpdateClass {
  CorporateMaster: CorporateUpdae[]
}
