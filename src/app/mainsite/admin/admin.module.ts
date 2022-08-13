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
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { PageFilterPipe } from '../../core/pipe/page-filter';

import { DataTablesModule } from 'angular-datatables';
import { CityMasterComponent } from './admin-dashboard/city-master/city-master.component';
import { CountryMasterComponent } from './admin-dashboard/country-master/country-master.component';
import { StateMasterComponent } from './admin-dashboard/state-master/state-master.component';




@NgModule({
  declarations: [
    CityMasterComponent,
    CountryMasterComponent,
    StateMasterComponent
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
    ToastrModule.forRoot(),
    MatExpansionModule,
    DataTablesModule
    // PageFilterPipe
  ],
  exports:[
    CityMasterComponent,
    CountryMasterComponent,
    StateMasterComponent
  ],
  providers:[
   
  ]
})
export class AdminModule { }
