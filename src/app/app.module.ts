import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainsiteComponent } from './mainsite/mainsite.component';
import { MainContantComponent } from './mainsite/main-contant/main-contant.component';
import { PrivacyPolicyComponent } from './mainsite/privacy-policy/privacy-policy.component';
import { TermsandconditionComponent } from './mainsite/termsandcondition/termsandcondition.component';

@NgModule({
  declarations: [
    AppComponent,
    MainsiteComponent,
    MainContantComponent,
    PrivacyPolicyComponent,
    TermsandconditionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
