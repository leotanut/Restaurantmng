import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { AuthenticateService } from '../services/authentication.service';
import * as firebase from 'firebase';
import { async } from '@angular/core/testing';
var user = firebase.auth().currentUser;
import { ActivatedRoute } from '@angular/router';
import { Platform, LoadingController } from '@ionic/angular';

import { Router } from '@angular/router';
//Side Menu
import { MenuController } from '@ionic/angular';
import { Variable } from '@angular/compiler/src/render3/r3_ast';
import { from } from 'rxjs';

@Component({
    selector: 'app-sale-page',
    templateUrl: './sale-page.page.html',
    styleUrls: ['./sale-page.page.scss'],
})

export class SalePagePage implements OnInit {
    qty: number;
    name: string;
    price: number;
    sum: number;
    userEmail: string;
    protected userid: string;
    galleryType = 'regular';

    data: any;

    cutstocker = [];
    cutstocker2 = [];
    drinkList = [];
    orderList = [];
    orderdetail: any;
    tablenum: any;
    check: boolean;

    constructor(public navCtrl: NavController,
        public platform: Platform,
        public loadingController: LoadingController,
        public alertCtrl: AlertController,
        private authService: AuthenticateService,
        public menu: MenuController,
        private route: ActivatedRoute, private router: Router, ) {
        this.qty = 0; this.sum = 0;
        this.route.queryParams.subscribe(params => {

            if (this.router.getCurrentNavigation().extras.state) {

                if (this.router.getCurrentNavigation().extras.state.detail) {
                    this.orderdetail = this.router.getCurrentNavigation().extras.state.detail;
                    this.data = this.orderdetail.table;
                    
                    this.sum = this.orderdetail.allsum;
                    this.check = true;
                } else {
                    this.data = this.router.getCurrentNavigation().extras.state.table;
                    this.sum = 0;
                   
                    this.check = false;
                };





            }

        });

    }
    async loadingPresent(message: string = "Loading..", duration: number = null) {
        const loading = await this.loadingController.create({ message, duration });
        return await loading.present();
    }

    async loadingDismiss() {
        setTimeout(() => {
            return this.loadingController.dismiss();
        }, 1000);
    }

    // increment product qty
    incrementQty(index) {
       
        this.orderList[index].qty += 1;
        let task = this.orderList[index];
        task.sum = task.price * task.qty;
        this.updatesum();

    }

    decrementQty(index) {
        if (this.orderList[index].qty - 1 < 0) {
            this.orderList[index].qty = 0
          
        } else {
            this.orderList[index].qty -= 1;
           
        }
        let task = this.orderList[index];
        task.sum = task.price * task.qty;
        this.updatesum();

    }
    updatesum() {
        let allsum: number = 0;

        for (let item of this.orderList) {
          
            allsum = allsum + item.sum
        }
        this.sum = allsum;

    }
    navigateToStock() {
        this.navCtrl.navigateForward('/dashboard');
    }
    navigateTomenu() {
        this.navCtrl.navigateForward('/menu');
    }



