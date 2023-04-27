import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'app-main-and-searchable-boards',
    templateUrl: './main-and-searchable-boards.component.html',
    styleUrls: ['./main-and-searchable-boards.component.scss']
})
export class MainAndSearchableBoardsComponent {
    @Input() data = {
        current: 'main',
        changeTo: 'shareable',
        boardId: 0
    };

    @Output() saveBoardType = new EventEmitter();

    constructor() {
    }

    changeBoardType() {
        // close modal by clicking on the button ID 'close-modal-button-shareable'
        document.getElementById('close-modal-button-shareable')?.click();
        this.saveBoardType.emit(this.data);
    }
}
