import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-agent',
  templateUrl: './add-agent.component.html',
  styleUrls: ['./add-agent.component.scss']
})
export class AddAgentComponent implements OnInit {

  customEmail = false;
  emailAccountType = 'microsoft';
  payWith = 'atmos';
  isProfileComplete = true;
  constructor() { }

  emailConnect(type:string = ''){
    (type == 'custom' ? this.customEmail = true : this.customEmail = false);
    this.emailAccountType = type;
  }

  paymentMethod(type:string = ''){
    this.payWith = type;
  }

  ngOnInit(): void {
  }

}
