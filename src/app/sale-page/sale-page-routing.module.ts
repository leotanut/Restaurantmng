import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalePagePage } from './sale-page.page';

const routes: Routes = [
  {
    path: '',
    component: SalePagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalePagePageRoutingModule {}
