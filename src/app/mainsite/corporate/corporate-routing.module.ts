import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { OrgMobnoAndEmailIdComponent } from '../admin/admin-dashboard/org-mobno-and-email-id/org-mobno-and-email-id.component';
import { ChangePasswordComponent } from '../admin/admin-dashboard/setting/change-password/change-password.component';
import { UpdateEmailComponent } from '../admin/admin-dashboard/setting/update-email/update-email.component';
import { UpdateMobileNoComponent } from '../admin/admin-dashboard/setting/update-mobile-no/update-mobile-no.component';
import { ActivateRevokeAssistantsComponent } from './activate-revoke-assistants/activate-revoke-assistants.component';
import { AssistantSignUpComponent } from './assistant-sign-up/assistant-sign-up.component';
import { ChangeCorporateEmailIdComponent } from './change-corporate-email-id/change-corporate-email-id.component';
import { ChangeCorporateMobileNoComponent } from './change-corporate-mobile-no/change-corporate-mobile-no.component';
import { CorporateDetailsComponent } from './corporate-details/corporate-details.component';
import { ManageAddressesCorporationComponent } from './manage-addresses-corporation/manage-addresses-corporation.component';

const routes: Routes = [
  {path: 'manageaddresses',component: ManageAddressesCorporationComponent,canActivate: [AuthGuard]},
  {path: 'update-mobile-no',component: UpdateMobileNoComponent,canActivate: [AuthGuard]},
  {path: 'update-email-id',component: UpdateEmailComponent,canActivate: [AuthGuard]},
  {path: 'update-password',component: ChangePasswordComponent,canActivate: [AuthGuard]},
  {path: 'corporatedetails',component: CorporateDetailsComponent,canActivate: [AuthGuard]},
  {path: 'changecorporatemobileno',component: ChangeCorporateMobileNoComponent,canActivate: [AuthGuard]},
  {path: 'changecorporateemailid',component: ChangeCorporateEmailIdComponent,canActivate: [AuthGuard]},
  {path: 'assistantsignup',component: AssistantSignUpComponent,canActivate: [AuthGuard]},
  {path: 'activaterevokeassistants',component: ActivateRevokeAssistantsComponent,canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CorporateRoutingModule { }
