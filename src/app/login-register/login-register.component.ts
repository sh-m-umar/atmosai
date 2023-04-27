import {Component, OnInit} from '@angular/core';
import {HttpService} from "../http.service";
import {AuthService} from "../auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {LocalService} from "../local.service";

@Component({
    selector: 'app-login-register',
    templateUrl: './login-register.component.html',
    styleUrls: ['./login-register.component.scss']
})
export class LoginRegisterComponent implements OnInit {
    hide = true;
    formModel: any = {};
    disableLogin = false;
    loginBtnTxt = 'Login';
    msg = '';
    eyeStyle = 'fa-eye';
    isPasswordView = 'password';
    loginRegisterView = 'login';
    step = 1;
    public autoLogin = false;
    invitedUser = false;
    signUpUser: any = {};
    loading = false;
    forgetForm: boolean = false;
    resetEmailSent: boolean = false;
    securityCode: any = '';

    constructor( private localStore: LocalService, private http: HttpService, private auth: AuthService, private route: ActivatedRoute, private router: Router) {
        
        // setup activation_key for the api call
        if( router.url.indexOf( '/invitation/accept' ) >= 0 ) {
            this.invitedUser = true;
            route.queryParams.subscribe(
                params => {
                    if( params['key'] != undefined && params['key'] ) {
                        this.signUpUser.activation_key = params['key'];
                    }

                    // pre populate email address also remove "=" oprator from the string
                    if( params['mail_id'] != undefined && params['mail_id'] ) {
                        const encryptedEmail = params['mail_id'].replace( "=", "" );
                        this.signUpUser.email = atob( encryptedEmail );
                    }
                }
            );
        }
    }

    ngOnInit(): void {
        // if user already logged in, redirect to home page
        if (this.auth.isLoggedIn()) {
            this.auth.router.navigate(['/']);
        }

        // If user comes with a token in the url, then auto login
        this.route.queryParams.subscribe((params: any) => {
            if (params.crm_data !== undefined) {
                const token = params?.crm_data;
                this.autoLogin = true;
                this.auth.autoLogin(token);
            }
        });
    }

    // toggle to view password in field and changing the eye icon
    passwordView() {
        (this.isPasswordView == 'password' ? this.isPasswordView = 'text' : this.isPasswordView = 'password');
        (this.eyeStyle == 'fa-eye' ? this.eyeStyle = 'fa-eye-slash' : this.eyeStyle = 'fa-eye');
    }

    // toggle between login and register view
    registerOrLogin(view: string) {
        this.loginRegisterView = view;
    }

    login() {
        this.disableLogin = true;
        this.loginBtnTxt = 'Logging in...';
        this.msg = '';
        this.http.login(this.formModel).subscribe((res: any) => {
            if (res.token !== undefined) {
                this.auth.setToken(res, true, true);
                this.loginBtnTxt = 'Redirecting...';
            } else {
                this.msg = res.message;
                this.disableLogin = false;
                this.loginBtnTxt = 'Login';
            }
        }, (error: any) => {
            this.msg = error.error.message;
            this.disableLogin = false;
            this.loginBtnTxt = 'Login';
        });
    }

    signUpSubmit() {
        this.loading = true;
        const data = {
            email: this.signUpUser.email,
            password : this.signUpUser.password,
            activation_key : this.signUpUser.activation_key,
            full_name : this.signUpUser.name,
        }

        this.http.addInvitedUser(data).subscribe((res: any) => {
            if (res.user_data.token !== undefined) {
                this.auth.setToken(res.user_data, true, true);
            }
            this.msg = res.message;
            this.loading = false;
        }, (error: any) => {
            this.msg = error.error.message;
            this.loading = false;
        });
    }

    // reset password
    resetPassword() {
        
        // check if code is present
        if( this.resetEmailSent && this.securityCode ) {

            const data = {
                email: this.formModel.username,
                password: this.formModel.password,
                code: this.securityCode
            }

            // disable the button
            this.disableLogin = true;

            this.http.setPassword( data ).subscribe( ( res: any ) => {
                this.msg = res.message;
    
                // enable the button 
                this.disableLogin = false;
    
                // show reset password fields
                if( res.data.status == 200 ) {

                    // remove password from the form data
                    this.formModel.password = '';

                    // hide forget form
                    this.forgetForm = false;

                    this.resetEmailSent = true;
                }
            }, 
            (error: any) => {
                this.msg = error.error.message;
                
                // enable the button
                this.disableLogin = false;
            } );
        } else {

            const data = {
                email: this.formModel.username
            }
    
            // disable the button
            this.disableLogin = true;
    
            this.http.resetPassword( data ).subscribe( ( res: any ) => {
                this.msg = res.message;
    
                // enable the button 
                this.disableLogin = false;
    
                // show reset password fields
                if( res.data.status == 200 ) {
                    this.resetEmailSent = true;

                    // empty password field
                    this.formModel.password = '';
                }
            }, 
            (error: any) => {
                this.msg = error.error.message;
                
                // enable the button
                this.disableLogin = false;
            } );
        }
        
    }

    // enable reset password fields
    enableRestFields() {

        // check if form is submitting
        if( !this.disableLogin ) {
            this.forgetForm = true;
            this.formModel.password = '';
        }
    }

}
