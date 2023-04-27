import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from "./auth.service";
import {LocalService} from "./local.service";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private auth: AuthService, private router: Router, private localStore: LocalService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (this.auth.isLoggedIn()) {
            if (this.isAccountExpired() && this.localStore.get('onboarding') !== true) {
                // Get current component name
                const currentComponents = state.url.split('/');

                if (!currentComponents.includes('subscription')) {
                    this.router.navigate(['/subscription']);
                }

                return true;
            }

            return true;
        } else {
            this.router.navigate(['/auth/login']);

            return false;
        }
    }

    /**
     * Check if account is expired
     */
    isAccountExpired() {
        const user = this.auth.getUserData();

        if (user) {
            const now = new Date();
            const expireDate = new Date(user?.trial_dates?.trial_end_date);

            return now > expireDate;
        }

        return true;
    }
}
