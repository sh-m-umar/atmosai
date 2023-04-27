import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthRoutingModule} from './auth-routing.module';
import {LoginRegisterComponent} from "../../login-register/login-register.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
    declarations: [LoginRegisterComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AuthRoutingModule
    ],
    providers: [
    ],
})
export class AuthModule {
}
