import { CountryMasterComponent } from './Admin/country-master/country-master.component';
import { CityMasterComponent } from './Admin/city-master/city-master.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutUsComponent } from './mainsite/about-us/about-us.component';
import { ContactUsComponent } from './mainsite/contact-us/contact-us.component';
import { FaqsComponent } from './mainsite/faqs/faqs.component';
import { MainContantComponent } from './mainsite/main-contant/main-contant.component';
import { MainsiteComponent } from './mainsite/mainsite.component';
import { PrivacyPolicyComponent } from './mainsite/privacy-policy/privacy-policy.component';
import { CustomerSignupComponent } from './mainsite/SignUp/customer-signup/customer-signup.component';
import { DriverSignupComponent } from './mainsite/SignUp/DriverSignup/driver-signup/driver-signup.component';
import { TermsandconditionComponent } from './mainsite/termsandcondition/termsandcondition.component';
import { StateMasterComponent } from './Admin/state-master/state-master.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: "full" },
  {path: "", component: MainsiteComponent, children: [
      {path: 'home', component: MainContantComponent},
      {path: 'termsandcondition', component: TermsandconditionComponent},
      {path: 'privacypolicy', component: PrivacyPolicyComponent},
      {path: 'customer-signup', component: CustomerSignupComponent},
      {path: 'driver-signup', component: DriverSignupComponent},
      {path: 'contact-us', component: ContactUsComponent},
      {path: 'about-us', component: AboutUsComponent},
      {path: 'faqs', component: FaqsComponent},

      {path: 'citymaster', component: CityMasterComponent},
      {path: 'countrymaster', component: CountryMasterComponent},
      {path: 'statemaster', component: StateMasterComponent}

    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
