import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SalePagePageRoutingModule } from './sale-page-routing.module';

import { SalePagePage } from './sale-page.page';

import { Component, OnInit } from '@angular/core';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SalePagePageRoutingModule
  ],
  declarations: [SalePagePage]
})
export class SalePagePageModule {

navigate: any;
    constructor(
      
    ) { }



}

