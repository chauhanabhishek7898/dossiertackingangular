export class CityMaster {
    nCityId: number;
    vCityName: string;
    nStateId: number;
    btActive: boolean;
    btMainInterRelatedCity: boolean;
    nInterRelatedCityId: number;

}
export class CityMasterList extends CityMaster {
    nCityId: number;
    vCityName: string;
    nStateId: number;
    btActive: boolean;
    btMainInterRelatedCity: boolean;
    nInterRelatedCityId: number;
    vStateName: string;
    vCountryName: string;
    CityDetails: string;
    CityStateDetails: string;
    RelatedCity: string
}
export class MainInterRelatedCity {
    nCityId: number;
    vCityName: string;
    nStateId: number;
    btActive: boolean;
    btMainInterRelatedCity: boolean;
    nInterRelatedCityId: number
}