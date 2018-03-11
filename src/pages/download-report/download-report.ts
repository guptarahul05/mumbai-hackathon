import { Component,OnInit } from '@angular/core';
import { IonicPage,ViewController, NavController, NavParams,LoadingController,ToastController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {File} from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import {FCM} from '@ionic-native/fcm';
import {Md5} from "md5-typescript";
import {MyApp} from '../../app/app.component';
@Component({
  selector: 'page-download-report',
  templateUrl: 'download-report.html',
})
export class DownloadReportPage {
  encryptedtoken: string;
  token: any;
  downloadForm: FormGroup;

  constructor( private fcm:FCM,public navCtrl: NavController, public navParams: NavParams,public viewctrl:ViewController,
              private file:File,private transfer:FileTransfer,private loadingCtrl:LoadingController,private toastCtrl: ToastController) {
  
              }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DownloadReportPage');
  }
  ngOnInit(){
    this.fcm.getToken().then(token=>{
      this.token = token;
    });
    
    this.encryptedtoken=Md5.init(MyApp.token);
    this.downloadForm = new FormGroup({
      'fileName': new FormControl(null,Validators.required),
      'reportType': new FormControl(null,Validators.required)
    })

    console.log(MyApp.token);
    

  }
  close()
  {
    this.viewctrl.dismiss();
  }
  submitRequest(){
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    const fileTransfer: FileTransferObject = this.transfer.create();
    const url = 'http://192.168.137.158:5000/download/reports/'+this.downloadForm.value.reportType+'/'+this.encryptedtoken+'_'+this.downloadForm.value.fileName+".pdf";
    alert(url);
    fileTransfer.download(url, this.file.externalDataDirectory +'/'+this.downloadForm.value.reportType+'/'+ this.downloadForm.value.fileName+'.pdf').then((entry) => {
      console.log('download complete: ' + entry.toURL());
      loading.dismiss();
      this.toastFunc('Download Complete')
      this.close();
    }, (error) => {
      if(error.http_status==404){
        loading.dismiss();
        this.toastFunc("File not Found Please check file Name");
      }
    });
  }
  toastFunc(message:string){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }
}
