import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CityMasterComponent } from './admin-dashboard/city-master/city-master.component';
import { CountryMasterComponent } from './admin-dashboard/country-master/country-master.component';
import { StateMasterComponent } from './admin-dashboard/state-master/state-master.component';


const routes: Routes = [
  { path: 'city', component: CityMasterComponent },
  { path: 'country', component: CountryMasterComponent },
  { path: 'State', component: StateMasterComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
