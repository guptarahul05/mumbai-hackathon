import { Component,OnInit } from '@angular/core';
import {NavController, NavParams,AlertController,LoadingController,ToastController,ModalController } from 'ionic-angular';

import {File} from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import {SocialSharing} from '@ionic-native/social-sharing';
import { FileOpener } from '@ionic-native/file-opener';

import {DownloadReportPage} from '../download-report/download-report'
// @IonicPage()
@Component({
  selector: 'page-my-reports',
  templateUrl: 'my-reports.html',
})
export class MyReportsPage implements OnInit {
  test:any;
  filesList:any;
  noReportCheck:boolean=true;
  type:string;
  constructor(public navCtrl: NavController, public navParams: NavParams,private file:File,private transfer:FileTransfer,
              private socialSharing: SocialSharing,private fileOpener: FileOpener,private alertCtrl:AlertController,
              private loadingCtrl:LoadingController,private toastCtrl: ToastController,private modalCtrl:ModalController) {
                this.selectFunction('nessus');
  }
  ngOnInit(){
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyReportsPage');
  }
  download1File(){
    const fileTransfer: FileTransferObject = this.transfer.create();
    const url = 'https://www.tcetmumbai.in/syllabus/B.E-CMPN_Sm-VIII.pdf';
    fileTransfer.download(url, this.file.externalApplicationStorageDirectory + 'file.pdf').then((entry) => {
      console.log('download complete: ' + entry.toURL());
      alert('download complete: ' + entry.toURL())
    }, (error) => {
      alert(JSON.stringify(error));
     
    });
  
    
  }




  downloadFile(){
    const exploitModal = this.modalCtrl.create(DownloadReportPage);
    exploitModal.present();
  }
  
  shareFile(filename:string){
    this.socialSharing.share('','',this.file.externalDataDirectory+'/'+this.type+'/'+filename,'').then(() => {
    }).catch((error) => {
      alert(JSON.stringify(error));
    });
  }

  deleteFile(filename:string,index:number){
    let alert = this.alertCtrl.create({
      title: 'Confirm Detete',
      message: 'Do you want to Delete this Report?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            this.file.removeFile(this.file.externalDataDirectory+'/'+this.type,filename).then(
              () => {
                this.filesList.splice(index, 1);
                this.toastFunc('Delete Successful')
                this.ngOnInit();
              }
            ).catch(
              (err) => {
                console.log(JSON.stringify(err));
                this.toastFunc('Problem Occured while deleting file')
              }
            );
          }
        }
      ]
    });
    alert.present();

  }
  openFile(fileName:string){
    if(fileName.indexOf('.pdf') !== -1){
      this.fileOpener.open(this.file.externalDataDirectory+'/'+this.type+'/'+fileName, 'application/pdf');
    }
    else if(fileName.indexOf('.apk') !== -1){
      this.fileOpener.open(this.file.externalDataDirectory+'/'+this.type+'/'+fileName, 'application/vnd.android.package-archive');
    }
    else{
      this.toastFunc('File type not supported');
    }
  }
  toastFunc(message:string){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  selectFunction(type:string){
    
    this.type=type;
    this.file.listDir(this.file.externalDataDirectory,this.type).then(
      (files) => {
        if(files.length==0)
          this.noReportCheck=true;
          else{
            this.filesList=files;
            this.noReportCheck=false;
          }
      }
    ).catch(
      (err) => {
      }
    );
  
   }
}
