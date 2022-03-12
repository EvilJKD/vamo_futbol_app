import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MatchesDetailPageRoutingModule } from './matches-detail-routing.module';

import { MatchesDetailPage } from './matches-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatchesDetailPageRoutingModule
  ],
  declarations: [MatchesDetailPage]
})
export class MatchesDetailPageModule {}
