import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { AuthenticateService } from '../services/authentication.service';
import * as firebase from 'firebase';
import { async } from '@angular/core/testing';
var user = firebase.auth().currentUser;
import { ActivatedRoute } from '@angular/router';

import { Router } from '@angular/router';
//Side Menu
import { MenuController } from '@ionic/angular';
import { Variable } from '@angular/compiler/src/render3/r3_ast';

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
                    console.log("go1");
                    this.sum = this.orderdetail.allsum;
                    this.check = true;
                } else {
                    this.data = this.router.getCurrentNavigation().extras.state.table;
                    this.sum = 0;
                    console.log("go2");
                    this.check = false;
                };





            }

        });

    }

    // increment product qty
    incrementQty(index) {
        console.log(this.orderdetail);
        console.log(this.tablenum);

        //  console.log(this.orderList);

        // console.log(this.drinkList[index].name + this.drinkList[index].qty + 1);
        this.orderList[index].qty += 1;
        let task = this.orderList[index];
        task.sum = task.price * task.qty;
        this.updatesum();

    }

    decrementQty(index) {
        if (this.orderList[index].qty - 1 < 0) {
            this.orderList[index].qty = 0
            console.log('1 ->' + this.orderList[index].qty);
        } else {
            this.orderList[index].qty -= 1;
            console.log('2 ->' + this.orderList[index].qty);
        }
        let task = this.orderList[index];
        task.sum = task.price * task.qty;
        this.updatesum();

    }
    updatesum() {
        let allsum: number = 0;

        for (let item of this.orderList) {
            //   console.log(typeof(item.sum))
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
    Ordered2() {
        this.drinkList = [""];
        this.navCtrl.navigateForward('/table');
    }


    async Ordered() {
        //Retrieve weight data from database put in to orderList[]

        if (this.check === true) {
            console.log("come111");
            const makeodr = await firebase.firestore().collection("order");


            (await makeodr.where("Userid", "==", this.userid ? this.userid : "").where("table", "==", this.data).get()).forEach(doc => {
                //  console.log(doc.id, '=>', doc.data());

                orderid = doc.id;

            });
            console.log(orderid);

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
            this.navCtrl.navigateForward('/table');
        } else {
            var orderid;
            const makeodr = await firebase.firestore().collection("order");
            makeodr.add({ table: this.data, Userid: this.userid, });

            (await makeodr.where("Userid", "==", this.userid ? this.userid : "").where("table", "==", this.data).get()).forEach(doc => {
                //  console.log(doc.id, '=>', doc.data());

                orderid = doc.id;

            });
            console.log(orderid);

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
            this.navCtrl.navigateForward('/table');
        }


    }

    async charge() {
        if (this.check === true) {
            var orderid;
            let entry = [];
            let entry2 = [];
            const ordercut1 = await firebase.firestore().collection("Food").where("Userid", "==", this.userid ? this.userid : "");
            const snapshot1 = await ordercut1.get();
            snapshot1.forEach(doc => {

                entry.push({

                    'namein': doc.data().ingredient.name,
                    'weightin': doc.data().ingredient.weight
                })
            });
            for (let item in entry) {
                this.orderList[item].namein = entry[item].namein;
                this.orderList[item].weightin = entry[item].weightin;
                this.orderList[item].amount = this.orderList[item].qty * this.orderList[item].weightin;

            }
            console.log(this.orderList);
            //Retrieve weight data name data from database put in to orderList[]

            const ordercut2 = await firebase.firestore().collection("ingredient").where("Userid", "==", this.userid ? this.userid : "");
            const snapshot2 = await ordercut2.get();
            snapshot2.forEach(doc => {

                var entry = {
                    'namest': "",
                    'weightst': 0,
                    'id': 0,
                };
                entry2.push({
                    'namest': doc.data().Name,
                    'weightst': doc.data().Weight,
                    'id': doc.id
                });
                this.cutstocker2.push(entry);

            });


            for (let item1 in entry2) {
                this.cutstocker2[item1].namest = entry2[item1].namest;
                this.cutstocker2[item1].weightst = entry2[item1].weightst;
                this.cutstocker2[item1].id = entry2[item1].id;

                for (let item2 in entry) {
                    if (this.cutstocker2[item1].namest == this.orderList[item2].namein) {
                        this.cutstocker2[item1].weightst = this.cutstocker2[item1].weightst - this.orderList[item2].amount;

                        const ordercut3 = await firebase.firestore().collection("ingredient").doc(this.cutstocker2[item1].id).update({
                            Weight: this.cutstocker2[item1].weightst, Userid: this.userid,
                        });
                    }

                }

            }
            console.log(this.cutstocker2);
            let myOrderList = this.orderList.filter(function (value) {
                return value.qty > 0
            })
            const puthistory = await firebase.firestore().collection("history");
            puthistory.add({
                allsum: this.sum,
                table: this.data,
                Userid: this.userid,
                order: myOrderList
            });
            (await firebase.firestore().collection("order").where("table", "==", this.data).get()).forEach(doc => {
                //  console.log(doc.id, '=>', doc.data()
                orderid = doc.id;

            });
            const cancel = firebase.firestore().collection("order").doc(orderid).delete();
            this.navCtrl.navigateForward('/table');
        }
    }

    async cancel() {
        var orderid;
        if (this.check === true) {
            (await firebase.firestore().collection("order").where("table", "==", this.data).get()).forEach(doc => {
                //  console.log(doc.id, '=>', doc.data()
                orderid = doc.id;

            });

            console.log(orderid);
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
                            const cancel = firebase.firestore().collection("order").doc(orderid).delete();
                        this.navCtrl.navigateForward('/table');
                        }
                    }
                ]
            });
         
            await alert.present();
            
        } else {
            this.navCtrl.navigateForward('/table');
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


                const dbf = await firebase.firestore().collection("Food").where("Userid", "==", this.userid ? this.userid : "").where("Type", "==", "Drink");
                const snapshot = await dbf.get();
                this.drinkList = [];
                snapshot.forEach(doc => {
                    //   console.log(doc.id, '=>', doc.data());

                    var entry = {
                        'name': doc.data().Name,
                        'price': doc.data().Price
                    };

                    this.drinkList.push(entry);
                    //      console.log(this.drinkList);
                });


            } else {
                this.navCtrl.navigateBack('');
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
            for (let item1 in this.drinkList) {
                for (let item2 in this.orderdetail.order) {


                    if (this.drinkList[item1].name == this.orderdetail.order[item2].name) {
                        this.drinkList[item1].qty = this.orderdetail.order[item2].qty;
                        this.drinkList[item1].sum = this.orderdetail.order[item2].sum;
                        this.drinkList[item1].amount = this.orderdetail.order[item2].amount;
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
