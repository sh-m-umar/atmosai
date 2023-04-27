import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalFunctionService {
  rightSidebar: boolean = false;

  constructor() { }

  rightSidebarShowHide(event:string){
    console.log('dd', event)
    if(event == 'show'){
        this.rightSidebar = true;
    }else{
        this.rightSidebar = false;
    }
  }
}
