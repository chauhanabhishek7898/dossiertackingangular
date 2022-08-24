export class CustomerMaster {
  nCId: number;
  // vCId:string;
  // nUserId: number;
  vGender: string;
  dtDOB: string;
  vAadhaarNo: string;
  vAadhaarNoFilePath: string;
  vFullName: string;
  vMobileNo: string;
  vPassword: string;
  vEmailId: string;
  btPromotion: any;
  nCityId: number | null;
  vAddress: string;
  vLat: string;
  vLong: string;
  vFlatNoPlotNoLaneBuilding: string;
  vCityName: string
}
export class CustomerMasterList {
  btActive: boolean
  nUserId: number
  vCId: string
  vFullName: string
  vMobileNo: string
  vPasswordDec: string
  vEmailId: string
  vGender: string
  DOB: string
  vAadhaarNo: string
  vAadhaarNoFilePath: string
  vFlatNoPlotNoLaneBuilding: string
  vAddress: string
  CityDetails: string
}

export class CustomerMasterClass {
  CustomerMaster: CustomerMaster[] = [];
}
