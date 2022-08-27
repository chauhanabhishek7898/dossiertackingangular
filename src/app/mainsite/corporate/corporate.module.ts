import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CorporateRoutingModule } from './corporate-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DataTablesModule } from 'angular-datatables';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ImageCropperModule } from 'ngx-image-cropper';
import { WebcamModule } from 'ngx-webcam';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AdminRoutingModule } from '../admin/admin-routing.module';
import { ManageAddressesCorporationComponent } from './manage-addresses-corporation/manage-addresses-corporation.component';
import { CorporateDetailsComponent } from './corporate-details/corporate-details.component';
import { ChangeCorporateMobileNoComponent } from './change-corporate-mobile-no/change-corporate-mobile-no.component';
import { ChangeCorporateEmailIdComponent } from './change-corporate-email-id/change-corporate-email-id.component';
import { ActivateRevokeAssistantsComponent } from './activate-revoke-assistants/activate-revoke-assistants.component';
import { AssistantSignUpComponent } from './assistant-sign-up/assistant-sign-up.component';



@NgModule({
  declarations: [
    ManageAddressesCorporationComponent,
    CorporateDetailsComponent,
    ChangeCorporateMobileNoComponent,
    ChangeCorporateEmailIdComponent,
    ActivateRevokeAssistantsComponent,
    AssistantSignUpComponent
  ],
  imports: [
    CommonModule,
    CorporateRoutingModule,
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
    MatAutocompleteModule,
    MatExpansionModule,
    DataTablesModule,
    WebcamModule,
    ImageCropperModule
  ],
  exports: [
    ManageAddressesCorporationComponent,
    CorporateDetailsComponent,
    ChangeCorporateMobileNoComponent,
    ChangeCorporateEmailIdComponent,
    ActivateRevokeAssistantsComponent,
    AssistantSignUpComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers:[
   
  ]
})
export class CorporateModule { }
