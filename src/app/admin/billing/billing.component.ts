import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../http.service';
import {CacheService} from "../../cache.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../auth.service";

@Component({
    selector: 'app-billing',
    templateUrl: './billing.component.html',
    styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {

    headerCollapsed = false;
    isUpdatePayment = false;
    anglePos = 'down';
    paymentMethod = 'card';
    activeTab: any = 'overview';
    isUpdating = false;
    isLoading = false;
    defaultSettings: any = {
        first_name: '',
        last_name: '',
        company: '',
        address: '',
        city: '',
        postal_code: '',
        country: '',
        state: '',
    };
    settings:any = {...this.defaultSettings};
    billingContacts: any = [];
    overview: any;
    users: Array<any> = [];
    filteredUsers: Array<any> = [];
    selectedUser: any = {name: '', email: '', ID: ''};
    footerTxt = '';
    tab: any;
    invoices: any = [];
    paymentMethods: any = [];
    creditCard: any = {
        payment_method: 'nmi',
        'nmi-card-number': '',
        'nmi-card-expiry':'',
        'nmi-card-cvc':'',
        site_id: '',
        site_url:''
    }

    constructor(
        private httpService: HttpService,
        public cache: CacheService,
        private route: ActivatedRoute,
        public router: Router,
        public auth: AuthService
    ) {
    }

    headerToggle() {
        (!this.headerCollapsed ? this.headerCollapsed = true : this.headerCollapsed = false);
        (!this.headerCollapsed ? this.anglePos = 'down' : this.anglePos = 'up');
    }

    ngOnInit(): void {
        this.activeTab = this.route.snapshot.paramMap.get('tab');
        this.onTabChange(this.activeTab, false);
    }

    getData() {
    }

    getSettings() {
        this.isLoading = true;
        this.httpService.getProfileOPtions('invoice_billing_user_info').subscribe((res: any) => {
            res = res || {...this.defaultSettings};
            try {
                this.settings = JSON.parse(res);
            } catch (e) {
                this.settings = {...this.defaultSettings};
            }
            this.isLoading = false;
        });
    }

    getBillingContacts() {
        this.getUsers();
        this.isLoading = true;
        this.httpService.getProfileOPtions('invoice_billing_contacts').subscribe((res: any) => {
            try {
                this.billingContacts = JSON.parse(res);
            } catch (e) {
                this.billingContacts = [];
            }

            this.isLoading = false;
        });
    }

    onTabChange(tab: string, navigate = true) {
        // navigate to tab
        if (navigate) {
            this.router.navigate(['admin/billing/' + tab]);
        }

        this.activeTab = tab;
        switch (tab) {
            case 'overview':
                this.getOverview();
                break;
            case 'settings':
                this.getSettings();
                break;
            case 'invoices':
                this.getInvoices();
                break;
            case 'payments':
                this.getPayments();
                break;
            case 'billing-contacts':
                this.getBillingContacts();
                break;
            case 'customer-billing':
                this.getCustomerBilling();
                break;
        }
    }

    getOverview() {
        this.isLoading = true;
        this.httpService.getBillingOverview().subscribe((res: any) => {
            this.overview = res;
            this.isLoading = false;
        });
    }

    getInvoices() {
        this.isLoading = true;
        this.httpService.getBillingInvoices().subscribe((res: any) => {
            this.invoices = res;
            this.isLoading = false;
        });
    }

    getPayments() {
        this.isLoading = true;
        this.httpService.getBillingPaymentmethod().subscribe((res: any) => {
            this.paymentMethods = res;
            this.isLoading = false;
        });

        const userData = this.auth.getUserData();
        this.creditCard.site_url = userData?.atmos_url;
        this.creditCard.site_id = userData.current_site_id
    }

    getCustomerBilling() {
        this.isLoading = true;
        this.httpService.getProfileOPtions('invoice_footer_text').subscribe((res: any) => {
            this.footerTxt = res || '';
            this.isLoading = false;
        });
    }

    onSettingsUpdate() {
        this.isUpdating = true;
        const option = {
            name: 'invoice_billing_user_info',
            value: JSON.stringify(this.settings),
        }

        this.httpService.updateProfileOPtions(option).subscribe((res: any) => {
            try {
                this.settings = JSON.parse(res);
            } catch (e) {
                this.settings = {...this.defaultSettings};
            }

            this.isUpdating = false;
        });
    }

    updateSettingsFooterTxt() {
        this.isUpdating = true;
        const option = {
            name: 'invoice_footer_text',
            value: this.footerTxt,
        }

        this.httpService.updateProfileOPtions(option).subscribe((res: any) => {
            this.footerTxt = res || '';
            this.isUpdating = false;
        });
    }

    getUsers() {
        const users = this.cache.getUsersCache();
        if (users) {
            this.users = users;
            this.resetFilteredUsers();
        } else {
            this.httpService.getUsers().subscribe((res: any) => {
                this.cache.setUsersCache(res);
                this.users = res;
                this.resetFilteredUsers();
            });
        }
    }

    onDealLeadChange(text: string) {
        if (text) {
            this.filteredUsers = this.users.filter((user: any) => {
                return user.display_name.includes(text) && user.user_type === "admin";
            });
        }
    }

    onUserSelect(user: any) {
        this.selectedUser.name = user.display_name;
        this.selectedUser.email = user.user_email;
        this.selectedUser.ID = user.ID;
        this.resetFilteredUsers();
    }

    resetFilteredUsers() {
        this.filteredUsers = this.users.filter((user: any) => {
            return user?.user_roles?.administrator.toLowerCase() === "admin";
        });
    }

    addBillingContacts() {
        if (this.selectedUser.name || this.selectedUser.email) {
            this.billingContacts.push({user: this.selectedUser.ID, email: this.selectedUser.email, name: this.selectedUser.name});
            this.selectedUser = {name: '', email: '', ID: ''};

            this.updateBillingContacts();
        }
    }

    removeBillingContact(index: number) {
        this.billingContacts.splice(index, 1);

        this.updateBillingContacts();
    }

    updateBillingContacts() {
        const option = {
            name: 'invoice_billing_contacts',
            value: JSON.stringify(this.billingContacts),
        }
        this.httpService.updateProfileOPtions(option).subscribe((res: any) => {
            try {
                this.billingContacts = JSON.parse(res);
            } catch (e) {
            }
        });
    }


    /**
     * format card input fields
     */
    formatCardInput() {
        // Format cvc code like this "mm / yy"
        if (this.creditCard['nmi-card-expiry'].length < 7 ) {
            // Format card expiry
            this.creditCard['nmi-card-expiry'] = this.creditCard['nmi-card-expiry'].replace(/\s/g, '');
            this.creditCard['nmi-card-expiry'] = this.creditCard['nmi-card-expiry'].replace(/(\d{2})/g, '$1/').trim();
            this.creditCard['nmi-card-expiry'] = this.creditCard['nmi-card-expiry'].replace(/(\d{2})\/(\d{2})/g, '$1 / $2').trim();

            // remove last slash
            if (this.creditCard['nmi-card-expiry'].length > 7) {
                this.creditCard['nmi-card-expiry'] = this.creditCard['nmi-card-expiry'].slice(0, -1);
            }
        }
    }

    savePaymentMethod() {
        // this.isUpdating = true;

        // Handle http request or fail response
        throw this.httpService.updatePaymentMethod(this.creditCard).subscribe((res: any) => {
            // this.isUpdating = false;
            this.isUpdatePayment = false;
            this.getPayments();
        });
    }

    isUpdatePaymentMethod(){
        this.isUpdatePayment = true;
    }
}
