import {Component, Input, SimpleChanges} from '@angular/core';
import {BoardsComponent} from "../../boards/boards.component";

@Component({
    selector: 'app-item-terminology',
    templateUrl: './item-terminology.component.html',
    styleUrls: ['./item-terminology.component.scss']
})
export class ItemTerminologyComponent {
    @Input() terminology: any = '';
    terminologies = ['Item', 'Budget', 'Employee', 'Campaign', 'Lead', 'Project', 'Creative', 'Client', 'Task'];

    constructor(private boardComponent: BoardsComponent) {
    }

    changeTerminology() {
        console.log('changeTerminology', this.terminology);
    }

    /**
     * Save terminology
     */
    saveTerminology() {
        // close button click id modal-close-btn-terminology
        document.getElementById('modal-close-btn-terminology')?.click();

        this.boardComponent.saveTerminology(this.terminology);
    }
}
