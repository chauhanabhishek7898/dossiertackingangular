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
}
export class CustomerMasterClass {
  CustomerMaster: CustomerMaster[] = [];
}
