import { CustomersSavedAddressesMasterComponent } from './admin-dashboard/customers-saved-addresses-master/customers-saved-addresses-master.component';
import { AdminSignupMasterComponent } from './admin-dashboard/admin-signup-master/admin-signup-master.component';
import { CustomerDetailsAdminComponent } from './admin-dashboard/customer-details-admin/customer-details-admin.component';
import { DriverDetailsAdminComponent } from './admin-dashboard/driver-details-admin/driver-details-admin.component';
import { ApproveDriverMasterComponent } from './admin-dashboard/approve-driver-master/approve-driver-master.component';
import { UpdateEmailComponent } from './admin-dashboard/setting/update-email/update-email.component';
import { UpdateMobileNoComponent } from './admin-dashboard/setting/update-mobile-no/update-mobile-no.component';
import { ChangePasswordComponent } from './admin-dashboard/setting/change-password/change-password.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CityMasterComponent } from './admin-dashboard/city-master/city-master.component';
import { CountryMasterComponent } from './admin-dashboard/country-master/country-master.component';
import { StateMasterComponent } from './admin-dashboard/state-master/state-master.component';
import { OrgMobnoAndEmailIdComponent } from './admin-dashboard/org-mobno-and-email-id/org-mobno-and-email-id.component';
import { TrackingDetailsAdminComponent } from './admin-dashboard/tracking-details-admin/tracking-details-admin.component';
import { VehicleTypeMasterComponent } from './admin-dashboard/vehicle-type-master/vehicle-type-master.component';
import { VehicleRateMasterComponent } from './admin-dashboard/vehicle-rate-master/vehicle-rate-master.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { KMLimitMasterComponent } from './admin-dashboard/kmlimit-master/kmlimit-master.component';
import { ServiceSubTypeMasterComponent } from './admin-dashboard/service-sub-type-master/service-sub-type-master.component';
import { ServiceTypeMasterComponent } from './admin-dashboard/service-type-master/service-type-master.component';
import { WaitTimeChargesComponent } from './admin-dashboard/wait-time-charges/wait-time-charges.component';
import { CorporatesDetails } from './admin-dashboard/corporates-details/corporates-details';
import { CorporatesDetailsComponent } from './admin-dashboard/corporates-details/corporates-details.component';
import { ApproveCorporatesComponent } from './admin-dashboard/approve-corporates/approve-corporates.component';
import { UserDetailsComponent } from './admin-dashboard/user-details/user-details.component';

const routes: Routes = [
  {
    path: 'city',
    component: CityMasterComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'country',
    component: CountryMasterComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'state',
    component: StateMasterComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'update-password',
    component: ChangePasswordComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'update-mobile-no',
    component: UpdateMobileNoComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'update-email-id',
    component: UpdateEmailComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'orgmobileemail',
    component: OrgMobnoAndEmailIdComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'approvedrivers',
    component: ApproveDriverMasterComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'driverdetailsadmin',
    component: DriverDetailsAdminComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'customerdetailsadmin',
    component: CustomerDetailsAdminComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'trackingdetailsadmin',
    component: TrackingDetailsAdminComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'vehicletypemaster',
    component: VehicleTypeMasterComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'vehicleratemaster',
    component: VehicleRateMasterComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'waittimecharges',
    component: WaitTimeChargesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'kmlimitmaster',
    component: KMLimitMasterComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'servicetypemaster',
    component: ServiceTypeMasterComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'servicesubtypemaster',
    component: ServiceSubTypeMasterComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'adminsignup',
    component: AdminSignupMasterComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'customerssavedaddresses',
    component: CustomersSavedAddressesMasterComponent,
    canActivate: [AuthGuard],
  }, 
  {
    path: 'corporatesdetails',
    component: CorporatesDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'approvecorporates',
    component: ApproveCorporatesComponent,
    canActivate: [AuthGuard],
  },
   {
    path: 'userdetailsreport',
    component: UserDetailsComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
