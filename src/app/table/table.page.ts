import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { AuthenticateService } from '../services/authentication.service';
import * as firebase from 'firebase';
import { async } from '@angular/core/testing';
var user = firebase.auth().currentUser;
//import { SalePagePage } from '../sale-page/sale-page.page';
import { Router, NavigationExtras } from '@angular/router';

@Component({
    selector: 'app-table',
    templateUrl: './table.page.html',
    styleUrls: ['./table.page.scss'],
})
export class TablePage implements OnInit {

    Tables = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'];
    tnum: number;
    protected userid: string;
    userEmail: string;
    tablenum: string;
    checkorder: {};
    constructor(public navCtrl: NavController,

        public alertCtrl: AlertController,
        private authService: AuthenticateService,
        public router: Router
    ) { }


    navigateToStock() {
        this.navCtrl.navigateForward('/dashboard');
    }
    async select(index) {

        Number(index);
        this.tnum = index + 1;
        this.tablenum = "T" + this.tnum;
        this.tablenum = this.tablenum.toString();
        console.log(this.tablenum);


    }
    async Sale() {
        let check = 0;
        if (this.tnum > -1) {
            const dbdrink = await firebase.firestore().collection("order").where("Userid", "==", this.userid ? this.userid : "")
            const snapshot2 = await dbdrink.get();

            snapshot2.forEach(doc => {
                if (this.tablenum == doc.data().table) {
                    check = 1;
                    this.checkorder = doc.data();
                    console.log("555");

                }

            });
            if (check == 1) {
                let navigationExtras: NavigationExtras = {
                    state: {

                        detail: this.checkorder, table: this.tablenum

                    }
                };
                this.router.navigate(['/sale-page'], navigationExtras);

                console.log("have");
            } else {
                this.checkorder = null;
                let navigationExtras: NavigationExtras = {
                    state: {

                        detail: this.checkorder, table: this.tablenum

                    }
                };
                this.router.navigate(['/sale-page'], navigationExtras);
                console.log("nothave");
            }
            //check ? console.log("have") : console.log("not have");
            /*  this.checkorder = "undefined"
              let navigationExtras: NavigationExtras = {
                  state: {
  
                      detail: this.checkorder, table: this.tablenum
  
                  }
              };
              this.router.navigate(['/sale-page'], navigationExtras);*/
        }


        /*  var entry = {
              'table': doc.data().table,
              'name': doc.data().name,
              'qty': doc.data().qty,
              'price': doc.data().price,
              'id': doc.id
          };
          */


        //  this.checkorder = undefined;  
        console.log(this.tablenum);
        console.log(this.checkorder);
        this.checkorder = null;



    }
    async ngOnInit() {
        await this.authService.userDetails().subscribe(async (res) => {

            if (res !== null) {

                this.userEmail = res.email;
                this.userid = res.uid;
            }
        }, err => {
            console.log('err', err);
        })
    }

}
