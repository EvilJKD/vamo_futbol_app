import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddfieldPage } from './addfield.page';

const routes: Routes = [
  {
    path: '',
    component: AddfieldPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddfieldPageRoutingModule {}
