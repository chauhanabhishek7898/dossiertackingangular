import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DriverSignupComponent } from '../SignUp/DriverSignup/driver-signup/driver-signup.component';

const routes: Routes = [
  {path: 'driver-signup', component: DriverSignupComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
