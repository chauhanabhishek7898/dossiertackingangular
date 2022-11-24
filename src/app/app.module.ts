
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import {
  BrowserModule,
  HAMMER_GESTURE_CONFIG,
} from '@angular/platform-browser';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AppComponent } from './app.component';
import { MainsiteComponent } from './mainsite/mainsite.component';
import { MainContantComponent } from './mainsite/main-contant/main-contant.component';
import { PrivacyPolicyComponent } from './mainsite/privacy-policy/privacy-policy.component';
import { TermsandconditionComponent } from './mainsite/termsandcondition/termsandcondition.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CustomerSignupComponent } from './mainsite/SignUp/customer-signup/customer-signup.component';
import { DriverSignupComponent } from './mainsite/SignUp/DriverSignup/driver-signup/driver-signup.component';
import { CommonModule, DatePipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
// import { NotificationService } from './core/service/notification.service';
import { ContactUsComponent } from './mainsite/contact-us/contact-us.component';
import { FaqsComponent } from './mainsite/faqs/faqs.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { AboutUsComponent } from './mainsite/about-us/about-us.component';

import { AdminLoginComponent } from './mainsite/admin/login/admin-login/admin-login.component';
import { AdminModule } from './mainsite/admin/admin.module';
import { AdminDashboardComponent } from './mainsite/admin/admin-dashboard/admin-dashboard.component';
import { PageFilterPipe } from './core/pipe/page-filter';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { DataTablesModule } from 'angular-datatables';
import { CorporateSignupComponent } from './mainsite/corporate/signup/corporate-signup/corporate-signup.component';
import { DeliveryAndShippingPloicyComponent } from './mainsite/delivery-and-shipping-ploicy/delivery-and-shipping-ploicy.component';
import { RefunandCancellationPolicyComponent } from './mainsite/refunand-cancellation-policy/refunand-cancellation-policy.component';

@NgModule({
  declarations: [
    AppComponent,
    MainsiteComponent,
    MainContantComponent,
    PrivacyPolicyComponent,
    TermsandconditionComponent,
    CustomerSignupComponent,
    DriverSignupComponent,
    ContactUsComponent,
    FaqsComponent,
    AboutUsComponent,
    AdminDashboardComponent,
    AdminLoginComponent,
    PageFilterPipe,
    CorporateSignupComponent,
    DeliveryAndShippingPloicyComponent,
    RefunandCancellationPolicyComponent
  ],
  imports: [
    GooglePlaceModule,
    BrowserModule,
    HttpClientModule,
    CommonModule,
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
    MatExpansionModule


  ],
  providers:
    [
      BsModalService,
      HttpClientModule,
      DatePipe,
      // NotificationService,
      PageFilterPipe
    ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],

  bootstrap: [AppComponent],
})
export class AppModule { }
