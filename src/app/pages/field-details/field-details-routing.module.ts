import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FieldDetailsPage } from './field-details.page';

const routes: Routes = [
  {
    path: '',
    component: FieldDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FieldDetailsPageRoutingModule {}
