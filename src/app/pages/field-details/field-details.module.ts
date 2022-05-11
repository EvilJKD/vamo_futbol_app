import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FieldDetailsPageRoutingModule } from './field-details-routing.module';

import { FieldDetailsPage } from './field-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FieldDetailsPageRoutingModule
  ],
  declarations: [FieldDetailsPage]
})
export class FieldDetailsPageModule {}
