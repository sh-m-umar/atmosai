import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BoardsComponent} from './boards/boards.component';
import {HomeComponent} from "./home/home.component";
import {ProductsComponent} from "./products/products.component";
import {ServicesComponent} from "./services/services.component";
import {EditProductComponent} from "./edit-product/edit-product.component";
import {EditServiceComponent} from "./edit-service/edit-service.component";
import {FinancialsDashboardComponent} from "./financials-dashboard/financials-dashboard.component";
import {DashboardsComponent} from './dashboards/dashboards.component';
import {SalesPortalDashboardComponent} from "./sales-portal-dashboard/sales-portal-dashboard.component";
import {SalesPortalComponent} from "./sales-portal/sales-portal.component";
import {ReplicateSiteComponent} from "./replicate-site/replicate-site.component";
import {GroupEnrollmentComponent} from "./group-enrollment/group-enrollment.component";
import {ProspectManagementComponent} from "./prospect-management/prospect-management.component";
import {MarketingResourcesComponent} from "./marketing-resources/marketing-resources.component";
import {SalesBrokerDashboardComponent} from "./sales-broker-dashboard/sales-broker-dashboard.component";
import {UploadsComponent} from './uploads/uploads.component';
import {LoginRegisterComponent} from './login-register/login-register.component';
import {AuthGuard} from './auth.guard';
import {MyProfileComponent} from "./my-profile/my-profile.component";
import {EmailMarketingDashboardComponent} from "./email-marketing-dashboard/email-marketing-dashboard.component";
import {EditSequenceComponent} from "./edit-sequence/edit-sequence.component";
import {ConnectedAccountsComponent} from "./connected-accounts/connected-accounts.component";
import {CreateRevenueComponent} from './create-revenue/create-revenue.component';
import {GeneralComponent} from "./admin/general/general.component";
import {CustomizationComponent} from "./admin/customization/customization.component";
import {UsersComponent} from "./admin/users/users.component";
import {SecurityComponent} from "./admin/security/security.component";
import {ApiComponent} from "./admin/api/api.component";
import {BillingComponent} from "./admin/billing/billing.component";
import {UsageStatsComponent} from "./admin/usage-stats/usage-stats.component";
import {AppsComponent} from "./admin/apps/apps.component";
import {PermissionsComponent} from "./admin/permissions/permissions.component";
import {FinancialReportsComponent} from "./financial-reports/financial-reports.component";
import {OpeningBalancesComponent} from "./financials/opening-balances/opening-balances.component";
import {SubscriptionComponent} from "./admin/subscription/subscription.component";
import {DialerComponent} from "./campaigns/dialer/dialer.component";
import {EmailComponent} from "./campaigns/email/email.component";
import {SmsComponent} from "./campaigns/sms/sms.component";
import {SocialComponent} from "./campaigns/social/social.component";
import {AdvancedComponent} from "./campaigns/advanced/advanced.component";
import {ArchiveComponent} from "./archive/archive.component";
import {RecyclebinComponent} from "./recyclebin/recyclebin.component";
import {TeamsComponent} from "./admin/teams/teams.component";
import {VendorHomeComponent} from "./vendor-portal/vendor-home/vendor-home.component";
import {PurchaseOrdersComponent} from "./vendor-portal/purchase-orders/purchase-orders.component";
import {InvoicesComponent} from "./vendor-portal/invoices/invoices.component";
import {PaymentReceivedComponent} from "./vendor-portal/payment-received/payment-received.component";
import {StatementsComponent} from "./vendor-portal/statements/statements.component";
import {CustomerHomeComponent} from "./customer-portal/customer-home/customer-home.component";
import {EstimatesComponent} from "./customer-portal/estimates/estimates.component";
import {PaymentMadeComponent} from "./customer-portal/payment-made/payment-made.component";
import {ProjectsComponent} from "./customer-portal/projects/projects.component";
import {CustomerInvoicesComponent} from "./customer-portal/customer-invoices/customer-invoices.component";
import {CustomerStatementsComponent} from "./customer-portal/customer-statements/customer-statements.component";
import {SingleProjectComponent} from './customer-portal/single-project/single-project.component';
import {SingleInvoiceComponent} from './customer-portal/single-invoice/single-invoice.component';
import {MediaFilesComponent} from "./media-files/media-files.component";
import {EditFormComponent} from './forms/edit-form/edit-form.component';
import {EditLandingPageComponent} from "./marketing/edit-landing-page/edit-landing-page.component";
import {AddAgentComponent} from "./add-agent/add-agent.component";
import {OnboardingComponent} from "./onboarding/onboarding.component";
import {GetStartedComponent} from "./get-started/get-started.component";
import {MyInboxComponent} from './my-inbox/my-inbox.component';
import {CallingComponent} from "./admin/calling/calling.component";
import {EmailSettingsComponent} from "./admin/email-settings/email-settings.component";
import { CustomerInvoiceComponent } from './customer-invoice/customer-invoice.component';
import {NewSegmentComponent} from "./marketing/new-segment/new-segment.component";
import {PageBuilderComponent} from "./page-builder/page-builder.component";
import {EditPromotoinalEmailComponent} from "./marketing/edit-promotoinal-email/edit-promotoinal-email.component";
import {EditSmsSequenceComponent} from "./campaigns/edit-sms-sequence/edit-sms-sequence.component";
import {EditEmailSequenceComponent} from "./campaigns/edit-email-sequence/edit-email-sequence.component";
import { CreateLandingPageComponent } from './create-landing-page/create-landing-page.component';
import { CrossAccountCopierComponent } from './admin/cross-account-copier/cross-account-copier.component';
import { AdminSubscriptionsComponent } from "./super-admin/admin-subscriptions/admin-subscriptions.component";
import { AdminEditAddonsComponent } from "./super-admin/admin-edit-addons/admin-edit-addons.component";
import { AdminEditSubscriptionsComponent } from "./super-admin/admin-edit-subscriptions/admin-edit-subscriptions.component";
import { AdminAddonsComponent } from "./super-admin/admin-addons/admin-addons.component";
import { AdminSettingsComponent } from "./super-admin/admin-settings/admin-settings.component";
import { ClientManagementComponent } from './super-admin/client-management/client-management.component';
import { SegmentsComponent } from './segments/segments.component';

