import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

//Common side
import { LoginPage } from '../pages/common/login-page/login-page'
import { UIDecider } from '../pages/common/ui-decider/ui-decider'
import {MessagePage} from '../pages/common/message-page/message-page'
//Manager Side
import { NewUserRequest } from '../pages/manager/new-user-request/new-user-request'
import { ManagerTabs } from '../pages/manager/manager-tabs/manager-tabs'

//Client Side
import { ClientTabs } from '../pages/client/client-tabs/client-tabs'
import { NewOrderPage } from '../pages/client/new-order-page/new-order-page'

//Tradesperson Side
import { TradesPersonTabs } from '../pages/tradesperson/trades-person-tabs/trades-person-tabs';
import { TPJobs } from '../pages/tradesperson/tp-jobs/tp-jobs'

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


import { AngularFireModule } from 'angularfire2';
//Firebase setting
var firebaseConfig = {
  apiKey: "AIzaSyCGeqA919ywNYRz0ih7k6f0GLne55bb3Ek",
  authDomain: "aegis-test-cc70c.firebaseapp.com",
  databaseURL: "https://aegis-test-cc70c.firebaseio.com",
  projectId: "aegis-test-cc70c",
  storageBucket: "aegis-test-cc70c.appspot.com",
  messagingSenderId: "371029388984"
};

@NgModule({
  declarations: [
    MyApp,UIDecider,
    LoginPage, MessagePage,
    NewUserRequest, ManagerTabs,
    ClientTabs, NewOrderPage,
    TradesPersonTabs, TPJobs
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig)

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp, UIDecider,
    LoginPage,MessagePage,
    ManagerTabs, NewUserRequest,
    ClientTabs, NewOrderPage,
    TradesPersonTabs, TPJobs
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
