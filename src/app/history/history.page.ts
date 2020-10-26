import { Component, OnInit ,ViewChild  } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { AuthenticateService } from '../services/authentication.service';
import * as firebase from 'firebase';
import { async } from '@angular/core/testing';
import { Chart } from 'chart.js';

var user = firebase.auth().currentUser;

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
    userEmail: string;
    protected userid: string;
    
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
            
        } else {
            this.navCtrl.navigateBack('');
        };

        }, err => {
            console.log('err', err);
        })
      /*  this.bars.data.labels = this.menulist;
        this.bars.update();*/
  }
    navigateToSalepage() {
        this.navCtrl.navigateForward('/table');
    }
    @ViewChild('barChart') barChart;

    bars: any;
    colorArray: any;
    entry = [];
    menulist = [];
    historylist = [];
    order_list = {};
   alltine : Date;

    async gettoday() {
        this.order_list = {};
        let menu = []
        let qty = []
        let sum = []
        let profit = []
      //  var mydate = new Date();
        var today = new Date().toLocaleDateString();
        
        console.log(today);
      
        const dbdrink = await firebase.firestore().collection("history").where("Userid", "==", this.userid ? this.userid : "")
      
        const snapshot2 = await dbdrink.get()
       
     

       snapshot2.forEach(async doc => { //loop for create object stucture
           if (new Date(doc.data().datetime.toDate()).toLocaleDateString() === today) {
               for (let item of doc.data().order) {
                   this.order_list[item.name] = {
                       sum: [],
                       qty: [],
                       profit: []
                   }
               }
           }
        });
 
        snapshot2.forEach(async doc => { //push value to object
            if (new Date(doc.data().datetime.toDate()).toLocaleDateString() === today) {
                for (let item of doc.data().order) {
                    this.order_list[item.name].sum.push(item.sum)
                    this.order_list[item.name].qty.push(item.qty)
                    this.order_list[item.name].qty.push(item.profit)
                }
            }
        });
   
        console.log(this.order_list);

    
     /*   let menu = []
        let qty = []
        let sum = []
        let profit =[]*/
        for (let item in this.order_list) {
            menu.push(item)
        }
        
        for (let menu in this.order_list) {
            for (let key in this.order_list[menu]) {
                let cal = 0
                for (let val of this.order_list[menu][key]) {
                    cal = cal + val
                }

                if (key == "sum") {
                    sum.push(cal);
                } else if (key == "qty") {
                    qty.push(cal);
                } else if (key == "profit") {
                    profit.push(cal);
                }
            }
        }
       
        this.bars.data.datasets[0].data = qty
        this.bars.data.datasets[1].data = sum
        this.bars.data.datasets[2].data = profit
        this.bars.data.labels = menu;      
        this.bars.update();
       
    } 
    async getweek() {
        this.order_list = {};
        //  var mydate = new Date();
        var current = new Date();
        var weekstart = current.getDate() - current.getDay() + 1;
        var weekend = weekstart + 6;       // end day is the first day + 6 
        var monday = new Date(current.setDate(weekstart)).toLocaleDateString();
        var sunday = new Date(current.setDate(weekend)).toLocaleDateString() ;
        console.log(sunday);


        const dbdrink = await firebase.firestore().collection("history").where("Userid", "==", this.userid ? this.userid : "")

        const snapshot2 = await dbdrink.get()
        var alltime = [];


        snapshot2.forEach(async doc => { //loop for create object stucture
            if (monday <= new Date(doc.data().datetime.toDate()).toLocaleDateString() && new Date(doc.data().datetime.toDate()).toLocaleDateString() <= sunday) {
                for (let item of doc.data().order) {
                    this.order_list[item.name] = {
                        sum: [],
                        qty: []
                    }
                }
           }
        });

        snapshot2.forEach(async doc => { //push value to object
            if (monday <= new Date(doc.data().datetime.toDate()).toLocaleDateString() && new Date(doc.data().datetime.toDate()).toLocaleDateString() <=sunday) {
                for (let item of doc.data().order) {
                    this.order_list[item.name].sum.push(item.sum)
                    this.order_list[item.name].qty.push(item.qty)
                }
            }
        });

        console.log(this.order_list);


        let menu = []
        let qty = []
        let sum = []
        for (let item in this.order_list) {
            menu.push(item)
        }

        for (let menu in this.order_list) {
            for (let key in this.order_list[menu]) {
                let cal = 0
                for (let val of this.order_list[menu][key]) {
                    cal = cal + val
                }

                if (key == "sum") {
                    sum.push(cal);
                } else if (key == "qty") {
                    qty.push(cal);
                }
            }
        }

        this.bars.data.datasets[0].data = qty
        this.bars.data.datasets[1].data = sum
        this.bars.data.labels = menu;
        this.bars.update();

    } 

    async getmonth() {
        this.order_list = {};
        {
            var now = new Date();
            var thismonth =  (now.getMonth() + 1)+ "/" + now.getFullYear()  ;

            console.log(thismonth);
         
            const dbdrink = await firebase.firestore().collection("history").where("Userid", "==", this.userid ? this.userid : "")

            const snapshot2 = await dbdrink.get()
            var alltime = [];
            /*snapshot2.forEach(doc => {
                
                if ((new Date(doc.data().datetime.toDate()).getMonth() + 1) + "/" + new Date(doc.data().datetime.toDate()).getFullYear() === thismonth) {
                    for (let item of doc.data().order) {
                        this.order_list[item.name] = {
                            sum: [],
                            qty: []
                        }
                    }
                    for (let item of doc.data().order) {
                        this.order_list[item.name].sum.push(item.sum)
                        this.order_list[item.name].qty.push(item.qty)
                    }
                }

            });*/

             snapshot2.forEach(async doc => { //loop for create object stucture
                 if ((new Date(doc.data().datetime.toDate()).getMonth() + 1) + "/" + new Date(doc.data().datetime.toDate()).getFullYear() === thismonth) {
                     for (let item of doc.data().order) {
                         this.order_list[item.name] = {
                             sum: [],
                             qty: []
                         }
                     }
                 }
             });

            snapshot2.forEach(async doc => { //push value to object
                if ((new Date(doc.data().datetime.toDate()).getMonth() + 1) + "/" + new Date(doc.data().datetime.toDate()).getFullYear() === thismonth) {
                    for (let item of doc.data().order) {
                        this.order_list[item.name].sum.push(item.sum)
                        this.order_list[item.name].qty.push(item.qty)
                    }

                }
                 });

            console.log(this.order_list);


            let menu = []
            let qty = []
            let sum = []
            for (let item in this.order_list) {
                menu.push(item)
            }

            for (let menu in this.order_list) {
                for (let key in this.order_list[menu]) {
                    let cal = 0
                    for (let val of this.order_list[menu][key]) {
                        cal = cal + val
                    }

                    if (key == "sum") {
                        sum.push(cal);
                    } else if (key == "qty") {
                        qty.push(cal);
                    }
                }
            }

            this.bars.data.datasets[0].data = qty
            this.bars.data.datasets[1].data = sum
            this.bars.data.labels = menu;
            this.bars.update();

        } 
    }
    async all() {
        this.order_list = {};
        {
           /* var now = new Date();
            var thismonth = (now.getMonth() + 1) + "/" + now.getFullYear();

            console.log(thismonth);*/

            const dbdrink = await firebase.firestore().collection("history").where("Userid", "==", this.userid ? this.userid : "")

            const snapshot2 = await dbdrink.get()
            var alltime = [];
          /*  snapshot2.forEach(doc => {
               
                    for (let item of doc.data().order) {
                        this.order_list[item.name] = {
                            sum: [],
                            qty: []
                        }
                    }
                    for (let item of doc.data().order) {
                        this.order_list[item.name].sum.push(item.sum)
                        this.order_list[item.name].qty.push(item.qty)
                    }
                

            });*/

             snapshot2.forEach(async doc => { //loop for create object stucture
                 
                 for (let item of doc.data().order) {
                     this.order_list[item.name] = {
                         sum: [],
                         qty: []
                     }
                 }
          
             });

              snapshot2.forEach(async doc => { //push value to object
                     for (let item of doc.data().order) {
                         this.order_list[item.name].sum.push(item.sum)
                         this.order_list[item.name].qty.push(item.qty)
                     }
                 });

            console.log(this.order_list);


            let menu = []
            let qty = []
            let sum = []
            for (let item in this.order_list) {
                menu.push(item)
            }

            for (let menu in this.order_list) {
                for (let key in this.order_list[menu]) {
                    let cal = 0
                    for (let val of this.order_list[menu][key]) {
                        cal = cal + val
                    }

                    if (key == "sum") {
                        sum.push(cal);
                    } else if (key == "qty") {
                        qty.push(cal);
                    }
                }
            }

            this.bars.data.datasets[0].data = qty
            this.bars.data.datasets[1].data = sum
            this.bars.data.labels = menu;
            this.bars.update();

        }
    }
    ionViewDidEnter() {
        this.createBarChart();
    }

    createBarChart() {

        this.bars = new Chart(this.barChart.nativeElement, {
            type: 'horizontalBar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Quantity',
                    data: [],
                    backgroundColor: '#ddee44', // array should have same number of elements as number of dataset
                    borderColor: '#ddee44',// array should have same number of elements as number of dataset
                    borderWidth: 1
                },
                {
                    label: 'Total Price',
                    data: [],
                    backgroundColor: '#dd1144', // array should have same number of elements as number of dataset
                    borderColor: '#dd1144',// array should have same number of elements as number of dataset
                    borderWidth: 1
                    },
                    {
                        label: 'Profit',
                        data: [],
                        backgroundColor: '#008000', // array should have same number of elements as number of dataset
                        borderColor: '#008000',// array should have same number of elements as number of dataset
                        borderWidth: 1
                    }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
        
    }
}
