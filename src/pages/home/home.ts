import { Component,OnInit } from '@angular/core';
import { NavController,AlertController,ToastController,LoadingController,ModalController } from 'ionic-angular';
import { FormGroup,Validators,FormControl } from '@angular/forms';
import { AppService } from '../../app/app.service';


import {SmtpexploitPage} from '../smtpexploit/smtpexploit';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  requestForm: FormGroup;
  result:any={};
  tableData=[];
  whoisData:boolean=false;
  nmapData:boolean=false;
  constructor(public navCtrl: NavController, public alertCtrl:AlertController,
              public service:AppService,public toastCtrl:ToastController,public loadingCtrl:LoadingController,
              public modalCtrl:ModalController) {

  }
  ngOnInit(){
    this.requestForm = new FormGroup({
      'url': new FormControl(null,Validators.required),
      'testType': new FormControl(null,Validators.required)
    })
  }
  submitRequest(){
    console.log(this.requestForm);
    if(this.requestForm.value.testType=='whoiss'){
      this.whois();
    }
    else if(this.requestForm.value.testType=='nmap_scan'){
      this.nmap();
    }
    else{
      this.smtp();
    }
  }
  whois(){
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    let body = {
      url: this.requestForm.value.url
    }
    this.service.getData(body,'whoiss')
    .subscribe(
      (result:any)=>{
        if(result.result==false){
          this.toastFunc('Invalid Url');
          loading.dismiss();
        }
        else{
          this.nmapData=false;
          this.whoisData=true;
          this.result= result;
          loading.dismiss();
        }
      },
      (error)=>{
        alert(JSON.stringify(error));
        loading.dismiss();
      }
    )
  }
  nmap(){
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    let body = {
      ip: this.requestForm.value.url
    }
    this.service.getData(body,'nmap_scan')
    .subscribe(
      (result)=>{
        if(result.result==false){
          this.toastFunc('Invalid Url');
          loading.dismiss();
        }
        else{
          this.nmapData=true;
          this.whoisData=false;
          this.result= result;
          this.tableData=[];
          for (let key in result['tcp'])
              this.tableData.push({'Ports':key,'Name':result['tcp'][key]['name'],'State':result['tcp'][key]['state']})
            
          loading.dismiss();
        }
      },
      (error)=>{
        alert(JSON.stringify(error));
        loading.dismiss();
      }
    )
  }
  smtp() {
    this.nmapData=false;
    this.whoisData=false;
    let alert1 = this.alertCtrl.create({
      title: 'Smtp Exploit',
      message: 'Smtp Exploitation is not possible',
      buttons: [
        { text: 'Cancel',
          role: 'cancel',
          handler: () => {console.log('Cancel clicked');}
        }
      ]
    });
  
    let alert2 = this.alertCtrl.create({
      title: 'Smtp Exploit',
      message: 'Smtp Exploitation is possible',
      buttons: [
        { text: 'Okay',
          role: 'cancel',
          handler: () => {console.log('Cancel clicked');}
        },
        { text: 'Exploit',
          handler: () => {
            console.log('Buy clicked');
            let myData = {
              url: this.requestForm.value.url
            }
            console.log(myData);
            
            const exploitModal = this.modalCtrl.create(SmtpexploitPage,{data:myData});
            exploitModal.present();
          }
        }
      ]
    });
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    let body = {
      url: this.requestForm.value.url
    }
    this.service.getData(body,'check_smtp')
    .subscribe(
      (result:any)=>{
        console.log(result);
        if(result.exploit==true){
          alert2.present();
          loading.dismiss();
        }
        else{
          alert1.present();
          loading.dismiss();
        }
        
      },
      (error)=>{
        alert(JSON.stringify(error));
        loading.dismiss();
      }
    )
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
