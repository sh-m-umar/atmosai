import {AuthService} from "../../auth.service";
import {Component, OnInit} from '@angular/core';
import {environment} from "../../../environments/environment";
import {CacheService} from "../../cache.service";
import {HttpService} from "../../http.service";
import {Router} from "@angular/router";

declare const Editor: any

@Component({
    selector: 'app-edit-landing-page',
    templateUrl: './edit-landing-page.component.html',
    styleUrls: ['./edit-landing-page.component.scss']
})
export class EditLandingPageComponent implements OnInit {
    public landingPageObj: any = {
        title: 'Landing Page',
    };
    private boardId = 0;
    private componentUrl = '';
    private templateUrl = '';

    constructor(private auth: AuthService, private cache: CacheService, public httpService: HttpService, private router: Router ) {
    }

    ngOnInit(): void {
        // set board ID
        this.setBoardId();
        this.componentUrl = environment.siteUrl + this.router.url.split('?')[0].slice(1);

        // Get query params from navigation
        const queryParams = this.router.parseUrl(this.router.url).queryParams;

        if (queryParams['template_id'] && queryParams['type']) {
            this.templateUrl = environment.siteUrl + 'assets/builderjs/templates/' + queryParams['type'] + '/' + queryParams['template_id'] + '/index.html';
        }
    }

