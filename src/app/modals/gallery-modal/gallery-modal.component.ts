import { Component } from '@angular/core';
import * as ClassicEditor from 'src/app/right-sidebar-tray/ckeditor-build';

@Component({
  selector: 'app-gallery-modal',
  templateUrl: './gallery-modal.component.html',
  styleUrls: ['./gallery-modal.component.scss']
})
export class GalleryModalComponent {
  public ClassicEditor: any = ClassicEditor;
  updateEditor = false;
  public ckEditor: any = '';
  galleryGridList = 'grid-view';
  activeTab = '';
  galleryDescription = false;


  /**
     * File gallery inner modal tabs
     */
  galleryTab(tab:string = ''){
    this.activeTab = tab;
    this.galleryDescription = true;
    console.log('active tab', tab);
  }

  galleryDescriptionClose(){
    this.activeTab = '';
    this.galleryDescription = false;
  }

  showUpdateEditor() {
    this.updateEditor = true;

    // initialize ckeditor for updates
    // check if editor exists
    setTimeout(() => {

        ClassicEditor.create( document.querySelector("#custom_editor"),
        {
            toolbar:{
                items:["heading","|","bold","italic","|","undo","redo"]
            },
            mention:{
                feeds:[{
                    marker:"@"
                }]
            },
            height: '200px'
            }
            ).then( ( editor: any ) => {
                this.ckEditor = editor;
                this.ckEditor.setData( '' );
            } )
            .catch( ( error: any ) => {
                console.error( 'There was a problem initializing the editor.', error );
            } );
    }, 1);
  }
}
