import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FCM } from '@ionic-native/fcm';

import {AlertController} from 'ionic-angular';
import { TabsPage } from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;
  static token:any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,private fcm: FCM,public alertCtrl:AlertController) {
    platform.ready().then(() => {
      this.fcm.getToken().then(token=>{
        MyApp.token = token;
      });
      this.fcm.onTokenRefresh().subscribe(token=>{
        console.log(token);
      })
      this.fcm.onNotification().subscribe(
        (data=>{
          if(data.wasTapped){
            let alert = this.alertCtrl.create({
              title: 'Report Generated',
              subTitle: 'Your report is generted can be downloaded via My Reports section'+JSON.stringify(data),
              buttons: ['Dismiss']
            });
            alert.present();
          }
          else {
            let alert = this.alertCtrl.create({
              title: 'Report Generated',
              subTitle: 'Your report is generted can be downloaded via My Reports section'+JSON.stringify(data),
              buttons: ['Dismiss']
            });
            alert.present();
          }
        })
      )
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
