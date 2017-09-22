import { FCM } from '@ionic-native/fcm';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { BackgroundMode } from '@ionic-native/background-mode';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { MyApp } from './app.component';

//Common side
import { CurrentJobsPage } from './../pages/common/current-jobs-page/current-jobs-page';
import { LoginPage } from '../pages/common/login-page/login-page'
import { UIDecider } from '../pages/common/ui-decider/ui-decider'
import { MessagePage } from '../pages/common/message-page/message-page'
import { JobDetailsPage } from '../pages/common/job-details-page/job-details-page'
import { FollowUpPage } from '../pages/common/follow-up-page/follow-up-page'
import { MessageBoardPage } from './../pages/common/message-board-page/message-board-page';
import { Historypage } from './../pages/common/history/history';

//HeadAegis Side

import { HeadAegisTabs } from '../pages/headAegis/headAegis-tabs/headAegis-tabs'
import { InvoicePage } from '../pages/headAegis/invoice-page/invoice-page'
import { NewServicePage } from './../pages/headAegis/new-service-page/new-service-page';
import { ServiceListPage } from './../pages/headAegis/service-list-page/service-list-page';

//Housekeeper Side
import { HousekeeperTabs } from '../pages/housekeeper/housekeeper-tabs/housekeeper-tabs'
import { NewOrderPage } from '../pages/housekeeper/new-order-page/new-order-page'

//SuperUser Side
import { SuperUserTabs } from './../pages/superUser/superUser-tabs/superUser-tabs';

//HeadEngineer Side
import { HeadEngineerTabs } from './../pages/headEngineer/headEngineer-tabs/headEngineer-tabs';

//Tradesperson Side
import { TradesPersonTabs } from '../pages/tradesperson/trades-person-tabs/trades-person-tabs';

//Native api request
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { Camera } from '@ionic-native/camera';
import { EmailComposer } from '@ionic-native/email-composer';

import { AngularFireModule } from 'angularfire2';
import { CreateNewUserPage } from '../pages/common/create-new-user/create-new-user';
//Firebase setting
// var firebaseConfig = {
//     apiKey: "AIzaSyByoy4jwSFBahLuxoUD1Y0zotrxGbxa81Q",
//     authDomain: "aegis-c197c.firebaseapp.com",
//     databaseURL: "https://aegis-c197c.firebaseio.com",
//     projectId: "aegis-c197c",
//     storageBucket: "aegis-c197c.appspot.com",
//     messagingSenderId: "922210177619"
// };
var firebaseConfig = {
  apiKey: "AIzaSyBz5UXAk9S8M5gEmMDtW59TBhXTqxjOIxg",
  authDomain: "questmanagement-a67c5.firebaseapp.com",
  databaseURL: "https://questmanagement-a67c5.firebaseio.com",
  projectId: "questmanagement-a67c5",
  storageBucket: "questmanagement-a67c5.appspot.com",
  messagingSenderId: "817112257581"
};

@NgModule({
  declarations: [
    MyApp, UIDecider,
    LoginPage, MessagePage, JobDetailsPage, FollowUpPage,
     HeadAegisTabs, HeadEngineerTabs, CurrentJobsPage, InvoicePage,
    HousekeeperTabs, NewOrderPage,
    TradesPersonTabs, SuperUserTabs, NewServicePage,
    ServiceListPage, MessageBoardPage ,Historypage ,CreateNewUserPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig)

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp, UIDecider,
    LoginPage, MessagePage, JobDetailsPage, FollowUpPage,
    HeadAegisTabs, HeadEngineerTabs, CurrentJobsPage, InvoicePage,
    HousekeeperTabs, NewOrderPage, 
    TradesPersonTabs, SuperUserTabs, NewServicePage,
    ServiceListPage, MessageBoardPage,Historypage, CreateNewUserPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera, PhotoViewer, EmailComposer, FCM, BackgroundMode, LocalNotifications,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
