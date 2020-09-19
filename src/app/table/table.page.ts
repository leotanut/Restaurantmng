import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { AuthenticateService } from '../services/authentication.service';
import * as firebase from 'firebase';
import { async } from '@angular/core/testing';
var user = firebase.auth().currentUser;


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

    constructor(public navCtrl: NavController,
     
        public alertCtrl: AlertController,
        private authService: AuthenticateService,
    ) { }


    navigateToStock() {
        this.navCtrl.navigateForward('/dashboard');
    }
    async select(index) {
       
        Number(index);
        this.tnum = index+1;
        console.log(index);
 if (index>-1) {
         const db = await firebase.firestore();
         await db.collection('order').add
             ({
                 table: 'T' + this.tnum,
                 Userid: this.userid
             })
            this.navCtrl.navigateForward('/sale-page');
        }
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
