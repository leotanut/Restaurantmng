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

    MenuList = [];

    constructor(
        private navCtrl: NavController,
        public alertCtrl: AlertController,
        private authService: AuthenticateService,
) {
    }

  ngOnInit() {
  }
    navigateToSalepage() {
        this.navCtrl.navigateForward('/sale-page');
    }
    async addmenu() {

        let alert = await this.alertCtrl.create({
            cssClass: 'my-custom-class',
            header: 'Add new menu',
            message: 'Type in your new menu name.',
            inputs: [{ name: 'newmenu', placeholder: 'Name' }],

            buttons: [{ text: 'Cancel', role: 'cancel' },
            {
                text: 'Update', handler: data => {
                    let menu = data.newmenu;
                    var entry = {
                        'name': menu,
                    };
                    this.MenuList.push(entry)
                    /*
                        if (data.editTask != "") {
                             this.taskList[index1] = data.editTask;
    
                         }

                   if (data.newmenu != "") {
                        this.weightList[index1] = data.newmenu;
                    }*/
                    

                    //sessionStorage.setItem("reloading", "true");
                    // document.location.reload();
                }
            }
            ]
        });

        await alert.present();

    }
}



