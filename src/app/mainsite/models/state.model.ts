export class StateMaster {
    nCountryId: number;
    nStateId:number;
    vStateName:string;
    vStatePrefix:string;
    btActive: boolean;
    // vCountryName: string;
}
export class stateMasterList extends StateMaster {
    vCountryName: string;
    StateDetails: string;
    // vSingleOrMultiple: string
}