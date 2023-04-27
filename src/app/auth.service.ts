import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {LocalService} from "./local.service";
import {ModuleItemsService} from "./module-items.service";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    tokenStorageKey = 'token';
    userDataKey = 'userData';

    constructor(public router: Router, private local: LocalService) {
    }

    setToken(data: any, clear = true, redirect = false, queryParam = false) {
        // Clear everything before setting the token
        if (clear) {
            this.local.clear();
        }

        // Store token to local storage
        this.setTokenToLocal(data.token);

        // unset a token from object and store to local storage
        delete data.token;
        this.setUserData(data, queryParam);

        setTimeout(() => {
            if (redirect) {
                this.router.navigate(['/']);
            }
        }, 1000);
    }

    autoLogin(token: string) {
        this.setTokenToLocal(token);

        // Store direct encrypted
        localStorage.setItem('menuItems', 'U2FsdGVkX19RFxC5d/JSbCZcN3u+alrhEGUQWb+sj6iF5Jv5zi4tUnBUP85jFyTZ0AxPjAF1a6PmKL69V2noZL5neWsCJxqzt0Q0GvFbLuTVGLfBtKivOwsoyMj5UCgXaISwLpZm5+csrRZInft13OULi9RPinrFUkANoLcDT7B5AYPGj2BSf4tIpV2vAOTu3j3fWzy2CDaGAitOTyJkM3N4dqrcbq8Mes4dVUZ05/VybLlofyfdQmWgkB/jyi2P9qUETbhM6GK5i6W/K272P9Vxy/KzFydsT+CaDIJe4FazVs042KhbeoobPw7gDENzfkGd/3OaeSSWLRg9RA/X1sfl28H3354H7/sSLijFATya5Ju6O74yZvfWJ00Z2Lkz0dYysQOFo8BUy7YsDhj8tp0sT31lVY/ED8VJJNmDQi+2uMKiO+lMYhSeFMTiR+8YL/fdzXUMzC/OEMAoR3Q8crvFegE+k359ZoT+F3cu/J2/15FCsZxNQB/9+fi3BQoCyzKLMl4lv/jeoXRm5+exAKvqJGHOhaty/OGdSu7mLAXJ2bgo9PNkCDH52pj9UmqkHfWEZTWve50VaZSAy1CnhBpapCchrMkX/tabGN1sHGSVy5F6HVzlrV3RSBTVsKPwr37koBbmzYpfq0EIK0dtUqE5jFxDzBfVgQFnwD9nqQT7vzw3Hi4rFrRORNdKzkiWUQFzQGXK9eY0KqW4Lawgv2Ils1oz3JzgcLB3Wc1EIkks0J8WH0lAqPO6gSpI4tjJvhZwuJY+HxKa7IcKa0VjIRgrIniqypY0EaI+jNhHHqSOCZqGVOsEE4p2XFv3IebLePM5oIVUYgjzwromL+q7q4HgXOHpNhmvK3K/nGWPDxdzACxTNW5/lNdIzF360bGHwdm6p/ET6ThHZMyEOh8n6ae7KoAtHVum9QgG+sch/5VP2s/l2quBFobNXB73kgZy4unIi7GMB4O6ByjCI8or4HNbWw9/Wd7GGMxnveizGuLYLUdRbuYlxXj7JkJOTmbgNYgF2rlNe3adppjMgNun6XDWG2zwXDitOc1eu6QMQBvyyl3jtXZ1HeC0XzDH+ZcAypWWHgS856kaeyUOx2nAIsvnqWjbhyCJPQA0TzSFr+M/VhlyQGKcIoFElApG1azSMz3L0Ubg+4T6Gi0JmZ1cLfmQhXquFa3BZfI4FCm9Bpvbq/KQ2K3Usk4ULMI+CNyLgBNz7oyZrrd9GUN183c+Unq8zzEY6CufWJd0izKwoumHoT+MwlFHRtVMujBjznhnLPBEcnS5PMujRCXIyKWTqW6GpKDl3ck74rcna2N0GdjtA9bVOBFaSP9a4phz6TuHCvrTULA9UKqpLs2lrZjnWFU7NYeGqLt8ujPoRVSp6YmiS+dT5D6sMfDFduE9e5TyEMilbiZrJ0ZJNX6u0KYdoVq3kqpVXdZFQbEWLmXKOw9i3sIcOez5enibCvQm8NNbf857xKHjLmwymIlZOFy1dI3mXz9/A7Bcgo1Fmhk/l66zSlI9zeuIyRNZ8Nw27ioiBMxE1E4/IXpQ+Zq+x8CAD+1A8FelmLJx/Van+pquwNOK0bTTfeMuSaUAVRmLDmX5uWQCgkzWgfVmXpz2i6ap8oRdmd9bPVSqi5g5/W50+oQCGLgCOjtebeUKzSFaa1/SuXo8feTvHL6tOg+pMnFdrpiTfj70a8p5XZHle0l4DFXu14T3uJOooQH7ymDemoQiUwqAMR9bJZh03HmjndSFOkW5psiC5Zl7uA+VgaAf0UNQIVY1ZQEiwV3xxWlCZhRMOYgaeIe2/FM92+ItG4CIlM4l+twPomLHeb4XQxwPhO87SH671o6DZcY8c3bFd/Zujmb1GpvdKAZQbVcou4cJ/gWJIl/U08FZiKhbLYbPkD8=');
        // Get decrypted menu items
        const getMenuItems = this.local.get('menuItems');

        // Process it again
        this.processMenuData(getMenuItems);

        this.local.set('onboarding', true);

        setTimeout(() => {
            this.router.navigate(['/get-started']);
        }, 500);
    }

    /**
     * Set token to local storage
     */
    setTokenToLocal(token: string) {
        this.local.set(this.tokenStorageKey, token);
    }

    /**
     * Set user data to local storage
     * @param data
     * @param onboarding
     */
    setUserData(data: any, onboarding = false) {
        // store app menu cache
        if (!onboarding && data.app_menu !== undefined) {

            this.processMenuData(data);
            delete data.app_menu;
        }

        this.local.set(this.userDataKey, data);
    }

    /**
     * Get token from local storage
     */
    getToken() {
        return this.local.get(this.tokenStorageKey);
    }

    /**
     * Get user data from local storage
     */
    getUserData() {
        return this.local.get(this.userDataKey);
    }

    isLoggedIn() {
        return !!this.getToken();
    }

    logout() {
        // Clear all local data
        this.local.clear();
        this.router.navigate(['auth/login']);
    }

    /**
     * Process menu data
     *
     * Please note that same code is used in 'src/app/module-items.service.ts'
     *
     * @param data
     */
    processMenuData(data: any) {
        let menu = data?.app_menu;

        if (data?.is_super_admin) {
            const superAdminMenuItems = [
                {title: 'Subscriptions', link: 'super-admin/subscriptions', icon: 'fa-cube', expanded: false},
                {title: 'Addons', link: 'super-admin/addons', icon: 'fa-cubes', expanded: false},
                {title: 'Settings', link: 'super-admin/settings', icon: 'fa-gear', expanded: false},
            ];

            menu.push({
                title: "Super Admin",
                icon: "crm.png",
                items: superAdminMenuItems,
                module: "super-admin"
            });
        }

        menu = menu === undefined ? data : menu;

        for (let i = 0; i < menu.length; i++) {
            if (menu[i].module === 'super-admin'){
                continue;
            }

            if (i === 0) {
                menu[i].items.push({title: 'Dashboard', link: 'dashboards/2', icon: 'fa-gauge', expanded: false});
            }
            menu[i].items.push({title: 'Add', link: '#', icon: 'fa-add', expanded: false});
        }

        this.local.set('menuItems', menu);
    }
}
