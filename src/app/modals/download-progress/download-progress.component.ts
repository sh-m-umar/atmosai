import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-download-progress',
  templateUrl: './download-progress.component.html',
  styleUrls: ['./download-progress.component.scss']
})
export class DownloadProgressComponent {
  @Output() hide: EventEmitter<any> = new EventEmitter();

  close() {
    this.hide.emit();
  }

}
