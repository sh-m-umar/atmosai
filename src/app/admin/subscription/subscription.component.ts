import {Component, OnInit} from '@angular/core';
import {HttpService} from "../../http.service";
import {LocalService} from "../../local.service";
import {AuthService} from "../../auth.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-subscription',
    templateUrl: './subscription.component.html',
    styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {
    public step = 2;
    public packages: any = [];
    public addons: any = [];
    public paymentInProgress = false;

    public subscriptionObj: any = {
        billing: {
            first_name: '',
            last_name: '',
            address_1: '',
            address_2: '',
            city: '',
            state: '',
            postcode: '',
            country: 'US',
            email: '',
            phone: ''
        },
        shipping: {
            first_name: '',
            last_name: '',
            address_1: '',
            address_2: '',
            city: '',
            state: '',
            postcode: '',
            country: 'US',
        },
        customer_id: 0,
        site_id: 0,
        site_url: '',
        billing_type: 'monthly',
        line_items: [{module_id: 'crm', number_of_seats: 1, package_id: ''}],
        app_addons: [],
        payment_method: 'nmi',
        payment_method_title: 'Credit card (NMI)',
        nmi: {
            card: {
                number: '',
                'card-expiry': '',
                'card-cvc': ''
            }
        }
    };

    public seatsOptions = [1, 3, 5, 10, 15, 20, 25, 30, 40, 50, 100, 200];
    public seatsModel: any = [1, 1, 1, 1];
    public loadedPackages = false;
    public loadedAddons = false;

    constructor(public httpService: HttpService, private localStore: LocalService,public auth: AuthService, public router: Router) {
    }

    ngOnInit(): void {
        this.loadSubscriptions();
        this.loadAddons();
        const userData = this.auth.getUserData();

        if (userData) {
            this.subscriptionObj.site_url = userData?.atmos_url;
            this.subscriptionObj.billing.first_name = userData.fname;
            this.subscriptionObj.billing.last_name = userData.lname;
            this.subscriptionObj.billing.email = userData.user_email;
        }
    }

    loadSubscriptions() {
        const local = this.localStore.get('packages');
        if (local) {
            this.packages = local;
            this.loadedPackages = true;
        } else {
            this.httpService.getPackages().subscribe((data: any) => {
                this.packages = data;
                this.loadedPackages = true;
            });
        }
    }

    loadAddons() {
        const local = this.localStore.get('addons');
        if (local) {
            this.addons = local;
            this.loadedAddons = true;
        } else {
            this.httpService.getPackages('addons').subscribe((data: any) => {
                this.addons = data;
                this.loadedAddons = true;
            });
        }
    }

    /**
     * Get package by package id
     *
     * @param packageId
     * @param key
     * @param type
     */
    getPackage(packageId = 'crm-free', key: any = false, type = 'packages'): any {
        const packageObj = type === 'packages' ? this.packages.find((packageItem: any) => packageItem.package_id === packageId) : this.addons.find((packageItem: any) => packageItem.addon_id === packageId);

        if (packageObj !== undefined) {
            if (key === 'price') {
                const price = this.subscriptionObj.billing_type == 'monthly' ? packageObj?.per_seat_price_monthly : packageObj?.per_seat_price_yearly;

                return price === undefined ? '' : price;
            }

            if (key) {
                return packageObj[key] === undefined ? '' : packageObj[key];
            }
        }

        return packageObj;
    }

    /**
     * Select seats
     *
     * Open modal if seats >= 50
     */
    selectSeats() {
        setTimeout(() => {
            if (this.subscriptionObj.line_items[0].number_of_seats >= 50) {
                // Trigger click by class name to open modal
                const element = document.getElementsByClassName('trigger-fity-plus-popup')[0] as HTMLElement;
                element.click();
            }
        }, 100);
    }

    selectPackage(packageId = 'crm-free') {
        this.subscriptionObj.line_items[0].package_id = packageId;
    }

    /**
     * Add or remove addon to plan
     *
     * @param addonId
     * @param seats
     */
    addRemoveAddonToPlan(addonId = '', seats = 1) {
        const index = this.subscriptionObj.app_addons.findIndex((addon: { addon_id: string; }) => addon.addon_id === addonId);
        if (index !== -1) {
            this.subscriptionObj.app_addons.splice(index, 1);
        } else {
            this.subscriptionObj.app_addons.push({addon_id: addonId, number_of_seats: seats});
        }
    }

    checkIfAddOnSelected(addonId = '') {
        return this.subscriptionObj.app_addons.findIndex((addon: { addon_id: string; }) => addon.addon_id === addonId) !== -1;
    }

    getTrialExpiryDate(addonId = '') {
        const addon = this.getPackage(addonId, false, 'addons');
        if (addon === undefined) {
            return;
        }

        const trialDays = this.subscriptionObj.billing_type === 'monthly' ? addon.free_trial_days_monthly : addon.free_trial_days_yearly;

        // Add days to current date
        const date = new Date(new Date().getTime() + trialDays * 24 * 60 * 60 * 1000);

        // Format date MM/DD/YYYY
        return date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear();
    }

    getSubtotal(onlyNotTrial = true) {

        // Get package amount
        const subsPackage: any = this.getPackage(this.subscriptionObj.line_items[0].package_id, false, 'packages');
        const packageAmount = this.subscriptionObj.billing_type == 'monthly' ? subsPackage?.per_seat_price_monthly : subsPackage?.per_seat_price_yearly;

        // Get addons amount
        let addonsAmount = 0;
        this.subscriptionObj.app_addons.forEach((addon: any) => {
            const subsAddon: any = this.getPackage(addon.addon_id, false, 'addons');
            if (!onlyNotTrial || (onlyNotTrial && !subsAddon.on_trial)) {
                const addonAmount = this.subscriptionObj.billing_type == 'monthly' ? subsAddon?.per_seat_price_monthly : subsAddon?.per_seat_price_yearly;
                addonsAmount += addonAmount * addon.number_of_seats;
            }
        });

        return packageAmount * this.subscriptionObj.line_items[0].number_of_seats + addonsAmount;
    }

    getTotal(onlyNotTrial = true) {
        return this.getSubtotal(onlyNotTrial) + this.getTax();
    }

    getNextBillingDate() {
        const currentDate = new Date();
        if (this.subscriptionObj.billing_type == 'monthly') {
            return currentDate.getMonth() + 2 + '/' + currentDate.getDate() + '/' + currentDate.getFullYear();
        } else {
            return currentDate.getMonth() + 1 + '/' + currentDate.getDate() + '/' + (currentDate.getFullYear() + 1);
        }
    }

    getTax() {
        return 0;
    }

    getNextInvoiceAmount() {
        return this.getTotal(false);
    }

    payNow() {
        this.paymentInProgress = true;
        // Attach user ID
        const userData = this.auth.getUserData();
        this.subscriptionObj.customer_id = userData.ID
        this.subscriptionObj.site_id = userData.current_site_id
        this.httpService.subscriptionPayment(this.subscriptionObj).subscribe((data: any) => {
            alert(data.message);
            if (data.success == true) {
                // Get user data again.
                this.getSubscriptionData();
            }

            this.paymentInProgress = false;
        });
    }

    getSubscriptionData(){
        this.httpService.getSiteMeta().subscribe((data: any) => {
            let userData = this.auth.getUserData();
            userData.trial_dates = data;

            // Set user data
            this.auth.setUserData(userData);
            this.router.navigate(['/']);
        });
    }

    nextStep() {
        switch (this.step) {
            case 2:
                // Check if package is selected
                if (this.subscriptionObj.line_items.length === 0 || this.subscriptionObj.line_items[0].package_id === '') {
                    alert('Please select a package');
                    return;
                }
                break;
            case 3:
                // No validation for step 3, addons are optional
                break;
            case 4:
                // Validation for billing info and payment
                if (!this.validateBillingInfo()) {
                    return;
                }
                break;
        }

        this.step++;
    }

    prevStep() {
        this.step--;
    }

    /**
     * Validate billing info
     */
    validateBillingInfo() {
        // Check if billing info is filled
        if (
            this.subscriptionObj.billing.first_name === '' ||
            this.subscriptionObj.billing.address_1 === '' ||
            this.subscriptionObj.billing.city === '' ||
            this.subscriptionObj.billing.state === '' ||
            this.subscriptionObj.billing.postcode === '' ||
            this.subscriptionObj.billing.country === '' ||
            this.subscriptionObj.billing.email === ''
        ) {
            alert('Please fill all billing info');
            return false;
        }

        // Check if credit card info is filled
        if (
            this.subscriptionObj.nmi.card.number === '' ||
            this.subscriptionObj.nmi.card['card-expiry'] === '' ||
            this.subscriptionObj.nmi.card['card-cvc'] === ''
        ) {
            alert('Please fill all credit card info');
            return false;
        }

        return true;
    }

    /**
     * Mask card number
     */
    maskCardNumber() {
        if (this.subscriptionObj.nmi.card.number.length > 4) {
            return this.subscriptionObj.nmi.card.number.replace(/.(?=.{4})/g, '*');
        }
    }

    /**
     * format card input fields
     */
    formatCardInput() {
        // Format cvc code like this "mm / yy"
        if (this.subscriptionObj.nmi.card['card-expiry'].length < 7 ) {
            // Format card expiry
            this.subscriptionObj.nmi.card['card-expiry'] = this.subscriptionObj.nmi.card['card-expiry'].replace(/\s/g, '');
            this.subscriptionObj.nmi.card['card-expiry'] = this.subscriptionObj.nmi.card['card-expiry'].replace(/(\d{2})/g, '$1/').trim();
            this.subscriptionObj.nmi.card['card-expiry'] = this.subscriptionObj.nmi.card['card-expiry'].replace(/(\d{2})\/(\d{2})/g, '$1 / $2').trim();

            // remove last slash
            if (this.subscriptionObj.nmi.card['card-expiry'].length > 7) {
                this.subscriptionObj.nmi.card['card-expiry'] = this.subscriptionObj.nmi.card['card-expiry'].slice(0, -1);
            }
        }
    }
}
