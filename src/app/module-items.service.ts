import {Injectable} from '@angular/core';
import {HttpService} from "./http.service";
import {LocalService} from "./local.service";
import {AuthService} from "./auth.service";

@Injectable({
    providedIn: 'root'
})
export class ModuleItemsService {
    public currentModuleIndex = 0;
    public modules: any = <any>[];

    constructor(private httpService: HttpService, private localStore: LocalService, public auth: AuthService) {
        const localMenus = this.localStore.get('menuItems');
        if (localMenus) {
            this.modules = localMenus;
        }
        this.getSelectedModuleIndex();
    }

    getSelectedModuleIndex() {
        const currentModuleIndex = this.localStore.get('currentModuleIndex');
        this.currentModuleIndex = currentModuleIndex ? currentModuleIndex : 0;
    }

    // Switch module
    setModule(moduleIndex: number) {
        this.localStore.set('currentModuleIndex', moduleIndex);
        this.currentModuleIndex = moduleIndex;
    }

    getAllModules() {
        return this.modules;
    }

    getCurrentModuleIndex() {
        return this.currentModuleIndex;
    }

    getCurrentModule() {
        return this.modules[this.currentModuleIndex];
    }

    getModuleItems() {
        return this.modules[this.currentModuleIndex].items;
    }

    // Get module items from server
    async getModuleItemsFromServerOrLocal() {
        const local = this.localStore.get('menuItems');
        if (local) {
            this.modules = local;
            return this.modules;
        } else {
            await this.httpService.getMenuItems().subscribe((data: any) => {
                this.modules = data;
                this.localStore.set('menuItems', this.modules);
                return this.modules;
            });
        }
    }

    /**
     * Process menu data
     *
     * This code is used in "src/app/auth.service.ts"
     *
     * @param data
     */
    processMenuData(data: any) {
        const userData = this.auth.getUserData();

        if (userData.is_super_admin) {
            const superAdminMenuItems = [
                {title: 'Subscriptions', link: 'super-admin/subscriptions', icon: 'fa-cube', expanded: false},
                {title: 'Addons', link: 'super-admin/addons', icon: 'fa-cubes', expanded: false},
                {title: 'Settings', link: 'super-admin/settings', icon: 'fa-gear', expanded: false},
                {title: 'Client Management', link: 'super-admin/client-management', icon: 'fa-users', expanded: false},
            ];

            data.push({
                title: "Super Admin",
                icon: "crm.png",
                items: superAdminMenuItems,
                module: "super-admin"
            });
        }

        for (let i = 0; i < data.length; i++) {
            if (data[i].module === 'super-admin'){
                continue;
            }

            if (i === 0) {
                data[i].items.push({title: 'Dashboard', link: 'dashboards/2', icon: 'fa-gauge', expanded: false});
            }
            data[i].items.push({title: 'Add', link: '#', icon: 'fa-add', expanded: false});
        }

        this.localStore.set('menuItems', data);
    }
}
