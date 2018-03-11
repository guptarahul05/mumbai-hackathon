import { Component } from '@angular/core';
import { Network } from '@ionic-native/network';

import { HomePage } from '../home/home';
import {SmtpexploitPage} from '../smtpexploit/smtpexploit';
import {PayloadPage} from '../payload/payload';
import {VulnerabilityScannerPage} from '../vulnerability-scanner/vulnerability-scanner';
import { MyReportsPage} from '../my-reports/my-reports';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  networkCheck:boolean=true;
  network1:boolean=true;
  tab1Root = HomePage;
  tab2Root = PayloadPage;
  tab3Root = VulnerabilityScannerPage;
  tab4Root = SmtpexploitPage;
  tab5Root = MyReportsPage;

  constructor(private network: Network) {
    
  }

}
