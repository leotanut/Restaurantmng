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


export class DashboardPage {

    name: string;
    power: string;
    userEmail: string;
    adding: { name: string; weight: number };
    weight1: number;

    geting = [];
    drinkList = [];
    foodList = [];
    dessertList = [];
    taskName: string;
    weight: string;
    weightList = [];
    protected userid: string;
    inadd = false;
    mindate: string = new Date().toISOString();
    maxdate: any = (new Date()).getFullYear() + 5;

    constructor(
        private navCtrl: NavController,
        public alertCtrl: AlertController,
        private authService: AuthenticateService,


    ) { }
    cancel() {
        this.inadd = false;
        this.display();
        this.taskName = '';
        this.weight = '';
    }
    cancelexist() {
        this.addexis = false;
        this.display();
        this.taskName = '';
        this.weight = '';
    }
    display() {
        if (this.inadd = false) {
            document.getElementById("addid").style.display = "none";
        } else if (this.show = false) {
            document.getElementById("showid").style.display = "none"
        } else if (this.addexis = false) {
            document.getElementById("exstid").style.display = "none"
        }
      
    }
    add() {
        this.inadd = true;
    }
    hide(index) {
        this.drinkList[index].selectshow = false;
        this.show = false;
        this.display();
    }
    async deletesubdrink(ing,i) {
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
                            this.drinkList[index].subing.splice(i, 1);
                            if (this.drinkList[index].subing.length !== 0) {
                                const db = firebase.firestore();
                                ing.power = 0;
                                for (let item of this.drinkList[index].subing) {
                                    ing.power = Number(ing.power) + Number(item.Weight);

                                }
                                //   let index1 = index.toString();
                                db.collection('ingredient').doc(ing.id).set({
                                    Name: ing.name,
                                    Weight: ing.power,
                                    Userid: this.userid,
                                    SubIng: this.drinkList[index].subing,
                                });
                                this.getdrink();
                            } else if (this.drinkList[index].subing.length == 0){
                                const db = firebase.firestore();                             
                                db.collection('ingredient').doc(ing.id).delete();
                                this.getdrink();
                            }
                        }
                    }
                }
            ]
        });

        await alert.present();
       
    }
    navigateToSalepage() {
        this.navCtrl.navigateForward('/table');
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

    expdate: Date;
    show = false;
    addexis = false;

    async showinit(index) {
       
        this.drinkList[index].selectshow = true;
        this.show = true;
    }


    async addexistdis(index) {
        this.drinkList[index].selectadd = true;
        this.addexis = true;
    }

  
    exstweight: number;


    async addexist(ing,index) {

      
            for (let item of ing.subing) {
                if (new Date(this.expdate).toLocaleDateString() === new Date(item.Expiredate.toDate()).toLocaleDateString()) {
                    item.Weight = Number(item.Weight) + Number(this.exstweight)
                    break;

                } else if (this.expdate != undefined && item.Expiredate != undefined) {
                    console.log(new Date(this.expdate).toLocaleDateString());
                    console.log(new Date(item.Expiredate.toDate()).toLocaleDateString());
                    ing.subing.push({
                        "Weight": this.exstweight,
                        "Expiredate": new Date(this.expdate),
                    })

                    break;
                } else {
                    ing.subing.push({
                        "Weight": this.exstweight,
                        "Expiredate": new Date(this.expdate),
                    })
                    break;
                }

            }
            ing.power = 0;
            for (let item of ing.subing) {
                ing.power = Number(ing.power) + Number(item.Weight);

            }
            const exist = await firebase.firestore().collection("ingredient");
            exist.doc(ing.id).set({
                Name: ing.name,
                Weight: ing.power,
                Userid: this.userid,
                SubIng: ing.subing,
            });

            this.drinkList[index].subing.push({
                "Weight": this.exstweight,
                "Expiredate": new Date(this.expdate),
            })
            this.exstweight = undefined;
            this.expdate = undefined;
            //    this.addexis = false;
            //     this.display();
            this.getdrink();
        
    }

    async getdrink() {
        const dbdrink = await firebase.firestore().collection("ingredient").where("Userid", "==", this.userid ? this.userid : "");
        const snapshot2 = await dbdrink.get();
        this.drinkList = [];
        snapshot2.forEach(doc => {
            console.log(doc.id, '=>', doc.data());

         
            var entry = {
                'name': doc.data().Name,
                'power': doc.data().Weight,
                'id': doc.id,
                'subing': doc.data().SubIng,
                'selectshow': false,
                'selectadd': false,
            };
           
            this.drinkList.push(entry);
 


        });
    }
    async adddrink() {
         console.log(this.drinkList);
        const db = await firebase.firestore();
        let type = "drink";
        let ingredient = this.taskName;
        let expdate = this.expdate;
        let weight1 = this.weight;
        let s = [];
        s.push({ Expiredate: new Date (expdate), Weight: weight1 })

        if (this.taskName.length > 0 && this.weight.length > 0) {
          
        await db.collection('ingredient').add
            ({
                Name: ingredient,
                Weight: weight1,
                Userid: this.userid,
                type: type,
                SubIng: s,
        }).then(function (docRef) {
            console.log("Document written with ID: ", docRef.id);
        }).catch(e => {
            console.error("firestoreError: " + e);
        })
            s.pop();
            s.push({
                Expiredate: new Date(expdate).toLocaleDateString(), Weight: weight1 
            })
        var entry = {
                'name': this.taskName,
                'power': this.weight,
                'expdate': this.expdate,
                'subing': s,
            };
            this.drinkList.push(entry);
      
        this.taskName = "";
        this.weight = "";
        this.expdate = undefined;

        }
        this.getdrink();
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
             
                     if (data.editWeight != "") {
                        this.weightList[index1] = data.editWeight;
                     }
                     let id = index1.toString();
                     console.log(data.editWeight + "  " + id);
                     const db = firebase.firestore();
                     db.collection('ingredient').doc(id).update({ Weight: data.editWeight, Userid: this.userid });
                     let w = data.editWeight;
                     var entry = {
                       'name': this.taskName,
                         'power': w
                     };
                     let task = this.foodList[index1];
                     task.power = entry.power;

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
                    const db = firebase.firestore();
                    db.collection('ingredient').doc(ing.id).update({ Weight: data.editWeight, Userid: this.userid });
                    let w = data.editWeight;
                    var entry = {
                        'name': this.taskName,
                        'power': w
                    };
                    let task = this.drinkList[index1];
                    task.power = entry.power;
                   
                }
                
            }
            ]
        });

        await alert.present();

    }

    async updatesubdrink(sub, ing) {

        let alert = await this.alertCtrl.create({
            cssClass: 'my-custom-class',
            header: 'Update Weight?',
            message: 'Type in your new weight to update.',
            inputs: [{ name: 'editWeight', placeholder: 'Weight' }],

            buttons: [{ text: 'Cancel', role: 'cancel' },
            {
                text: 'Update', handler: data => {
                    if (data.editWeight != "") {
                        sub.Weight = data.editWeight;
                        console.log(data.editWeight);
                        ing.power = 0;
                        for (let item of ing.subing) { 
                            ing.power = Number(ing.power) + Number(item.Weight);
                        }
                    }
                  
                    const db = firebase.firestore();
                    db.collection('ingredient').doc(ing.id).set({
                        Name: ing.name,
                        Weight: ing.power,
                        Userid: this.userid,
                        SubIng: ing.subing,
                    });
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

                const dbdrink = await firebase.firestore().collection("ingredient").where("Userid", "==", this.userid ? this.userid : "");
                const snapshot2 = await dbdrink.get();
                this.drinkList = [];
                snapshot2.forEach(doc => {
                    console.log(doc.id, '=>', doc.data());

                /*    var entry2 = {
                        type: 'checkbox',
                        label: doc.data().Name,
                        value: {
                            name: doc.data().Name, id: doc.id, qty: '',
                        },
                        

                    };*/
                 
                    var entry = {
                        'name': doc.data().Name,
                        'power': doc.data().Weight,
                        'id': doc.id,
                        'subing': doc.data().SubIng,
                        'selectshow': false,
                        'selectadd':false,
                    };
                    //this.geting.push(entry2)
                    this.drinkList.push(entry);
                  //  console.log(this.drinkList);
                    
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
