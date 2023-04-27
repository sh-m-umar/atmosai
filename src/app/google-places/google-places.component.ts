/// <reference types="@types/google.maps" />
import {Component, ViewChild, EventEmitter, Output, OnInit, AfterViewInit, Input} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';

@Component({
    selector: 'app-google-places',
    templateUrl: './google-places.component.html',
    styleUrls: ['./google-places.component.scss']
})
export class GooglePlacesComponent implements OnInit, AfterViewInit {
    @Input() addressType: string = 'address';
    @Input() currentLocation: string = '';
    @Output() setAddress: EventEmitter<any> = new EventEmitter();
    @ViewChild('addresstext') addresstext: any;

    autocompleteInput: string = this.currentLocation;
    queryWait: boolean = false;

    constructor() {
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.getPlaceAutocomplete();
    }

    private getPlaceAutocomplete() {
        const autocomplete = new google.maps.places.Autocomplete(this.addresstext.nativeElement,
            {
                componentRestrictions: {country: 'US'},
                types: [this.addressType]  // 'establishment' / 'address' / 'geocode'
            });
        google.maps.event.addListener(autocomplete, 'place_changed', () => {
            const place = autocomplete.getPlace();
            this.invokeEvent(place);
        });
    }

    invokeEvent(place: Object) {
        this.setAddress.emit(place);
    }

}
