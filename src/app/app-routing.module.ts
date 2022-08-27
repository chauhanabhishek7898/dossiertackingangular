import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { IsSignedInGuard } from './core/guards/signIn.guard';
import { AboutUsComponent } from './mainsite/about-us/about-us.component';
import { AdminDashboardComponent } from './mainsite/admin/admin-dashboard/admin-dashboard.component';
import { AdminLoginComponent } from './mainsite/admin/login/admin-login/admin-login.component';
import { ContactUsComponent } from './mainsite/contact-us/contact-us.component';
import { CorporateSignupComponent } from './mainsite/corporate/signup/corporate-signup/corporate-signup.component';
import { FaqsComponent } from './mainsite/faqs/faqs.component';
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
      {path: 'corporate-signup', component: CorporateSignupComponent},
      {path: 'contact-us', component: ContactUsComponent},
      {path: 'about-us', component: AboutUsComponent},
      {path: 'customer-signup', component: CustomerSignupComponent},
      {path: 'driver-signup', component: DriverSignupComponent},
      {path: 'faqs', component: FaqsComponent},
      {path: 'login', component: AdminLoginComponent,canActivate: [IsSignedInGuard]},
      
      {path: 'faqs', component: FaqsComponent},

      
      {
        path: 'ad', component: AdminDashboardComponent,canActivate: [AuthGuard],
        loadChildren: () => import('./mainsite/admin/admin-routing.module').then((m) => m.AdminRoutingModule),
      },
      {
        path: 'cp', component: AdminDashboardComponent,canActivate: [AuthGuard],
        loadChildren: () => import('./mainsite/corporate/corporate-routing.module').then((m) => m.CorporateRoutingModule),
      },
    ]
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
