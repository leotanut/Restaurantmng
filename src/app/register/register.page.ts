// register.page.ts
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthenticateService } from '../services/authentication.service';
import { NavController } from '@ionic/angular';
import * as firebase from 'firebase';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
})

export class RegisterPage implements OnInit {

   
    validations_form: FormGroup;
    errorMessage: string = '';
    successMessage: string = '';

    validation_messages = {
        'email': [
            { type: 'required', message: 'Email is required.' },
            { type: 'pattern', message: 'Enter a valid email.' }
        ],
        'password': [
            { type: 'required', message: 'Password is required.' },
            { type: 'minlength', message: 'Password must be at least 5 characters long.' }
        ],
        'fname': [
            { type: 'required', message: 'Firstname is required.' },
            { type: 'minlength', message: 'Firstname must be at least 3 characters long.' }
        ],
        'lname': [
            { type: 'required', message: 'Firstname is required.' },
            { type: 'minlength', message: 'Firstname must be at least 3 characters long.' }
        ]
    };
    
    constructor(
        private navCtrl: NavController,
        private authService: AuthenticateService,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit() {
        this.validations_form = this.formBuilder.group({
            email: new FormControl('', Validators.compose([
                Validators.required,
                Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
            ])),
            password: new FormControl('', Validators.compose([
                Validators.minLength(5),
                Validators.required
            ])),
            fname: new FormControl('', Validators.compose([
                Validators.minLength(3),
                Validators.required
            ])),
            lname: new FormControl('', Validators.compose([
                Validators.minLength(3),
                Validators.required
            ]))
        });
    }

    tryRegister(value, userInfo) {
        this.authService.registerUser(value)
            .then(res => {
                this.errorMessage = "";
                this.successMessage = "Your account has been created. Please log in.";

                //prepare to create new correction
                let uid = res.user.uid;
                let fname = value.fname;
                let lname = value.lname;

                const db = firebase.firestore();
                db.collection('userInfo').doc(uid).set({
                    fname: fname,
                    lname: lname
                }).catch(e => {
                    console.error("firestoreError: " + e);
                })
            }, err => {
                console.log(err);
                this.errorMessage = err.message;
                this.successMessage = "";
            })
    }

    goLoginPage() {
        this.navCtrl.navigateBack('login');
    }


}