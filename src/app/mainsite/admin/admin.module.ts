
import { ChangePasswordComponent } from './admin-dashboard/setting/change-password/change-password.component';
import { UpdateMobileNoComponent } from './admin-dashboard/setting/update-mobile-no/update-mobile-no.component';
import { UpdateEmailComponent } from './admin-dashboard/setting/update-email/update-email.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminLoginComponent } from './login/admin-login/admin-login.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { PageFilterPipe } from '../../core/pipe/page-filter';

import { DataTablesModule } from 'angular-datatables';
import { CityMasterComponent } from './admin-dashboard/city-master/city-master.component';
import { CountryMasterComponent } from './admin-dashboard/country-master/country-master.component';
import { StateMasterComponent } from './admin-dashboard/state-master/state-master.component';
import { OrgMobnoAndEmailIdComponent } from './admin-dashboard/org-mobno-and-email-id/org-mobno-and-email-id.component';
import { ApproveDriverMasterComponent } from './admin-dashboard/approve-driver-master/approve-driver-master.component';
import { DriverDetailsAdminComponent } from './admin-dashboard/driver-details-admin/driver-details-admin.component';
import { CustomerDetailsAdminComponent } from './admin-dashboard/customer-details-admin/customer-details-admin.component';
import { TrackingDetailsAdminComponent } from './admin-dashboard/tracking-details-admin/tracking-details-admin.component';
import { WebcamModule } from 'ngx-webcam';
import { ImageCropperModule } from 'ngx-image-cropper';

import { VehicleTypeMasterComponent } from './admin-dashboard/vehicle-type-master/vehicle-type-master.component';
import { VehicleRateMasterComponent } from './admin-dashboard/vehicle-rate-master/vehicle-rate-master.component';
import { WaitTimeChargesComponent } from './admin-dashboard/wait-time-charges/wait-time-charges.component';
import { KMLimitMasterComponent } from './admin-dashboard/kmlimit-master/kmlimit-master.component';
import { ServiceTypeMasterComponent } from './admin-dashboard/service-type-master/service-type-master.component';
import { ServiceSubTypeMasterComponent } from './admin-dashboard/service-sub-type-master/service-sub-type-master.component';
import { OtherRolesProfileComponent } from './admin-dashboard/other-roles-profile/other-roles-profile.component';
import { CustomersSavedAddressesMasterComponent } from './admin-dashboard/customers-saved-addresses-master/customers-saved-addresses-master.component';
import { AdminSignupMasterComponent } from './admin-dashboard/admin-signup-master/admin-signup-master.component';
import { CorporatesDetailsComponent } from './admin-dashboard/corporates-details/corporates-details.component';
import { ApproveCorporatesComponent } from './admin-dashboard/approve-corporates/approve-corporates.component';
import { CorporateModule } from '../corporate/corporate.module';
import { UserDetailsComponent } from './admin-dashboard/user-details/user-details.component';




@NgModule({
  declarations: [
    CityMasterComponent,
    CountryMasterComponent,
    StateMasterComponent,
    UpdateEmailComponent,
    UpdateMobileNoComponent,
    ChangePasswordComponent,
    OrgMobnoAndEmailIdComponent,
    ApproveDriverMasterComponent,
    DriverDetailsAdminComponent,
    CustomerDetailsAdminComponent,
    TrackingDetailsAdminComponent,
    VehicleTypeMasterComponent,
    VehicleRateMasterComponent,
    WaitTimeChargesComponent,
    KMLimitMasterComponent,
    ServiceTypeMasterComponent,
    ServiceSubTypeMasterComponent,
    OtherRolesProfileComponent,
    CustomersSavedAddressesMasterComponent,
    AdminSignupMasterComponent,
    CorporatesDetailsComponent,
    ApproveCorporatesComponent,
    UserDetailsComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    BrowserModule,
    HttpClientModule,
    MatSelectModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatDividerModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatExpansionModule,
    DataTablesModule,
    WebcamModule,
    ImageCropperModule,
    CorporateModule
    // PageFilterPipe
  ],
  exports:[
    CityMasterComponent,
    CountryMasterComponent,
    StateMasterComponent,
    UpdateEmailComponent,
    UpdateMobileNoComponent,
    ChangePasswordComponent,
    OrgMobnoAndEmailIdComponent,
    ApproveDriverMasterComponent,
    DriverDetailsAdminComponent,
    CustomerDetailsAdminComponent,
    TrackingDetailsAdminComponent,
    VehicleTypeMasterComponent,
    VehicleRateMasterComponent,
    WaitTimeChargesComponent,
    KMLimitMasterComponent,
    ServiceTypeMasterComponent,
    ServiceSubTypeMasterComponent,
    OtherRolesProfileComponent,
    CorporatesDetailsComponent
  ],
  providers:[
   
  ]
})
export class AdminModule { }
