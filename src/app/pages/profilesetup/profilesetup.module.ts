import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilesetupPageRoutingModule } from './profilesetup-routing.module';

import { ProfilesetupPage } from './profilesetup.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilesetupPageRoutingModule
  ],
  declarations: [ProfilesetupPage]
})
export class ProfilesetupPageModule {}
