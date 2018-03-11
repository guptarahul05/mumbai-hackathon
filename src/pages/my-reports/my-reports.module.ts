import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyReportsPage } from './my-reports';

@NgModule({
  declarations: [
    MyReportsPage,
  ],
  imports: [
    IonicPageModule.forChild(MyReportsPage),
  ],
})
export class MyReportsPageModule {}
