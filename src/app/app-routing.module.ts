import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainContantComponent } from './mainsite/main-contant/main-contant.component';
import { MainsiteComponent } from './mainsite/mainsite.component';
import { PrivacyPolicyComponent } from './mainsite/privacy-policy/privacy-policy.component';
import { TermsandconditionComponent } from './mainsite/termsandcondition/termsandcondition.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: "full" },
  {path: "", component: MainsiteComponent, children: [
      {path: 'home', component: MainContantComponent},
      {path: 'termsandcondition', component: TermsandconditionComponent},
      {path: 'privacypolicy', component: PrivacyPolicyComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
