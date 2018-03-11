import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http'

import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import {SmtpexploitPage} from '../pages/smtpexploit/smtpexploit';
import {PayloadPage} from '../pages/payload/payload';
import {VulnerabilityScannerPage} from '../pages/vulnerability-scanner/vulnerability-scanner'
import {MyReportsPage} from '../pages/my-reports/my-reports';
import {AppService} from '../app/app.service';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {File} from '@ionic-native/file';
import {FileTransfer} from '@ionic-native/file-transfer';
import {SocialSharing} from '@ionic-native/social-sharing';
import { FileOpener } from '@ionic-native/file-opener';
import {FCM} from '@ionic-native/fcm';
import { Network } from '@ionic-native/network';
import {DownloadReportPage} from '../pages/download-report/download-report';
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage,
    SmtpexploitPage,
    PayloadPage,
    VulnerabilityScannerPage,
    MyReportsPage,
    DownloadReportPage,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TabsPage,
    SmtpexploitPage,
    PayloadPage,
    VulnerabilityScannerPage,
    MyReportsPage,
    DownloadReportPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    FileTransfer,
    File,
    SocialSharing,
    FileOpener,
    AppService,
    FCM,
    Network,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
