import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {HttpHeaders} from '@angular/common/http';
import {catchError, map, retry} from 'rxjs/operators';
import {throwError} from "rxjs";
import {LocalService} from './local.service';
import {AuthService} from './auth.service';
import {environment} from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class HttpService {
    private endpointURL = environment.endpointURL;

    constructor(private localStore: LocalService, private http: HttpClient, private auth: AuthService) {
    }

    /**
     * Delete tab
     * @param id
     */
    public deleteTab(id: number) {
        return this.deleteMethod('tabs/' + id);
    }

    /**
     * Delete status
     * @param id
     */
    public deleteStatus(id: number) {
        return this.deleteMethod('column-statuses/' + id);
    }

    /**
     * Create/update status
     * @param data
     */
    public updateStatus(data = <any>{}) {
        const id = data.id !== undefined && parseInt(data.id) !== 0 ? '/' + data.id : '';
        return this.postMethod('column-statuses' + id, data);
    }

    /**
     * Create new tab or update exiting tab
     * Pass id to update exiting tab
     *
     * @param data
     */
    public updateTab(data = <any>{}) {
        return this.postMethod('tabs', data);
    }

    /**
     * Get email settings
     */
    public getCrmSettings(type = 'email_settings') {
        return this.getMethod('crm-settings?key=' + type);
    }

    /**
     * For getting profile options
     * @param optionName Name of the options you want to get comma separated
     * @returns observable
     */
    public getProfileOPtions(optionName: string) {
        return this.getMethod('get-options?option_name=' + optionName);
    }

    /**
     * For updating profile options
     * @param option option object
     * @returns observable
     */
    public updateProfileOPtions(option: any) {
        return this.postMethod(`update-options`, {option_name: option.name, option_value: option.value});
    }

    /**
     * For updating profile options in bulk
     * @param option option array of object
     * @returns observable
     */
    public updateProfileOPtionsBulk(options: any) {
        return this.postMethod(`update-bulk-options`, options);
    }

    /**
     * Get email thread by ID
     */
    public getEmailThread(emailId = 0) {
        return this.getMethod('activities/inbox/' + emailId);
    }

    /**
     * Bulk actions Columns
     * @param data
     */
    public bulkActionsColumns(data: any) {
        return this.postMethod('columns/bulk', data);
    }

    /**
     * Create activity
     * @param data
     */
    public createActivity(data: any) {
        return this.postMethod('activities', data);
    }

    /**
     * Get entry activities
     * @param entryId
     */
    public getEntryActivities(entryId = 0) {
        return this.getMethod('activities?entry_id=' + entryId);
    }

    /**
     * Get entry activities
     * @param entryId
     */
    public getEntryActivityLogs(entryId = 0) {
        return this.getMethod('activity-log?entry_id=' + entryId);
    }

    /**
     * Bulk actions activities
     * @param data
     */
    public bulkActionsActivities(data: any) {
        return this.postMethod('activities/bulk', data);
    }

    /**
     * Create new form field
     * @param data
     */
    public createFormField(data: any) {
        return this.postMethod('form-fields', data);
    }

    /**
     * Create new form (touchpoint)
     * @param data
     */
    public createForm(data: any) {
        return this.postMethod('forms', data);
    }

    /**
     * Getforms (touchpoint)
     */
    public getForms() {
        return this.getMethod('forms');
    }

    /**
     * Update CRM settings
     */
    public updateCrmSettings(data: any) {
        return this.postMethod('crm-settings', data);
    }

    /**
     * Bulk actions rows
     * @param data
     */
    public bulkActionsRows(data: any) {
        return this.postMethod('entries/bulk', data);
    }

    /**
     * Bulk actions menu
     * @param data
     */
    public bulkActionsMenu(data: any) {
        return this.postMethod('menus/bulk', data);
    }

    /**
     * Add app
     * @param data
     */
    public addAppTemplate(data: any) {
        return this.postMethod('templates/add-app', data);
    }

    /**
     * Update column data
     * @param columnData
     */
    public updateColumn(columnData: any) {
        return this.postMethod('columns/' + columnData.id, columnData);
    }

    /**
     * Create new board from template and add to the menu
     * @param data
     */
    public boardsMigration(data: any) {
        return this.postMethod('templates/migrate-boards', data);
    }

    /**
     * Get single entry details | full row
     * @param id
     * @param metaOnly
     * @param singleRow
     */
    getSingleEntry(id = 0, metaOnly = false, singleRow = false) {
        let url = metaOnly ? '?meta_only=true' : '';

        if (singleRow) {
            url = '?formatted=1';
        }

        return this.getMethod('entries/' + id + url);
    }

    /**
     * Update row data
     * @param rowData
     */
    updateRow(rowData: any) {
        return this.postMethod('entries/' + rowData.entry_id, rowData);
    }

    /**
     * Update row meta data
     * @param rowData
     */
    updateRowMeta(rowData = <any>{}) {
        return this.postMethod('entry-meta', rowData);
    }

    /**
     * Delete group
     * @param groupId
     */
    deleteGroup(groupId: string) {
        return this.deleteMethod('groups/' + groupId);
    }

    /**
     * Update group
     * @param groupId
     */
    updateGroup(groupId: string, data: any) {
        return this.updateMethod(`groups/${groupId}`, data);
    }

    /**
     * Delete menu item
     * @param id
     */
    deleteMenu(id: string) {
        return this.deleteMethod('menus/' + id);
    }

    /**
     * Delete group
     * @param id
     */
    deleteForm(id: string) {
        return this.deleteMethod('forms/' + id);
    }

    /**
     * Delete group
     * @param id
     */
    deleteActivity(id = 0) {
        return this.deleteMethod('activities/' + id);
    }

    /**
     * Delete group
     * @param id
     */
    deleteFormField(id: string) {
        return this.deleteMethod('form-fields/' + id);
    }

    /**
     * Delete row
     * @param rowId
     */
    deleteRow(rowId = 0) {
        return this.deleteMethod('entries/' + rowId);
    }

    /**
     * Delete column
     * @param colId
     */
    deleteCol(colId = 0) {
        return this.deleteMethod('columns/' + colId);
    }

    /**
     * Create new entry row
     *
     * @param data
     */
    public addNewRow(data: any) {
        return this.postMethod('entries', data);
    }

    /**
     * Create New group
     *
     * @param data
     */
    public addNewGroup(data: any) {
        return this.postMethod('groups', data);
    }

    /**
     * Create New group
     *
     * @param boardId
     * @param name
     * @param type
     * @param sub
     * @param focusId
     * @param width
     */
    public addNewColumn(data: any) {
        return this.postMethod('columns', data);
    }

    /**
     * Get list of all the boards
     */
    public getBoards() {
        return this.getMethod('boards');
    }

    /**
     * Get list of all the boards
     */
    public getTags() {
        return this.getMethod('tags');
    }

    /**
     * Get list of all the boards
     */
    public createTag(data: any) {
        return this.postMethod('tags', data);
    }

    public deleteTag(id:string|number) {
        return this.deleteMethod('tags/' + id);
    }

    /**
     * Get boards by IDs and limited columns data
     */
    public getBoardsBulk(data: any) {
        return this.getMethod('boards/bulk?action=' + data.action + '&boards=' + data.boards);
    }

    public postBoardsBulk(data: any) {
        return this.postMethod('boards/bulk', data);
    }

    /**
     * Get list of all the boards
     */
    public getMenuItems() {
        return this.getMethod('menus');
    }

    public getUserData() {
        return this.getMethod('users/me');
    }

    /**
     * Update board
     */
    public updateBoard(boardId: string | number, data: any) {
        return this.postMethod('boards/' + boardId, data);
    }

    /**
     * Get list of all the boards
     */
    public getSingleBoard(boardId: string | number) {
        return this.getMethod('boards/' + boardId);
    }

    public deleteBoard(boardId: string | number) {
        return this.deleteMethod('boards/' + boardId);
    }

    public login(data: any) {
        return this.postMethod('login', data, false);
    }

    public register(data: any) {
        //return this.postMethod('users/register', data);
    }

    /**
     * Get public invoice
     *
     * @param id
     * @param token
     */
    public getPublicInvoice(id: number | string = 0, token: string = '') {
        return this.getMethod(`entries/public/invoice?id=${id}&token=${token}`, false);
    }

    /**
     * Save invoice signature
     *
     * @param data
     */
    public saveSignaturePublicInvoice(data: any) {
        return this.postMethod(`entries/public/invoice`, data, false);
    }

    /**
     * Update data
     *
     * @param urlPath
     * @param postData
     */
    public updateMethod(urlPath: string, postData: any = {}) {
        // add authorization header with jwt token if available
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.auth.getToken(),
            }),
            withCredentials: false
        }

        return this.http.put(
            this.endpointURL + 'atmos-api/v1/' + urlPath,
            postData,
            httpOptions
        ).pipe(
            // eg. "map" without a dot before
            map((data: any) => {
                return data;
            }));
    }

    /**
     * Post HTTP request
     * @param urlPath
     * @param postData
     * @private
     */
    private postMethod(urlPath = 'login', postData: any = {}, auth = true) {
        // add authorization header with jwt token if available

        // Default header
        let httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        }

        // Add authorization header only if required
        if (auth) {
            httpOptions.headers = httpOptions.headers.append('Authorization', 'Bearer ' + this.auth.getToken());
        }

        // In bulk activities we do not need content type in header
        if (urlPath === 'activities/bulk') {
            httpOptions = {
                headers: new HttpHeaders({
                    'Authorization': 'Bearer ' + this.auth.getToken(),
                })
            }
        }

        let url = '';

        // Different URL path for login request
        switch (urlPath) {
            case 'login':
                url = this.endpointURL +'jwt-auth/v1/token';
                break;
            case 'update_payment_method':
                url = `${postData.site_url}/wp-json/atmos-api/v1/admin/billing/change-payment-method?req_by=${postData.site_id}`;
                // remove unwanted data
                delete postData.site_url;
                delete postData.site_id;
                break;
            case 'subscription_payment':
                url = `${postData.site_url}/wp-json/atmosai/v1/subscription/create?req_by=${postData.site_id}`;
                break;
            default:
                url = this.endpointURL +'atmos-api/v1/' + urlPath;
        }

        return this.http.post(
            url,
            postData,
            httpOptions
        ).pipe(
            // eg. "map" without a dot before
            map((data: any) => {
                return data;
            }));
    }

    /**
     * Delete method
     */
    public deleteMethod(urlPath: string) {
        // add authorization header with jwt token if available
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.auth.getToken(),
            }),
            withCredentials: false
        }

        return this.http.delete(this.endpointURL + 'atmos-api/v1/' + urlPath, httpOptions)
            .pipe(
                retry(3), // retry a failed request up to 3 times
                catchError(this.handleError) // then handle the error
            );
    }

    /**
     * Get HTTP request
     * @param urlPath
     * @param auth
     * @param fullUrl
     * @private
     */
    private getMethod(urlPath: string, auth = true, fullUrl = false) {
        // add authorization header with jwt token if available
        let httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',

            }),
            withCredentials: false
        }

        // Add authorization header if needed
        if (auth) {
            httpOptions.headers = httpOptions.headers.append('Authorization', 'Bearer ' + this.auth.getToken());
        }

        const url = fullUrl ? urlPath : this.endpointURL + 'atmos-api/v1/' + urlPath;

        // Add cache to http request to avoid multiple requests
        return this.http.get(url, httpOptions)
            .pipe(
                retry(0), // retry a failed request up to 3 times
                catchError(this.handleError) // then handle the error
            );
    }

    /**
     * Handle errors in HTTP response request
     * @param error
     * @private
     */
    private handleError(error: HttpErrorResponse) {
        if (error.status === 0) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error);
        } else {
            // invalid token
            if (error.error !== undefined && error.error.code !== undefined && error.error.code === 'jwt_auth_invalid_token') {
                // redirect to login page
                localStorage.clear();
                window.location.reload();
            }

            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong.
            console.error(
                `Backend returned code ${error.status}, body was: `, error.error);
        }
        // Return an observable with a user-facing error message.
        return throwError(() => new Error('Something bad happened; please try again later.'));
    }

    /**
     * Upload file
     *
     * @param urlPath
     * @param postData
     */
    public uploadFile(urlPath: string, postData: any = {}) {
        // add authorization header with jwt token if available
        const httpOptions = {
            headers: new HttpHeaders({
                'Authorization': 'Bearer ' + this.auth.getToken()
            })
        }

        return this.http.post(
            this.endpointURL + 'atmos-api/v1/' + urlPath,
            postData,
            httpOptions
        ).pipe(
            // eg. "map" without a dot before
            map((data: any) => {
                return data;
            }));
    }

    public getListOfUpdates(entry_id: any) {
        return this.getMethod('updates?entry_id=' + entry_id);
    }

    public addUpdates(data: any) {
        return this.postMethod('updates', data);
    }

    public updateBulk(data: any) {
        return this.postMethod('updates/bulk', data);
    }

    public getUsers() {
        return this.getMethod('users');
    }

    public newFilterView(data: any) {
        return this.postMethod('filter-views', data);
    }

    public getFilterView(data: any) {
        return this.getMethod('filter-views' + data);
    }

    public searchEntries(params: string) {
        return this.getMethod('entries/search' + params);
    }

    public getApiToken(userId: string) {
        return this.getMethod(`users/token?user_id=${userId}`);
    }

    public getSiteMeta() {
        return this.getMethod(`options/get-site-meta`);
    }

    public getBillingOverview() {
        return this.getMethod(`admin/billing/overview`);
    }

    public generateApiToken() {
        return this.postMethod('users/token', {});
    }

    public updateOwnership(data: any) {
        return this.postMethod('update-ownership', data);
    }

    public get2FA() {
        return this.getMethod('users/two-factor-auth');
    }

    public update2FA(data: any) {
        return this.postMethod('users/two-factor-auth', data);
    }

    public importXlsData(data: any) {
        return this.postMethod('boards/import-to-board-from-matrix', data);
    }

    public getUserInfo(queryParam = '') {
        return this.getMethod(`crm-settings/getting-started${queryParam}`);
    }

    public getTopDeals(limit: number) {
        return this.getMethod(`boards/get/top-deals?limit=${limit}`);
    }

    public getInboxWidgetData(limit: number) {
        return this.getMethod(`boards/get/inbox-widget?limit=${limit}`);
    }

    public saveUserInfo(data: any) {
        return this.postMethod('crm-settings/getting-started', data);
    }

    public sendInvite(data: any) {
        return this.postMethod('users/invite', data);
    }

    public saveContactSales(data: any) {
        return this.postMethod('crm-settings/contact-sales', data);
    }

    public getSubscribers(data: any) {
        return this.getMethod(`notifications/get-subscribers?entity_type=${data.entity_type}&entity_id=${data.entity_id}`);
    }

    public getBoardSubscribers(data: any) {
        return this.getMethod(`notifications/get-subscriber?entity_type=${data.entity_type}&entity_id=${data.entity_id}`);
    }

    public getPackages(type = 'packages') {
        return this.getMethod(`subscription-get-packages?type=${type}`);
    }

    public addSubscriber(data: any) {
        return this.postMethod('notifications/add-subscriber', data);
    }

    public deleteSubscriber(subscriberID: any) {
        return this.deleteMethod(`notifications/delete-subscriber/${subscriberID}`);
    }

    public addInvitedUser(data: any) {
        return this.postMethod('users/invite-signup', data, false);
    }

    public getHomeWidgets() {
        return this.getMethod(`boards/get/homepage?cached=1`);
    }

    public getCustomerInvoice(invoiceId: string, token: string) {
        return this.getMethod(`entries/public/invoice?id=${invoiceId}&token=${token}`);
    }

    // add to favorites
    public addToFavorites(data: any) {
        return this.postMethod('users/favorites', data);
    }

    public subscriptionPayment(data: any) {
        return this.postMethod('subscription_payment', data);
    }

    public updatePaymentMethod(data: any) {
        return this.postMethod('update_payment_method', data);
    }

    // get favorites list
    public getFavorites() {
        return this.getMethod(`users/favorites`);
    }

    // remove from favorites
    public removeFavorites(data: any) {
        return this.postMethod('users/favorites', data);
    }

    // update user meta
    public updateUserMeta(data: any) {
        return this.postMethod('users/metadata', data);
    }

    // get user meta
    public getUserMeta(keys = '', userID = 0) {
        return this.getMethod('users/metadata/' + (keys ? ('?meta_keys=' + keys) : '') + (userID ? ('&user_id=' + userID) : ''));
    }

    // send bulk emails
    public sendBulkEmails(data: any) {
        return this.postMethod('entries/send-bulk-email', data);
    }

    // send bulk sms
    public sendBulkSms(data: any) {
        return this.postMethod('entries/send-bulk-sms', data);
    }

    // send payment response
    public sendPaymentResponse(data: any) {
        return this.postMethod('entries/public/invoice-payment', data, false);
    }

    // user bulk action
    public userBulkAction(data: any) {
        return this.postMethod('users/bulk-actions', data);
    }

    // get notifications
    public getNotifications(queryParams: string) {
        return this.getMethod(`notifications/get?${queryParams}`);
    }

    // read/unread notifications
    public markNotificationsReadUnread(notificationId: string, status: string) {
        return this.postMethod(`notifications/${notificationId}`, {status});
    }

    // update notifications settings
    public addNotificationSubscriber(data: any) {
        return this.postMethod('notifications/add-subscriber', data);
    }

    // get notifications
    public getNotificationSubscriber(queryParams: string) {
        return this.getMethod(`notifications/get-subscribers?${queryParams}`);
    }

    // delete notifications
    public deleteNotifications(notificationId: string) {
        return this.deleteMethod(`notifications/${notificationId}`);
    }

    // read/unread all notifications
    public markAllNotificationsAsRead() {
        return this.postMethod(`notifications/read-all`);
    }

    // delete all notifications
    public deleteAllNotifications() {
        return this.deleteMethod(`notifications/delete-all`);
    }

    // get notifications
    public getUsageState(queryParams: string) {
        return this.getMethod(`get-usage-state?${queryParams}`);
    }

    // reset password request
    public resetPassword(data: any) {
        return this.postMethod('reset-password', data, false);
    }

    // set new user password
    public setPassword(data: any) {
        return this.postMethod('set-password', data, false);
    }

    // reset password for logged in user
    public resetUserPassword(data: any) {
        return this.postMethod('set-password', data);
    }

    getWeatherForecast(date: string, location: string, future = false) {
        const urlType = future ? 'future.json' : 'history.json';

        return this.getMethod(`https://api.weatherapi.com/v1/${urlType}.json?key=3829f2023ab74a68874200457232802&q=${location}&dt=${date}`, false, true);
    }

    getUserCategories() {
      return this.getMethod(`users/categories`);
    }

    addUpdateUserCategories(data: any) {
      return this.postMethod(`users/categories`, data);
    }

    /**
     * Get all addon apps
     */
    public getApps() {
        return this.getMethod('subscription-get-packages?type=addons&return=array');
    }

    /**
     * Update user's working status
     */
    updateWorkingStatus(data: any) {
      return this.postMethod(`users/working-status`, data);
    }

    changePassword(data: any) {
      return this.postMethod(`users/change-password`, data);
    }

    updateSecurityQuestions(data: any) {
      return this.postMethod(`users/security-questions`, data);
    }

    updateUserMetaData(data: any) {
      return this.postMethod(`users/user-meta`, data);
    }

    getUserMetaData(queryParam: string = '') {
      return this.getMethod(`users/user-meta${queryParam}`);
    }

    updateManageNotifications(data: any) {
      return this.postMethod(`users/manage-notifications`, data);
    }

    updateManageDocuments(data: any) {
      return this.postMethod(`users/manage-documents`, data);
    }

    public getBillingInvoices() {
        return this.getMethod('admin/billing/invoices');
    }

    public getBillingPaymentmethod() {
        return this.getMethod('admin/billing/payment-methods');
    }

    public createMenuFolder(data: any) {
      return this.postMethod('menus', data);
    }

    public moveMenuToFolder(menuId: any, data: any) {
      return this.postMethod(`menus/${menuId}`, data);
    }

    public updateColumnStatuses(data: any) {
      return this.postMethod('column-statuses/bulk', data);
    }

    public updateMenu(data: any) {
      return this.postMethod('menus', data);
    }

    public updateMenuTitle(id = 0, title = '') {
        return this.postMethod('menus/' + id, {title: title});
    }

    /**
     * Get recycle bin
     * @param type trash or archived
    */
    public getRecycleBin(type = 'trash') {
      return this.getMethod('recycle-bin?type=' + type);
    }

    public recycleBinAndArchivedAction(data: any) {
      return this.postMethod('recycle-bin', data);
    }
}
