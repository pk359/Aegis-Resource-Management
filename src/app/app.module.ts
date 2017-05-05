import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

//Common side
import { LoginPage } from '../pages/common/login-page/login-page'
import { UIDecider } from '../pages/common/ui-decider/ui-decider'
import {MessagePage} from '../pages/common/message-page/message-page'
import {JobDetailsPage} from '../pages/common/job-details-page/job-details-page'

//Manager Side
import { NewUserRequest } from '../pages/manager/new-user-request/new-user-request'
import { ManagerTabs } from '../pages/manager/manager-tabs/manager-tabs'
import {ManagerJobProgressPage} from '../pages/manager/job-progress-page/job-progress-page'
import {ManagerCurrentJobsPage} from '../pages/manager/current-jobs-page/current-jobs-page'
import {InvoicePage} from '../pages/manager/invoice-page/invoice-page'

//Client Side
import { ClientTabs } from '../pages/client/client-tabs/client-tabs'
import { NewOrderPage } from '../pages/client/new-order-page/new-order-page'
import {JobItemPage} from '../pages/client/job-item-page/job-item-page'
import {ServiceRequestPage} from '../pages/client/service-request-page/service-request-page'
import {ClientJobProgressPage} from '../pages/client/client-job-progress-page/client-job-progress-page'
import {ClientCurrentJobsPage} from '../pages/client/client-current-jobs-page/client-current-jobs-page'


//Tradesperson Side
import { TradesPersonTabs } from '../pages/tradesperson/trades-person-tabs/trades-person-tabs';
import { TPCurrentJobsPage } from '../pages/tradesperson/tp-current-jobs-page/tp-current-jobs-page'
import {TPProgressUpdatePage} from '../pages/tradesperson/tp-progress-update-page/tp-progress-update-page'

//Native api request
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { Camera } from '@ionic-native/camera';

import { AngularFireModule } from 'angularfire2';
//Firebase setting
var firebaseConfig = {
    apiKey: "AIzaSyByoy4jwSFBahLuxoUD1Y0zotrxGbxa81Q",
    authDomain: "aegis-c197c.firebaseapp.com",
    databaseURL: "https://aegis-c197c.firebaseio.com",
    projectId: "aegis-c197c",
    storageBucket: "aegis-c197c.appspot.com",
    messagingSenderId: "922210177619"
};

@NgModule({
  declarations: [
    MyApp,UIDecider,
    LoginPage, MessagePage, JobDetailsPage,
    NewUserRequest, ManagerTabs,ManagerCurrentJobsPage,ManagerJobProgressPage,InvoicePage,
    ClientTabs, NewOrderPage,JobItemPage,ServiceRequestPage,ClientJobProgressPage,ClientCurrentJobsPage,
    TradesPersonTabs, TPCurrentJobsPage,TPProgressUpdatePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig)

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp, UIDecider,
    LoginPage,MessagePage,JobDetailsPage,
    ManagerTabs, NewUserRequest,ManagerCurrentJobsPage,ManagerJobProgressPage,InvoicePage,
    ClientTabs, NewOrderPage,JobItemPage,ServiceRequestPage,ClientJobProgressPage,ClientCurrentJobsPage,
    TradesPersonTabs, TPCurrentJobsPage,TPProgressUpdatePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,PhotoViewer,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
