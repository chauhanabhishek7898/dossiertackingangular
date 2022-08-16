export class ServiceSubTypeMaster {
    nSSTId: number
    vServiceSubType: string
    nSTId: number
    nVId: number
    nCityId: number
    nFromKM: number
    nToKM: number
    nRate: number
    btActive: boolean
}
export class ServiceSubTypeGet {
    nSSTId: number
    vServiceSubType: string
    nSTId: number
    nVId: number
    nCityId: number
    nFromKM: number
    nToKM: number
    nRate: number
    btActive: boolean
    vServiceType: string
    vVehicleType: string
    vCityName: string
    CityStateDetails: string
    CityStateDetailsPX:string
}