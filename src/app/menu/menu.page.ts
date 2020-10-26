import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { AuthenticateService } from '../services/authentication.service';
import * as firebase from 'firebase';
import { async } from '@angular/core/testing';
var user = firebase.auth().currentUser;

@Component({
    selector: 'app-menu',
    templateUrl: './menu.page.html',
    styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
    getmenu = [];
    add = false;
    update = false;
    MenuList = [];
    menuname: string;
 
    userEmail: string;
    userid: string;
    ing = [];
    qty: number;
    profit: number;
    price: number;
    validate = '';
    constructor(
        private navCtrl: NavController,
        public alertCtrl: AlertController,
        private authService: AuthenticateService,
    ) { }

    async ngOnInit() {

        await this.authService.userDetails().subscribe(async (res) => {

            if (res !== null) {

                this.userEmail = res.email;
                this.userid = res.uid;
                const dbdrink = await firebase.firestore().collection("ingredient").where("Userid", "==", this.userid ? this.userid : "");
                const snapshot2 = await dbdrink.get();
               
                snapshot2.forEach(doc => {
                    console.log(doc.id, '=>', doc.data());

                   
                    var entry2 = {
                        type: 'checkbox',
                        label: doc.data().Name,
                        value: {
                            name: doc.data().Name, id: doc.id, qty: '',
                        },
                       

                    };
                   
                    this.ing.push(entry2);

                });
                const getmenu = await firebase.firestore().collection("Menu").where("Userid", "==", this.userid ? this.userid : "");
                const snapshot = await getmenu.get();
                this.getmenu = [];
                snapshot.forEach(doc => {
                    console.log(doc.id, '=>', doc.data());

                    var entry = {
                        'name': doc.data().Name,
                        'price': doc.data().Price,
                        'id': doc.id,
                        'ingredient': doc.data().ingredient,
                        'select': false,
                    };
                    
                    this.getmenu.push(entry);

                });
            } else {
                this.navCtrl.navigateBack('');
            }
        }, err => {
            console.log('err', err);
        })




    }


    navigateToSalepage() {
        this.navCtrl.navigateForward('/table');
    }
    async addmenu() {
        if (this.menuname !== undefined) {
            let alert = await this.alertCtrl.create({
                cssClass: 'my-custom-class',
                header: 'Add new menu ' + this.menuname,
                message: 'Add in your ingredient to cut the stock',
                inputs: this.ing,
                buttons: [{ text: 'Cancel', role: 'cancel' },
                {
                    text: 'Add', handler: (data) => {
                        if (data != []) {
                            console.log(data);
                            this.MenuList = data;
                            console.log(this.MenuList);
                            this.add = true;
                        }
                    }
                }]

            });
            await alert.present();
        }
    }
    id: "";
    i = "";
    async updatemenu(menuid,index) {
        this.id = menuid;
        this.i = index;
        for (let item of this.getmenu) {
            if (item.id == menuid) {
        let alert = await this.alertCtrl.create({
            cssClass: 'my-custom-class',
            header: 'Update menu ' + item.name,
            message: 'Update your ingredient to cut the stock',
            inputs: this.ing,
            buttons: [{ text: 'Cancel', role: 'cancel' },
            {
                text: 'Update', handler: (data) => {
                    if (data != []) {
                        console.log(data);
                        this.MenuList = data;
                        console.log(this.MenuList);
                        this.update = true;
                        this.getmenu[index].select = true;
                    }
                }
            }]

        });
                await alert.present();
            }
       }
       
    } Check = true;
    
    async confirmupdate() {
        if (this.isNumber(this.price) || this.isNumber(this.profit)) {
            for (let item of this.MenuList) {
                if (this.isNumber(item.qty)) {
                    this.Check = true;
                } else {
                    this.validate = "Please enter number"
                    this.Check = false;
                    { break; }
                }
            }
            if (this.Check == true) {
                this.getmenu[this.i].select = false;
                document.getElementById("up").style.display = "none";
                const up = await firebase.firestore().collection("Menu");
                up.doc(this.id).update({
                    Price: this.price,
                    Profit: this.profit,
                    Userid: this.userid,
                    ingredient: this.MenuList,
                });
                const getmenu = await firebase.firestore().collection("Menu").where("Userid", "==", this.userid ? this.userid : "");
                const snapshot = await getmenu.get();
                this.getmenu = [];
                snapshot.forEach(doc => {
                    console.log(doc.id, '=>', doc.data());

                    var entry = {
                        'name': doc.data().Name,
                        'price': doc.data().Price,
                        'id': doc.id,
                        'ingredient': doc.data().ingredient,
                    };

                    this.getmenu.push(entry);

                });
             
            }
        }else {
            this.validate = "Please enter number"
        }

    }
    
    async confirmmenu() {
        if (this.isNumber(this.price) || this.isNumber(this.profit)) {
            for (let item of this.MenuList) {
                if (this.isNumber(item.qty)) {
                    this.Check = true;
                } else {
                    this.validate = "Please enter number";
                    this.Check = false;
                    { break; }
                }
            }
            if (this.Check == true) {
               document.getElementById("add").style.display = "none";
                    const addmenu = await firebase.firestore().collection("Menu");
                    addmenu.add({
                        Name: this.menuname,
                        Price: this.price,
                        Profit: this.profit,
                        Userid: this.userid,
                        ingredient: this.MenuList,

                    });
                 
                   const getmenu = await firebase.firestore().collection("Menu").where("Userid", "==", this.userid ? this.userid : "");
                    const snapshot = await getmenu.get();
                   this.getmenu = [];
                    snapshot.forEach(doc => {
                        console.log(doc.id, '=>', doc.data());

                        var entry = {
                            'name': doc.data().Name,
                            'price': doc.data().Price,
                            'id': doc.id,
                            'ingredient': doc.data().ingredient,
                        };

                        this.getmenu.push(entry);

                    });
                  
}
               
        } else {
            this.validate = "Please enter number"
        }
       
    }
    cancelupdate() {
        document.getElementById("up").style.display = "none";
        this.update = false;
        this.getmenu[this.i].select = false;
    }
    canceladd() {
        this.menuname = '';
        document.getElementById("add").style.display = "none";
        this.add = false;

    }
    async delete(i) {
        let index = this.getmenu.indexOf(i);
        let task = this.getmenu[index];
        let alert = await this.alertCtrl.create({
            cssClass: 'my-custom-class',
            header: 'Confirm to delete',
            message: 'Menu: ' + " " + task.name,
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
                        if (index > -1) {
                            this.getmenu.splice(index, 1);
                            const db = firebase.firestore();
                            let index1 = index.toString();
                            db.collection('Menu').doc(i.id).delete();
                        }
                    }
                }
            ]
        });

        await alert.present();
    }
     isNumber(n) {
    return !isNaN(parseFloat(n)) && !isNaN(n - 0);
}




}