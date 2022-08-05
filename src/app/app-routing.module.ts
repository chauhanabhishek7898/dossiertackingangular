import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactUsComponent } from './mainsite/contact-us/contact-us.component';
import { MainContantComponent } from './mainsite/main-contant/main-contant.component';
import { MainsiteComponent } from './mainsite/mainsite.component';
import { PrivacyPolicyComponent } from './mainsite/privacy-policy/privacy-policy.component';
import { CustomerSignupComponent } from './mainsite/SignUp/customer-signup/customer-signup.component';
import { DriverSignupComponent } from './mainsite/SignUp/DriverSignup/driver-signup/driver-signup.component';
import { TermsandconditionComponent } from './mainsite/termsandcondition/termsandcondition.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: "full" },
  {path: "", component: MainsiteComponent, children: [
      {path: 'home', component: MainContantComponent},
      {path: 'termsandcondition', component: TermsandconditionComponent},
      {path: 'privacypolicy', component: PrivacyPolicyComponent},
      {path: 'customer-signup', component: CustomerSignupComponent},
      {path: 'driver-signup', component: DriverSignupComponent},
      {path: 'contact-us', component: ContactUsComponent}

    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
