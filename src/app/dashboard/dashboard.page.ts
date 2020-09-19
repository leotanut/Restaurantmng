import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { AuthenticateService } from '../services/authentication.service';
import * as firebase from 'firebase';
import { async } from '@angular/core/testing';
var user = firebase.auth().currentUser;
import { AngularFirestore } from '@angular/fire/firestore';
import { ModalController } from '@ionic/angular';

//var uid;
/*if (user != null) {
    uid = user.getIdToken();
}*/

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.page.html',
    styleUrls: ['./dashboard.page.scss'],
})


export class DashboardPage  {
    name: string;
    power: string;
    userEmail: string;
    adding: { name: string; weight: number };  
    weight1: number;

    drinkList = [];
    foodList = [];
    dessertList = [];
    taskName: string;
    weight: string;
    weightList = [];
    protected userid: string;


    constructor(
        private navCtrl: NavController,
        public alertCtrl: AlertController,
        private authService: AuthenticateService,

       
    ) { }
    navigateToSalepage() {
        this.navCtrl.navigateForward('/sale-page');
    }
    async addfood() {
        console.log(user)
        if (this.taskName.length > 0 && this.weight.length > 0) {
            var entry = {
                'name': this.taskName,
                'power': this.weight
            };
            this.foodList.push(entry);
         
           
        }
      //  this.foodList = this.taskList;
        console.log(this.foodList);
        const db = await firebase.firestore();
        let type = "food";
        let ingredient = this.taskName;
        let weight = this.weight;
        let id = (this.foodList.length - 1).toString();
        await db.collection('ingredient').doc(id).set({
            Name: ingredient,
            Weight: weight,
            Userid: this.userid,
            type: type,
        }).catch(e => {
            console.error("firestoreError: " + e);
        })

        this.taskName = "";
        this.weight = "";
    }


    async adddrink() {
        console.log(user)
        if (this.taskName.length > 0 && this.weight.length > 0) {
            var entry = {
                'name': this.taskName,
                'power': this.weight
            };
            this.drinkList.push(entry);


        }
        //  this.foodList = this.taskList;
        console.log(this.drinkList);
        const db = await firebase.firestore();
        let type = "drink";
        let ingredient = this.taskName;
       
        let weight1 = this.weight;
       // let id = (this.drinkList.length - 1).toString();
     /*   await db.collection('ingredient').doc(id).set({
            Name: ingredient,
            Weight: weight,
            Userid: this.userid,
            type: type,
        })*/ await db.collection('ingredient').add
            ({
            Name: ingredient,
            Weight: weight1,
            Userid: this.userid,
            type: type,
        }).then(function (docRef) {
            console.log("Document written with ID: ", docRef.id);
        }).catch(e => {
            console.error("firestoreError: " + e);
        })

        this.taskName = "";
        this.weight = "";
    }

    async adddessert() {
        console.log(user)
        if (this.taskName.length > 0 && this.weight.length > 0) {
            var entry = {
                'name': this.taskName,
                'power': this.weight
            };
            this.dessertList.push(entry);


        }
        //  this.foodList = this.taskList;
        console.log(this.dessertList);
        const db = await firebase.firestore();
        let type = "dessert";
        let ingredient = this.taskName;
        let weight = this.weight;
        let id = (this.dessertList.length - 1).toString();
        await db.collection('ingredient').doc(id).set({
            Name: ingredient,
            Weight: weight,
            Userid: this.userid,
            type: type,
        }).catch(e => {
            console.error("firestoreError: " + e);
        })

        this.taskName = "";
        this.weight = "";
    }


