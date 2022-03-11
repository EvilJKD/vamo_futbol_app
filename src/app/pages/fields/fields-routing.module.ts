import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FieldsPage } from './fields.page';

const routes: Routes = [
  {
    path: '',
    component: FieldsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FieldsPageRoutingModule {}