    async Ordered() {
        //Retrieve weight data from database put in to orderList[]

        if (this.check === true) {
           
            const makeodr = await firebase.firestore().collection("order");


            (await makeodr.where("Userid", "==", this.userid ? this.userid : "").where("table", "==", this.data).get()).forEach(doc => {
                

                orderid = doc.id;

            });
        
           
            let myOrderList = this.orderList.filter(function (value) {
                return value.qty > 0
            })

            const makeodr2 = await firebase.firestore().collection("order").doc(orderid).set({
                allsum: this.sum,
                table: this.data,
                Userid: this.userid,
                order: myOrderList
            }).then(function () {
                console.log("Document successfully written!");
            })
                .catch(function (error) {
                    console.error("Error writing document: ", error);
                });
            this.router.navigate(['/table'])
                .then(() => {
                    window.location.reload();
                });
        //    this.navCtrl.navigateForward('/table');
         //   this.navCtrl.navigateRoot('/table');
       
        } else {
            var orderid;
            const makeodr = await firebase.firestore().collection("order");
            makeodr.add({ table: this.data, Userid: this.userid, });

            (await makeodr.where("Userid", "==", this.userid ? this.userid : "").where("table", "==", this.data).get()).forEach(doc => {
              

                orderid = doc.id;

            });
         

            let myOrderList = this.orderList.filter(function (value) {
                return value.qty > 0
            })

            const makeodr2 = await firebase.firestore().collection("order").doc(orderid).set({
                allsum: this.sum,
                table: this.data,
                Userid: this.userid,
                order: myOrderList
            }).then(function () {
                console.log("Document successfully written!");
            })
                .catch(function (error) {
                    console.error("Error writing document: ", error);
                });
               this.router.navigate(['/table'])
                .then(() => {
                    window.location.reload();
                });
        //    this.navCtrl.navigateRoot('/table');
        }


    }
    menulist =[];
    async charge() {
        if (this.check === true) {
            var orderid;
            let ing = [];
            let entry2 = [];
            var inginit = [];

            const ordercut1 = await firebase.firestore().collection("ingredient").where("Userid", "==", this.userid ? this.userid : "");
            const snapshot1 = await ordercut1.get();
            snapshot1.forEach(doc => {

                ing.push({
                    'namein': doc.data().Name,
                    'weightin': doc.data().Weight,
                    'id': doc.id
                })
            });


            const dbdrink = await firebase.firestore().collection("Menu").where("Userid", "==", this.userid ? this.userid : "")
            const snapshot2 = await dbdrink.get()
            snapshot2.forEach(doc => {
                this.menulist.push({
                    'id': doc.id, 'ingre': doc.data().ingredient,
                });
            }
            );



            (await firebase.firestore().collection("order").where("Userid", "==", this.userid ? this.userid : "").where("table", "==", this.data).get()).forEach(doc => {

                orderid = doc.id;
                for (let item of doc.data().order) {
                    entry2.push({ 'id': item.id, 'amount': item.qty });
                }

            });

            for (let item2 in this.menulist) {
                for (let item in entry2) {

                    if (this.menulist[item2].id == entry2[item].id) {
                        for (let ing in this.menulist[item2].ingre) {
                            inginit.push({
                                'ingid': this.menulist[item2].ingre[ing].id,
                                'ingweigth': this.menulist[item2].ingre[ing].qty,
                                'amount': entry2[item].amount
                            })
                        }
                    }
                }
            }


            for (let inge of ing) {
                for (let menuitem of inginit) {
                    if (inge.id == menuitem.ingid) {
                        inge.weightin = inge.weightin - (menuitem.ingweigth * menuitem.amount);
                        await firebase.firestore().collection("ingredient").doc(inge.id).update({
                            Weight: inge.weightin, Userid: this.userid,
                        });
                    }
                }
            }

            let myOrderList = this.orderList.filter(function (value) {
                return value.qty > 0
            })
            const puthistory = await firebase.firestore().collection("history");
            puthistory.add({
                allsum: this.sum,
                table: this.data,
                Userid: this.userid,
                order: myOrderList,
                datetime: new Date()
            });
            (await firebase.firestore().collection("order").where("table", "==", this.data).get()).forEach(doc => {

                orderid = doc.id;

            });
            const cancel = firebase.firestore().collection("order").doc(orderid).delete();
            this.router.navigate(['/table'])
                .then(() => {
                    window.location.reload();
                });
        }
      
    }

    async cancel() {
        var orderid;
        if (this.check === true) {
            (await firebase.firestore().collection("order").where("table", "==", this.data).get()).forEach(doc => {
                
                orderid = doc.id;

            });

          
            let alert = await this.alertCtrl.create({
                cssClass: 'my-custom-class',
                header: 'Confirm to delete',
                message: 'Order in table: ' + " " + this.orderdetail.table,
                buttons: [

                    {
                        text: 'Cancel',
                        role: 'cancel',
                        cssClass: 'secondary',
                        handler: (blah) => {
                            console.log('Confirm Cancel: blah');
                            
                        }
                    }, {
                        text: 'Okay',
                        handler: () => {
                            console.log('Confirm Okay');
                            const cancel =  firebase.firestore().collection("order").doc(orderid).delete();
                            this.router.navigate(['/table'])
                                .then(() => {
                                    window.location.reload();
                                });
                        }
                    }
                ]
            });
         
            await alert.present();
            
        } else {
            this.router.navigate(['/table'])
                .then(() => {
                    window.location.reload();
                });
        }
    }





    logout() {
        this.authService.logoutUser()
            .then(res => {
                console.log(res);
                this.navCtrl.navigateBack('');
            })
            .catch(error => {
                console.log(error);
            })
    }


    openMenu() {
        this.menu.open();

    }

    async ngOnInit() {

        await this.authService.userDetails().subscribe(async (res) => {

            if (res !== null) {

                this.userEmail = res.email;
                this.userid = res.uid;


                const dbf = await firebase.firestore().collection("Menu").where("Userid", "==", this.userid ? this.userid : "")
                const snapshot = await dbf.get();
                this.drinkList = [];
                snapshot.forEach(doc => {
                    //   console.log(doc.id, '=>', doc.data());

                    var entry = {
                        'name': doc.data().Name,
                        'price': doc.data().Price,
                        'profit': doc.data().Profit,
                        'id': doc.id,
                    };

                    this.drinkList.push(entry);
                    //      console.log(this.drinkList);
                });


            } else {
                this.router.navigate(['/table'])
                    .then(() => {
                        window.location.reload();
                    });
            }


            this.orderList = this.drinkList.map((e) => {
                console.log(e);
                /* e["namein"] = "";
                 e["weightin"] = 0;*/
                e["qty"] = 0;
                e["sum"] = 0;
                e["amount"] = 0;
                return e
            });
            if (this.check == true) {
                for (let item1 in this.drinkList) {
                    for (let item2 in this.orderdetail.order) {


                        if (this.drinkList[item1].name == this.orderdetail.order[item2].name) {
                            this.drinkList[item1].qty = this.orderdetail.order[item2].qty;
                            this.drinkList[item1].sum = this.orderdetail.order[item2].sum;
                            this.drinkList[item1].amount = this.orderdetail.order[item2].amount;
                        }

                    }
                }
            }

            console.log(this.drinkList);
            console.log(this.orderList);



        }, err => {
            console.log('err', err);
        })

    }

}