    initBuilder() {
        const builderPage = document.getElementById('builder-page');
        if (builderPage) {
            builderPage.setAttribute('href', 'assets/libs/builderjs/builder.css');
        }

        const templates = [
            {
                "name": "Blank",
                "url": this.componentUrl + "?template_id=6037a0a8583a7&type=default",
                "thumbnail": environment.siteUrl + "assets\/builderjs\/templates\/default\/6037a0a8583a7\/thumb.png"
            },
            {
                "name": "Pricing Table",
                "url": this.componentUrl + "?template_id=6037a2135b974&type=default",
                "thumbnail": environment.siteUrl + "assets\/builderjs\/templates\/default\/6037a2135b974\/thumb.png"
            },
            {
                "name": "Listing & Tables",
                "url": this.componentUrl + "?template_id=6037a2250a3a3&type=default",
                "thumbnail": environment.siteUrl + "assets\/builderjs\/templates\/default\/6037a2250a3a3\/thumb.png"
            },
            {
                "name": "Forms Building",
                "url": this.componentUrl + "?template_id=6037a23568208&type=default",
                "thumbnail": environment.siteUrl + "assets\/builderjs\/templates\/default\/6037a23568208\/thumb.png"
            },
            {
                "name": "1-2-1 column layout",
                "url": this.componentUrl + "?template_id=6037a2401b055&type=default",
                "thumbnail": environment.siteUrl + "assets\/builderjs\/templates\/default\/6037a2401b055\/thumb.png"
            },
            {
                "name": "1-2 column layout",
                "url": this.componentUrl + "?template_id=6037a24ebdbd6&type=default",
                "thumbnail": environment.siteUrl + "assets\/builderjs\/templates\/default\/6037a24ebdbd6\/thumb.png"
            },
            {
                "name": "1-3-1 column layout",
                "url": this.componentUrl + "?template_id=6037a25ddce80&type=default",
                "thumbnail": environment.siteUrl + "assets\/builderjs\/templates\/default\/6037a25ddce80\/thumb.png"
            },
            {
                "name": "1-3-2 column layout",
                "url": this.componentUrl + "?template_id=6037a26b0a286&type=default",
                "thumbnail": environment.siteUrl + "assets\/builderjs\/templates\/default\/6037a26b0a286\/thumb.png"
            },
            {
                "name": "1-3 column layout",
                "url": this.componentUrl + "?template_id=6037a275bf375&type=default",
                "thumbnail": environment.siteUrl + "assets\/builderjs\/templates\/default\/6037a275bf375\/thumb.png"
            },
            {
                "name": "One column layout",
                "url": this.componentUrl + "?template_id=6037a28418c95&type=default",
                "thumbnail": environment.siteUrl + "assets\/builderjs\/templates\/default\/6037a28418c95\/thumb.png"
            },
            {
                "name": "2-1-2 column layout",
                "url": this.componentUrl + "?template_id=6037a29a35e05&type=default",
                "thumbnail": environment.siteUrl + "assets\/builderjs\/templates\/default\/6037a29a35e05\/thumb.png"
            },
            {
                "name": "2-1 column layout",
                "url": this.componentUrl + "?template_id=6037a2aa315d4&type=default",
                "thumbnail": environment.siteUrl + "assets\/builderjs\/templates\/default\/6037a2aa315d4\/thumb.png"
            },
            {
                "name": "Two columns layout",
                "url": this.componentUrl + "?template_id=6037a2b67ed27&type=default",
                "thumbnail": environment.siteUrl + "assets\/builderjs\/templates\/default\/6037a2b67ed27\/thumb.png"
            },
            {
                "name": "3-1-3 column layout",
                "url": this.componentUrl + "?template_id=6037a2c3d7fa1&type=default",
                "thumbnail": environment.siteUrl + "assets\/builderjs\/templates\/default\/6037a2c3d7fa1\/thumb.png"
            },
            {
                "name": "Three columns layout",
                "url": this.componentUrl + "?template_id=6037a2dcb6c56&type=default",
                "thumbnail": environment.siteUrl + "assets\/builderjs\/templates\/default\/6037a2dcb6c56\/thumb.png"
            }
        ];
        const tags = [{type: 'label', tag: 'CONTACT_FIRST_NAME'}, {type: 'label', tag: 'CONTACT_LAST_NAME'}, {type: 'label', tag: 'CONTACT_FULL_NAME'}, {type: 'label', tag: 'CONTACT_EMAIL'}, {type: 'label', tag: 'CONTACT_PHONE'}, {type: 'label', tag: 'CONTACT_ADDRESS'}, {type: 'label', tag: 'ORDER_ID'}, {type: 'label', tag: 'ORDER_DUE'}, {type: 'label', tag: 'ORDER_TAX'}, {type: 'label', tag: 'PRODUCT_NAME'}, {type: 'label', tag: 'PRODUCT_PRICE'}, {type: 'label', tag: 'PRODUCT_QTY'}, {type: 'label', tag: 'PRODUCT_SKU'}, {type: 'label', tag: 'AGENT_NAME'}, {type: 'label', tag: 'AGENT_SIGNATURE'}, {type: 'label', tag: 'AGENT_MOBILE_PHONE'}, {type: 'label', tag: 'AGENT_ADDRESS'}, {type: 'label', tag: 'AGENT_WEBSITE'}, {type: 'label', tag: 'AGENT_DISCLAIMER'}, {type: 'label', tag: 'CURRENT_DATE'}, {type: 'label', tag: 'CURRENT_MONTH'}, {type: 'label', tag: 'CURRENT_YEAR'}, {type: 'button', tag: 'PERFORM_CHECKOUT', 'text': 'Checkout'}, {type: 'button', tag: 'PERFORM_OPTIN', 'text': 'Subscribe'}];


        const builder = new Editor(
            {
                root: environment.siteUrl + "assets/libs/builderjs/",
                // backUrl: environment.siteUrl + '/boards/43/main',
                urlBack: window.location.origin,
                saveUrl: environment.endpointURL + 'atmos-api/v1/entry-meta/add-content',
                saveMethod: 'POST',
                data: {
                    entry_id: this.landingPageObj.id,
                    key: 'content',
                    '_builder_token': this.auth.getToken(),
                },
                templates: templates,
                url: this.templateUrl,
                tags: tags,
                changeTemplateCallback: (url:any) => { window.location = url; },
                backgrounds: [
                    environment.siteUrl + '/assets/builderjs/image/backgrounds/images1.jpg',
                    environment.siteUrl + '/assets/builderjs/image/backgrounds/images2.jpg',
                    environment.siteUrl + '/assets/builderjs/image/backgrounds/images3.jpg',
                    environment.siteUrl + '/assets/builderjs/image/backgrounds/images4.png',
                    environment.siteUrl + '/assets/builderjs/image/backgrounds/images5.jpg',
                    environment.siteUrl + '/assets/builderjs/image/backgrounds/images6.jpg',
                    environment.siteUrl + '/assets/builderjs/image/backgrounds/images9.jpg',
                    environment.siteUrl + '/assets/builderjs/image/backgrounds/images11.jpg',
                    environment.siteUrl + '/assets/builderjs/image/backgrounds/images12.jpg',
                    environment.siteUrl + '/assets/builderjs/image/backgrounds/images13.jpg',
                    environment.siteUrl + '/assets/builderjs/image/backgrounds/images14.jpg',
                    environment.siteUrl + '/assets/builderjs/image/backgrounds/images15.jpg',
                    environment.siteUrl + '/assets/builderjs/image/backgrounds/images16.jpg',
                    environment.siteUrl + '/assets/builderjs/image/backgrounds/images17.png'
                ]
            }
        );

        // Load existing HTML template
        //builder.load('<div> <h1>Awesome title</h1> <p> Page content... </p> </div>');

        builder.init();
    }

    /**
     * Set board ID
     */
    setBoardId() {
        this.cache.getAllBoards().then((data: any) => {
            this.boardId = data.find((board: any) => board.type == 'landing-pages')?.id;

            // Run this after loading the board ID
            this.createLandingPage();
        });
    }

    createLandingPage() {
        this.initBuilder();

        // TODO: uncomment this when the work is good enough to be saved
        // const postData: any = {
        //     item: this.landingPageObj.title,
        //     parent_id: 0,
        //     action: 'add-full-entry',
        //     board_type: 'landing-pages',
        //     id: 0
        // };
        //
        // this.cache.reCacheBoardData(this.boardId, false);
        // this.httpService.bulkActionsRows(postData).subscribe((data: any) => {
        //     this.landingPageObj.id = data.id;
        //     this.initBuilder();
        // });
    }

}
