import { Component,OnInit } from '@angular/core';
import { NavController, NavParams,LoadingController,ToastController } from 'ionic-angular';
import { FormGroup,Validators,FormControl } from '@angular/forms';

import {File} from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';

import {AppService } from '../../app/app.service'
@Component({
  selector: 'page-payload',
  templateUrl: 'payload.html',
})
export class PayloadPage implements OnInit {
  payloadRequest:FormGroup;
  constructor(public navCtrl: NavController, public navParams: NavParams,public loadingCtrl:LoadingController,
              private file:File,private transfer:FileTransfer,private toastCtrl:ToastController,public service:AppService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PayloadPage');
  }
  ngOnInit(){
    this.payloadRequest = new FormGroup({
      'payloadFilename': new FormControl(null,Validators.required),
      'hostIP': new FormControl(null,Validators.required),
      'hostPort': new FormControl(null, Validators.required),
      'payloadPlatform': new FormControl(null, Validators.required),
      'payloadType': new FormControl(null, Validators.required),
      'callType': new FormControl(null, Validators.required)
    });
  }
  downloadPayload(){
    console.log(this.payloadRequest);
    let body = {
      platform : this.payloadRequest.value.payloadPlatform,
      payloadType: this.payloadRequest.value.payloadType,
      callType: this.payloadRequest.value.callType,
      lhost: this.payloadRequest.value.hostIP,
      lport: this.payloadRequest.value.hostPort,
      name: this.payloadRequest.value.payloadFilename
    }
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.service.getData(body,'payload')
    .subscribe(
      (result:any)=>{
        if(result.payloadGenerated==true){
          console.log('hello');
          
          this.downloadPayloadFile(this.payloadRequest.value.payloadFilename,this.payloadRequest.value.payloadPlatform);
          loading.dismiss();
        }
      },
      (error) => alert(error),
    );
  }
  downloadPayloadFile(filename,platform){
    let extension= {
      windows : ".exe",
      android : ".apk",
      php: ".php"
    }
    const fileExtension = extension[platform];
    console.log(fileExtension)
    
    const fileTransfer: FileTransferObject = this.transfer.create();
    const url = 'http://192.168.137.158:5000/download/reports/payload/'+filename+fileExtension;
    
    fileTransfer.download(url, this.file.externalDataDirectory+'/payload/' +filename+fileExtension).then((entry) => {
      this.toastFunc("Download Complete")
    }, (error) => {
      // handle error
      alert(JSON.stringify(error));
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
