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



const routes: Routes = [
  { path: 'city', component: CityMasterComponent },
  { path: 'country', component: CountryMasterComponent },
  { path: 'state', component: StateMasterComponent },
  { path: 'update-password', component: ChangePasswordComponent },
  { path: 'update-mobile-no', component: UpdateMobileNoComponent },
  { path: 'update-email-id', component: UpdateEmailComponent },
  { path: 'ad/orgmobileemail', component: OrgMobnoAndEmailIdComponent },
  { path: 'approvedrivers', component: ApproveDriverMasterComponent },
  { path: 'driverdetailsadmin', component: DriverDetailsAdminComponent },
  { path: 'customerdetailsadmin', component: CustomerDetailsAdminComponent },
  { path: 'trackingdetailsadmin', component: TrackingDetailsAdminComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
