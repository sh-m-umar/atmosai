import {Component} from '@angular/core';
import {AuthService} from "../auth.service";
import {CacheService} from "../cache.service";
import {HttpService} from "../http.service";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";
import {templates} from "./templates";
import {Location} from '@angular/common'
import {LocalService} from "../local.service";

declare const Editor: any

@Component({
    selector: 'app-page-builder',
    template: `<p class="mt-5 text-center">loading...</p>`,
    styleUrls: ['./page-builder.component.scss']
})
export class PageBuilderComponent {
    public landingPageObj: any = {
        title: 'Page Builder',
    };
    private boardId = 0;
    private templateUrl = '';
    private emailTemplates = templates;

    constructor(private auth: AuthService, private cache: CacheService, public httpService: HttpService, private router: Router, private location: Location, private localStore: LocalService) {
    }

    ngOnInit(): void {
        this.handleQueryParams();
        this.buildTemplateArray();
    }

    /**
     * Handle query params
     */
    handleQueryParams() {
        // Get query params from navigation
        const queryParams = this.router.parseUrl(this.router.url).queryParams;

        // Set ref URL for back URL
        if (queryParams['ref']) {
            this.setGoBackUrl(queryParams['ref']);
        }

        // Handle template setting
        if (queryParams['template_id'] && queryParams['type']) {
            this.templateUrl = environment.siteUrl + 'assets/builderjs/templates/' + queryParams['type'] + '/' + queryParams['template_id'] + '/index.html';
        } else {
            // Set blank template
            this.templateUrl = environment.siteUrl + 'assets/builderjs/templates/default/6037a0a8583a7/index.html';
        }

        // Handle entry ID for edit purpose
        if (queryParams['entry_id']) {
            this.landingPageObj.id = queryParams['entry_id'];

            // Get entry data
            this.getEntryData();
        } else {
            // This is new entry
            this.initBuilder();
        }
    }

    /**
     * Initialize editor
     */
    initBuilder(content = '') {
        const builderPage = document.getElementById('builder-page');
        if (builderPage) {
            builderPage.setAttribute('href', 'assets/libs/builderjs/builder.css');
        }

        const tags = [{type: 'label', tag: 'CONTACT_FIRST_NAME'}, {type: 'label', tag: 'CONTACT_LAST_NAME'}, {type: 'label', tag: 'CONTACT_FULL_NAME'}, {type: 'label', tag: 'CONTACT_EMAIL'}, {type: 'label', tag: 'CONTACT_PHONE'}, {type: 'label', tag: 'CONTACT_ADDRESS'}, {type: 'label', tag: 'ORDER_ID'}, {type: 'label', tag: 'ORDER_DUE'}, {type: 'label', tag: 'ORDER_TAX'}, {type: 'label', tag: 'PRODUCT_NAME'}, {type: 'label', tag: 'PRODUCT_PRICE'}, {type: 'label', tag: 'PRODUCT_QTY'}, {type: 'label', tag: 'PRODUCT_SKU'}, {type: 'label', tag: 'AGENT_NAME'}, {type: 'label', tag: 'AGENT_SIGNATURE'}, {type: 'label', tag: 'AGENT_MOBILE_PHONE'}, {type: 'label', tag: 'AGENT_ADDRESS'}, {type: 'label', tag: 'AGENT_WEBSITE'}, {type: 'label', tag: 'AGENT_DISCLAIMER'}, {type: 'label', tag: 'CURRENT_DATE'}, {type: 'label', tag: 'CURRENT_MONTH'}, {type: 'label', tag: 'CURRENT_YEAR'}, {type: 'button', tag: 'PERFORM_CHECKOUT', 'text': 'Checkout'}, {
            type: 'button',
            tag: 'PERFORM_OPTIN',
            'text': 'Subscribe'
        }];

        const builder = new Editor({
                root: environment.siteUrl + "assets/libs/builderjs/",
                urlBack: window.location.origin + environment.siteUrl + this.getGoBackUrl(),
                uploadAssetUrl: environment.endpointURL + 'atmos-api/v1/entry-meta/add-asset',
                uploadAssetMethod: 'POST',
                saveUrl: environment.endpointURL + 'atmos-api/v1/entry-meta/add-content',
                saveMethod: 'POST',
                data: {
                    entry_id: this.landingPageObj.id,
                    key: 'content',
                    '_builder_token': this.auth.getToken(),
                },
                logo: environment.siteUrl + 'assets/img/atmos-logo-sidebar.png',
                templates: this.emailTemplates,
                url: this.templateUrl,
                tags: tags,
                changeTemplateCallback: (url: any) => {
                    window.location = url;
                },
                backgrounds: [
                    window.location.origin + environment.siteUrl + 'assets/builderjs/image/backgrounds/images1.jpg',
                    window.location.origin + environment.siteUrl + 'assets/builderjs/image/backgrounds/images2.jpg',
                    window.location.origin + environment.siteUrl + 'assets/builderjs/image/backgrounds/images3.jpg',
                    window.location.origin + environment.siteUrl + 'assets/builderjs/image/backgrounds/images4.png',
                    window.location.origin + environment.siteUrl + 'assets/builderjs/image/backgrounds/images5.jpg',
                    window.location.origin + environment.siteUrl + 'assets/builderjs/image/backgrounds/images6.jpg',
                    window.location.origin + environment.siteUrl + 'assets/builderjs/image/backgrounds/images9.jpg',
                    window.location.origin + environment.siteUrl + 'assets/builderjs/image/backgrounds/images11.jpg',
                    window.location.origin + environment.siteUrl + 'assets/builderjs/image/backgrounds/images12.jpg',
                    window.location.origin + environment.siteUrl + 'assets/builderjs/image/backgrounds/images13.jpg',
                    window.location.origin + environment.siteUrl + 'assets/builderjs/image/backgrounds/images14.jpg',
                    window.location.origin + environment.siteUrl + 'assets/builderjs/image/backgrounds/images15.jpg',
                    window.location.origin + environment.siteUrl + 'assets/builderjs/image/backgrounds/images16.jpg',
                    window.location.origin + environment.siteUrl + 'assets/builderjs/image/backgrounds/images17.png'
                ]
            }
        );

        // Load existing HTML template
        if (content !== '') {
            builder.load(content);
        }

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

    /**
     *  Adjust array to match the builderjs format
     * @private
     */
    private buildTemplateArray() {
        const componentUrl = environment.siteUrl + this.router.url.split('?')[0].slice(1);
        this.emailTemplates = this.emailTemplates.map((template: any) => {
            return {
                name: template.name,
                url: componentUrl + template.url + '&entry_id=' + this.landingPageObj.id,
                thumbnail: environment.siteUrl + template.thumbnail,
            }
        });
    }

    /**
     * Set go back URL
     * @param url
     */
    setGoBackUrl(url: string) {
        // Store go back URL in local storage
        this.localStore.set('ref', url);
    }

    /**
     * Get go back URL
     */
    getGoBackUrl() {
        // Store go back URL in local storage
        const url = this.localStore.get('ref');

        if (!url) {
            return '/';
        }

        // URL decode
        return decodeURIComponent(url);
    }

    /**
     * Get entry from API
     * @private
     */
    private getEntryData() {
        this.httpService.getSingleEntry(this.landingPageObj.id, false, true).subscribe((data: any) => {
            const content = data.content === undefined ? '' : data.content;
            this.initBuilder(content);
        });
    }
}
