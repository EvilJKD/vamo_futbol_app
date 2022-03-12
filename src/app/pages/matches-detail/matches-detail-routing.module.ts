import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MatchesDetailPage } from './matches-detail.page';

const routes: Routes = [
  {
    path: '',
    component: MatchesDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MatchesDetailPageRoutingModule {}