    async    deletedrink(ing) {
        let index = this.drinkList.indexOf(ing);
        let task = this.drinkList[index];
        let alert = await this.alertCtrl.create({
            cssClass: 'my-custom-class',
            header: 'Confirm to delete',
            message: 'ingredient: ' + " " + task.name,
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
                            this.drinkList.splice(index, 1);
                            const db = firebase.firestore();
                            let index1 = index.toString();
                            db.collection('ingredient').doc(ing.id).delete();
                        }
                    }
                }
            ]
        });

        await alert.present();
    }


    async    deletedessert(index) {
        let task = this.dessertList[index];
        let alert = await this.alertCtrl.create({
            cssClass: 'my-custom-class',
            header: 'Confirm to delete',
            message: 'ingredient: ' + " " + task.name,
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
                        this.dessertList.splice(index, 1);
                        const db = firebase.firestore();
                        let index1 = index.toString();
                        db.collection('ingredient').doc(index1).delete();
                    }
                }
            ]
        });

        await alert.present();
    }


    async    deletefood(index) {
        let task = this.foodList[index];
        let alert = await this.alertCtrl.create ({
                cssClass: 'my-custom-class',
            header: 'Confirm to delete',
            message: 'ingredient: ' + " " + task.name,
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
                            this.foodList.splice(index, 1);
                          const db = firebase.firestore();
                        let index1 = index.toString();
                    db.collection('ingredient').doc(index1).delete();
                        }
                    }
                ]
            });

            await alert.present();
         }

    async updatefood(index1) {
       
         let alert = await this.alertCtrl.create({
                cssClass: 'my-custom-class',
                header: 'Update Weight?',
                message: 'Type in your new weight to update.',
             inputs: [{ name: 'editWeight', placeholder: 'Weight' }],
           
             buttons: [{ text: 'Cancel', role: 'cancel' },
             {
                 text: 'Update', handler: data => {
                     

                /*     if (data.editTask != "") {
                         this.taskList[index1] = data.editTask;

                     }*/

                     if (data.editWeight != "") {
                        this.weightList[index1] = data.editWeight;
                     }
                     let id = index1.toString();
                     console.log(data.editWeight + "  " + id);
                     const db = firebase.firestore();
                     db.collection('ingredient').doc(id).update({ Weight: data.editWeight, Userid: this.userid });
                     let w = data.editWeight;
                  //   this.taskList.push(this.taskName + " " + w);
                     var entry = {
                       'name': this.taskName,
                         'power': w
                     };
                     let task = this.foodList[index1];
                     task.power = entry.power;

               //sessionStorage.setItem("reloading", "true");
                    // document.location.reload();
                 }
              }
           ]
            });

        await alert.present();
        
    }
    async updatedrink(index1,ing) {

        let alert = await this.alertCtrl.create({
            cssClass: 'my-custom-class',
            header: 'Update Weight?',
            message: 'Type in your new weight to update.',
            inputs: [{ name: 'editWeight', placeholder: 'Weight' }],

            buttons: [{ text: 'Cancel', role: 'cancel' },
            {
                text: 'Update', handler: data => {
                    console.log(ing);

                    /*     if (data.editTask != "") {
                             this.taskList[index1] = data.editTask;
    
                         }*/

                    if (data.editWeight != "") {
                        this.weightList[index1] = data.editWeight;
                    }
                    let id = index1.toString();
                    console.log(data.editWeight + "  " + id);
                    const db = firebase.firestore();
                    db.collection('ingredient').doc(ing.id).update({ Weight: data.editWeight, Userid: this.userid });
                    let w = data.editWeight;
                    //   this.taskList.push(this.taskName + " " + w);
                    var entry = {
                        'name': this.taskName,
                        'power': w
                    };
                    let task = this.drinkList[index1];
                    task.power = entry.power;
                    //sessionStorage.setItem("reloading", "true");
                    // document.location.reload();
                }
                
            }
            ]
        });

        await alert.present();

    }
    async updatedessert(index1) {

        let alert = await this.alertCtrl.create({
            cssClass: 'my-custom-class',
            header: 'Update Weight?',
            message: 'Type in your new weight to update.',
            inputs: [{ name: 'editWeight', placeholder: 'Weight' }],

            buttons: [{ text: 'Cancel', role: 'cancel' },
            {
                text: 'Update', handler: data => {


                    /*     if (data.editTask != "") {
                             this.taskList[index1] = data.editTask;
    
                         }*/

                    if (data.editWeight != "") {
                        this.weightList[index1] = data.editWeight;
                    }
                    let id = index1.toString();
                    console.log(data.editWeight + "  " + id);
                    const db = firebase.firestore();
                    db.collection('ingredient').doc(id).update({ Weight: data.editWeight, Userid: this.userid });
                    let w = data.editWeight;
                    //   this.taskList.push(this.taskName + " " + w);
                    var entry = {
                        'name': this.taskName,
                        'power': w
                    };
                    let task = this.dessertList[index1];
                    task.power = entry.power;
                    //sessionStorage.setItem("reloading", "true");
                    // document.location.reload();
                }
            }
            ]
        });

        await alert.present();

    }
    async ngOnInit() {

        await this.authService.userDetails().subscribe(async (res) => {
           
            if (res !== null) {
               
                this.userEmail = res.email;
                this.userid = res.uid;

                
                const dbf = await firebase.firestore().collection("ingredient").where("Userid", "==", this.userid ? this.userid : "").where("type", "==", "food");
                const snapshot = await dbf.get();
                this.foodList = [];
                snapshot.forEach(doc => {
                    console.log(doc.id, '=>', doc.data());
          
                    var entry = {
                        'name': doc.data().Name,
                        'power': doc.data().Weight
                    };

                    this. foodList.push(entry);

                });

                const dbdrink = await firebase.firestore().collection("ingredient").where("Userid", "==", this.userid ? this.userid : "").where("type", "==", "drink");
                const snapshot2 = await dbdrink.get();
                this.drinkList = [];
                snapshot2.forEach(doc => {
                    console.log(doc.id, '=>', doc.data());

                    var entry = {
                        'name': doc.data().Name,
                        'power': doc.data().Weight,
                        'id': doc.id
                    };

                    this.drinkList.push(entry);

                });
                const dbdess = await firebase.firestore().collection("ingredient").where("Userid", "==", this.userid ? this.userid : "").where("type", "==", "dessert");
                const snapshot3 = await dbdess.get();
                this.dessertList = [];
                snapshot3.forEach(doc => {
                    console.log(doc.id, '=>', doc.data());

                    var entry = {
                        'name': doc.data().Name,
                        'power': doc.data().Weight
                    };

                    this.dessertList.push(entry);

                });
             /*   console.log(this.foodList);
                console.log(this.userid);*/

            } else {
                this.navCtrl.navigateBack('');
            }
        }, err => {
            console.log('err', err);
        })


       

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

  /*  taskList = [];
    addTask() {
        if (this.taskName.length > 0) {
            let task = this.taskName;
            this.taskList.push(task);
            this.taskName = "";
        }
    }*/
}
