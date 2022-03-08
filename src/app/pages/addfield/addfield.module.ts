import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddfieldPageRoutingModule } from './addfield-routing.module';

import { AddfieldPage } from './addfield.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddfieldPageRoutingModule
  ],
  declarations: [AddfieldPage]
})
export class AddfieldPageModule {}
