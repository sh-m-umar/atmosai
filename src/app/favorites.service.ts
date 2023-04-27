import { Injectable } from '@angular/core';
import {HttpService} from "./http.service";
import {LocalService} from "./local.service";

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  public favoritesList: any = {};
  public favoritesLoading: any = false;

  constructor(private httpService: HttpService, private localStore: LocalService) { }

  // update favorite status
    updateFavorite( ID: any, type: any, title: any, url?: string, icon?: string ) {

        // check if favorites loading
        if( this.favoritesLoading ) {
            return;
        }

        // set loader
        this.favoritesLoading = true;

        if( this.isFavorite( ID, type ) ) {

            // remove from favorites
            const data = {
                entity_id: ID,
                entity_type: type,
            }
            this.httpService.removeFavorites( data ).subscribe( ( res: any ) => {
                this.localStore.set( 'userFavorites', res );
                this.favoritesList = res;

                // remove loader
                this.favoritesLoading = false;
            } );
        } else {
            const data = {
                entity_id: ID,
                entity_type: type,
                url: url? url : '/' + type + 's' + '/' + ID + '/main',
                title: title,
                icon: icon,
            };

            this.httpService.addToFavorites( data ).subscribe( ( res: any ) => {
                this.localStore.set( 'userFavorites', res );
                this.favoritesList = res;
                // remove loader
                this.favoritesLoading = false;
            } );

        }
    }

    // check if board added to favorites
    isFavorite( ID: any, type: any ) {

        // get favorites list from local storage
        const favoritesList = this.localStore.get( 'userFavorites' );

        if( favoritesList == undefined || !favoritesList ) {
            return false;
        }

        const favoriteObj = favoritesList?.filter( ( obj: any ) => {
            if( obj.entity_id == undefined || !obj.entity_id ) {
                return false;
            }
            return ( obj.entity_id == ID && obj.entity_type == type );
        } );

        if( favoriteObj[0] == undefined ) {
            return false;
        } else {
            return true;
        }
    }

    // set favorites data
    setFavoritesList() {

        // set loader
        this.favoritesLoading = true;

        const favoritesList = this.localStore.get( 'userFavorites' );
        if( favoritesList != undefined && favoritesList ) {
            this.favoritesList = favoritesList;

            // remove loader
            this.favoritesLoading = false;

        } else {
            this.httpService.getFavorites().subscribe( ( res: any ) => {
                this.localStore.set( 'userFavorites', res );
                this.favoritesList = res;
                // remove loader
                this.favoritesLoading = false;

            } );
        }
    }
}
