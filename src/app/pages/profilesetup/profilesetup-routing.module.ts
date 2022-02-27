import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfilesetupPage } from './profilesetup.page';

const routes: Routes = [
  {
    path: '',
    component: ProfilesetupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilesetupPageRoutingModule {}
