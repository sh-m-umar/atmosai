import { Component, OnInit, AfterViewInit, ChangeDetectorRef, ViewChild, ElementRef, } from '@angular/core';
import tippy, { hideAll } from 'tippy.js';

@Component({
  selector: 'app-popup-cell-renderer',
  templateUrl: './popup-cell-renderer.component.html',
  styleUrls: ['./popup-cell-renderer.component.scss']
})
export class PopupCellRendererComponent implements OnInit, AfterViewInit {

  public params: any;
  public isOpen = false;
  public tippyInstance: any;

  @ViewChild('content') container!: ElementRef<HTMLInputElement>;

  @ViewChild('trigger') trigger!: ElementRef<HTMLInputElement>;

  constructor(public changeDetector: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.tippyInstance = tippy(this.trigger.nativeElement);
    this.tippyInstance.disable();
  }

  agInit(params:any) {
    this.params = params;
  }

  onClickHandler(option:any) {
    this.togglePopup();
    if (option === 'create') {
      console.log('create is working')
      this.params.api.applyTransaction({
        add: [{}],
      });
    }
    if (option === 'delete') {
      this.params.api.applyTransaction({ remove: [this.params.data] });
    }

    if (option === 'edit') {
      this.params.api.startEditingCell({
        rowIndex: this.params.rowIndex,
        colKey: 'make',
      });
    }
  }

  configureTippyInstance() {
    this.tippyInstance.enable();
    this.tippyInstance.show();

    this.tippyInstance.setProps({
      trigger: 'manual',
      placement: 'right',
      arrow: false,
      interactive: true,
      appendTo: document.body,
      hideOnClick: false,
      onShow: (instance:any) => {
        hideAll({ exclude: instance });
      },
      onClickOutside: (instance:any, event:any) => {
        this.isOpen = false;
        instance.unmount();
      },
    });
  }

  togglePopup() {
    this.isOpen = !this.isOpen;
    this.changeDetector.detectChanges();
    if (this.isOpen) {
      this.configureTippyInstance();
      this.tippyInstance.setContent(this.container.nativeElement);
    } else {
      this.tippyInstance.unmount();
    }
  }

  ngOnInit(): void {
  }

}
