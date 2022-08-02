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
import { CustomerSignupComponent } from './mainsite/SignUp/CustomerSignup/customer-signup/customer-signup.component';
import { DriverSignupComponent } from './mainsite/SignUp/DriverSignup/driver-signup/driver-signup.component';

@NgModule({
  declarations: [
    AppComponent,
    MainsiteComponent,
    MainContantComponent,
    PrivacyPolicyComponent,
    TermsandconditionComponent,
    CustomerSignupComponent,
    DriverSignupComponent,
  ],
  imports: [
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
  ],
  exports: [],
  providers: [BsModalService, HttpClientModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

  bootstrap: [AppComponent],
})
export class AppModule {}
