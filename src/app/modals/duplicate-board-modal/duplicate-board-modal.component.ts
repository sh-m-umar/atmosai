import {Component, Input} from '@angular/core';
import {HttpService} from "../../http.service";
import {Router} from "@angular/router";
import {AppComponent} from "../../app.component";

@Component({
    selector: 'app-duplicate-board-modal',
    templateUrl: './duplicate-board-modal.component.html',
    styleUrls: ['./duplicate-board-modal.component.scss']
})
export class DuplicateBoardModalComponent {
    @Input() board: any;
    newBoardName: string = '';
    duplicate: string = '';
    keepSubs = 0;
    keepBoardSubscribers: string = '';

    constructor(private httpService: HttpService, private router: Router, private appComponent: AppComponent) {
    }

    ngOnChanges() {
        this.newBoardName = 'Duplicated of ' + this.board.name;
        this.duplicate = 'structure';
        this.keepSubs = 0;
    }

    duplicateBoard() {
        this.keepSubs = this.keepSubs == 1 ? 1 : 0;

        const data = {
            action: 'duplicate',
            id: this.board.id,
            board_name: this.newBoardName,
            duplicate: this.duplicate,
            keep_subs: this.keepSubs,
            module: 'crm'
        };

        // Close modal by click on this ID modal-close-btn-duplicate
        document.getElementById('modal-close-btn-duplicate')?.click();

        this.httpService.postBoardsBulk(data).subscribe((response: any) => {
            this.router.navigate(['boards/' + response.id + '/main']);
            this.appComponent.getMenuItems(false, true);
        });
    }

}
