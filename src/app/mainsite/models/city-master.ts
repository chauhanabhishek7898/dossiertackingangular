export class CityMaster {
    nCityId: number;
    vCityName: string;
    nStateId: number;
    btActive: boolean;
    
}
export class CityMasterList extends CityMaster {
    vStateName: string;
    vCountryName: string;
    CityDetails: string;
    CityStateDetails: string;
}
