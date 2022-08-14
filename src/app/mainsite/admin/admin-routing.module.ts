import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { CityMasterComponent } from './admin-dashboard/city-master/city-master.component';
import { CountryMasterComponent } from './admin-dashboard/country-master/country-master.component';
import { KMLimitMasterComponent } from './admin-dashboard/kmlimit-master/kmlimit-master.component';
import { OtherRolesProfileComponent } from './admin-dashboard/other-roles-profile/other-roles-profile.component';
import { ServiceSubTypeMasterComponent } from './admin-dashboard/service-sub-type-master/service-sub-type-master.component';
import { ServiceTypeMasterComponent } from './admin-dashboard/service-type-master/service-type-master.component';
import { StateMasterComponent } from './admin-dashboard/state-master/state-master.component';
import { VehicleRateMasterComponent } from './admin-dashboard/vehicle-rate-master/vehicle-rate-master.component';
import { VehicleTypeMasterComponent } from './admin-dashboard/vehicle-type-master/vehicle-type-master.component';
import { WaitTimeChargesComponent } from './admin-dashboard/wait-time-charges/wait-time-charges.component';


const routes: Routes = [
  { path: 'city', component: CityMasterComponent ,canActivate: [AuthGuard]},
  { path: 'country', component: CountryMasterComponent ,canActivate: [AuthGuard]},
  { path: 'state', component: StateMasterComponent ,canActivate: [AuthGuard]},
  { path: 'otherrolesprofile', component: OtherRolesProfileComponent ,canActivate: [AuthGuard]},
  { path: 'vehicletypemaster', component: VehicleTypeMasterComponent ,canActivate: [AuthGuard]},
  { path: 'vehicleratemaster', component: VehicleRateMasterComponent ,canActivate: [AuthGuard]},
  { path: 'waittimecharges', component: WaitTimeChargesComponent ,canActivate: [AuthGuard]},
  { path: 'kmlimitmaster', component: KMLimitMasterComponent ,canActivate: [AuthGuard]},
  { path: 'servicetypemaster', component: ServiceTypeMasterComponent ,canActivate: [AuthGuard]},
  { path: 'servicesubtypemaster', component: ServiceSubTypeMasterComponent ,canActivate: [AuthGuard]},
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