const routes: Routes = [
    // {path: 'login', component: LoginRegisterComponent},
    {path: 'public/invoice/:id/:token', component: CustomerInvoiceComponent},
    {path: 'invitation/accept', component: LoginRegisterComponent},
    {path: 'auth', loadChildren: () => import('./modules/auth/auth.module').then(mod => mod.AuthModule)},
    {path: 'public', loadChildren: () => import('./modules/public/public.module').then(mod => mod.PublicModule)},
    {path: 'login', redirectTo: 'auth/login'},

    {path: '', component: HomeComponent, canActivate: [AuthGuard]},
    {path: 'boards/:id', component: BoardsComponent, canActivate: [AuthGuard]},
    {path: 'boards/:id/filter/:filterView', component: BoardsComponent, canActivate: [AuthGuard]},
    {path: 'boards/:id/:tab', component: BoardsComponent, canActivate: [AuthGuard]},
    {path: 'boards/:id/:tab/:rowId', component: BoardsComponent, canActivate: [AuthGuard]},
    {path: 'boards/:id/:tab/:rowId/:trayTab', component: BoardsComponent, canActivate: [AuthGuard]},
    {path: 'products', component: ProductsComponent, canActivate: [AuthGuard]},
    {path: 'services', component: ServicesComponent, canActivate: [AuthGuard]},
    {path: 'edit-product', component: EditProductComponent, canActivate: [AuthGuard]},
    {path: 'edit-service', component: EditServiceComponent, canActivate: [AuthGuard]},
    {path: 'financials-dashboard', component: FinancialsDashboardComponent, canActivate: [AuthGuard]},
    {path: 'dashboards/:id', component: DashboardsComponent, canActivate: [AuthGuard]},
    {path: 'media-files', component: MediaFilesComponent, canActivate: [AuthGuard]},

    // Sales portal pages
    {path: 'sales-dashboard', component: SalesPortalDashboardComponent, canActivate: [AuthGuard]},
    {path: 'sales-broker-dashboard', component: SalesBrokerDashboardComponent, canActivate: [AuthGuard]},
    {path: 'sales-portal', component: SalesPortalComponent, canActivate: [AuthGuard]},
    {path: 'replicate-site', component: ReplicateSiteComponent, canActivate: [AuthGuard]},
    {path: 'group-enrollment', component: GroupEnrollmentComponent, canActivate: [AuthGuard]},
    {path: 'prospect-management', component: ProspectManagementComponent, canActivate: [AuthGuard]},
    {path: 'marketing-resources', component: MarketingResourcesComponent, canActivate: [AuthGuard]},
    {path: 'get-started', component: GetStartedComponent, canActivate: [AuthGuard]},
    {path: 'uploads', component: UploadsComponent, canActivate: [AuthGuard]},
    {path: 'revenue/:id/pay', component: CreateRevenueComponent, canActivate: [AuthGuard]},

    // Financials pages
    {path: 'connected-accounts', component: ConnectedAccountsComponent, canActivate: [AuthGuard]},
    {path: 'financial-reports', component: FinancialReportsComponent, canActivate: [AuthGuard]},
    {path: 'opening-balances', component: OpeningBalancesComponent, canActivate: [AuthGuard]},

    // Marketing pages
    {path: 'email-marketing-dashboard', component: EmailMarketingDashboardComponent, canActivate: [AuthGuard]},
    {path: 'edit-sequence', component: EditSequenceComponent, canActivate: [AuthGuard]},
    {path: 'campaigns/dialer', component: DialerComponent, canActivate: [AuthGuard]},
    {path: 'campaigns/email', component: EmailComponent, canActivate: [AuthGuard]},
    {path: 'campaigns/sms', component: SmsComponent, canActivate: [AuthGuard]},
    {path: 'campaigns/social', component: SocialComponent, canActivate: [AuthGuard]},
    {path: 'campaigns/advanced', component: AdvancedComponent, canActivate: [AuthGuard]},
    {path: 'forms/edit-form', component: EditFormComponent, canActivate: [AuthGuard]},
    {path: 'marketing/edit-landing-page', component: EditLandingPageComponent, canActivate: [AuthGuard]},
    {path: 'marketing/new-segment', component: NewSegmentComponent, canActivate: [AuthGuard]},
    {path: 'campaigns/edit-email-sequence', component: EditEmailSequenceComponent, canActivate: [AuthGuard]},
    {path: 'campaigns/edit-sms-sequence', component: EditSmsSequenceComponent, canActivate: [AuthGuard]},
    {path: 'marketing/edit-promotional-email', component: EditPromotoinalEmailComponent, canActivate: [AuthGuard]},
    {path: 'page-builder', component: PageBuilderComponent, canActivate: [AuthGuard]},

    // common pages
    {path: 'my-profile', component: MyProfileComponent, canActivate: [AuthGuard]},
    {path: 'archive', component: ArchiveComponent, canActivate: [AuthGuard]},
    {path: 'recyclebin', component: RecyclebinComponent, canActivate: [AuthGuard]},

    // Admin pages
    {path: 'admin/general/:tab', component: GeneralComponent, canActivate: [AuthGuard]},
    {path: 'admin/customization/:tab', component: CustomizationComponent, canActivate: [AuthGuard]},
    {path: 'admin/calling/:tab', component: CallingComponent, canActivate: [AuthGuard]},
    {path: 'admin/email/:tab', component: EmailSettingsComponent, canActivate: [AuthGuard]},
    {path: 'admin/users/:tab', component: UsersComponent, canActivate: [AuthGuard]},
    {path: 'admin/security/:tab', component: SecurityComponent, canActivate: [AuthGuard]},
    {path: 'admin/api', component: ApiComponent, canActivate: [AuthGuard]},
    {path: 'admin/billing/:tab', component: BillingComponent, canActivate: [AuthGuard]},
    {path: 'admin/usage-stats/:tab', component: UsageStatsComponent, canActivate: [AuthGuard]},
    {path: 'admin/apps/:tab', component: AppsComponent, canActivate: [AuthGuard]},
    {path: 'admin/permissions', component: PermissionsComponent, canActivate: [AuthGuard]},
    {path: 'admin/cross-account-copier', component: CrossAccountCopierComponent, canActivate: [AuthGuard]},
    {path: 'admin/teams', component: TeamsComponent, canActivate: [AuthGuard]},
    {path: 'subscription', component: SubscriptionComponent, canActivate: [AuthGuard]},
    {path: 'my-inbox', component: MyInboxComponent, canActivate: [AuthGuard]},

    // Vendor Portal
    {path: 'vendor-portal', redirectTo: 'vendor-portal/home'},
    {path: 'vendor-portal/home', component: VendorHomeComponent, canActivate: [AuthGuard]},
    {path: 'vendor-portal/purchase-orders', component: PurchaseOrdersComponent, canActivate: [AuthGuard]},
    {path: 'vendor-portal/invoices', component: InvoicesComponent, canActivate: [AuthGuard]},
    {path: 'vendor-portal/payment-received', component: PaymentReceivedComponent, canActivate: [AuthGuard]},
    {path: 'vendor-portal/statements', component: StatementsComponent, canActivate: [AuthGuard]},

    // Customer Portal
    {path: 'customer-portal', redirectTo: 'customer-portal/home'},
    {path: 'customer-portal/home', component: CustomerHomeComponent, canActivate: [AuthGuard]},
    {path: 'customer-portal/estimates', component: EstimatesComponent, canActivate: [AuthGuard]},
    {path: 'customer-portal/invoices', component: CustomerInvoicesComponent, canActivate: [AuthGuard]},
    {path: 'customer-portal/payments-made', component: PaymentMadeComponent, canActivate: [AuthGuard]},
    {path: 'customer-portal/projects', component: ProjectsComponent, canActivate: [AuthGuard]},
    {path: 'customer-portal/project', component: SingleProjectComponent, canActivate: [AuthGuard]},
    {path: 'customer-portal/statements', component: CustomerStatementsComponent, canActivate: [AuthGuard]},
    {path: 'customer-portal/single-invoice', component: SingleInvoiceComponent, canActivate: [AuthGuard]},

    // Teams pages
    {path: 'add-agent', component: AddAgentComponent, canActivate: [AuthGuard]},
    {path: 'onboarding', component: OnboardingComponent, canActivate: [AuthGuard]},
    {path: 'create-langing-page', component: CreateLandingPageComponent, canActivate: [AuthGuard]},

    // Super admin
    {path: 'super-admin', redirectTo: 'super-admin/subscriptions'},
    {path: 'super-admin/subscriptions', component: AdminSubscriptionsComponent, canActivate: [AuthGuard]},
    {path: 'super-admin/edit-addon', component: AdminEditAddonsComponent, canActivate: [AuthGuard]},
    {path: 'super-admin/edit-subscription', component: AdminEditSubscriptionsComponent, canActivate: [AuthGuard]},
    {path: 'super-admin/addons', component: AdminAddonsComponent, canActivate: [AuthGuard]},
    {path: 'super-admin/settings', component: AdminSettingsComponent, canActivate: [AuthGuard]},
    {path: 'super-admin/client-management', component: ClientManagementComponent, canActivate: [AuthGuard]},
    {path: 'segments', component: SegmentsComponent, canActivate: [AuthGuard]},

    // 404 redirect to home
    {path: '**', redirectTo: ''},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
