import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from "@angular/common/http";
import {HttpService} from "./http.service";
import {EditorModule} from '@tinymce/tinymce-angular';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BoardsComponent} from './boards/boards.component';
import {AgGridModule} from 'ag-grid-angular';
import 'ag-grid-enterprise';
import {LicenseManager} from 'ag-grid-enterprise';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {LeadsCommonRendererComponent} from './leads-common-renderer/leads-common-renderer.component';
import {RightSidebarTrayComponent} from './right-sidebar-tray/right-sidebar-tray.component';
import {LeadsHeaderRendererComponent} from './leads-header-renderer/leads-header-renderer.component';
import {PopupCellRendererComponent} from './popup-cell-renderer/popup-cell-renderer.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import 'hammerjs';
import {NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule} from '@angular-material-components/datetime-picker';
import {PopupsComponent} from './popups/popups.component';
import {HomeComponent} from './home/home.component';
import {ResizableModule} from 'angular-resizable-element';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {LocalService} from "./local.service";
import {CacheService} from "./cache.service";
import {ProductsComponent} from './products/products.component';
import {ServicesComponent} from './services/services.component';
import {EditProductComponent} from './edit-product/edit-product.component';
import {EditServiceComponent} from './edit-service/edit-service.component';
import {ModuleItemsService} from "./module-items.service";
import {FinancialsDashboardComponent} from './financials-dashboard/financials-dashboard.component';
import {MatStepperModule} from '@angular/material/stepper';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import {NgxEchartsModule} from 'ngx-echarts';
import {DashboardsComponent} from './dashboards/dashboards.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSliderModule} from '@angular/material/slider';
import {IgxDatePickerModule} from "igniteui-angular";
import {IgxDateRangePickerModule, IgxInputGroupModule} from "igniteui-angular";
import {GooglePlacesComponent} from './google-places/google-places.component';
import {MomentModule} from 'ngx-moment';
import {FormInvoiceComponent} from './form-invoice/form-invoice.component';
import {SalesPortalDashboardComponent} from './sales-portal-dashboard/sales-portal-dashboard.component';
import {SalesPortalComponent} from './sales-portal/sales-portal.component';
import {ReplicateSiteComponent} from './replicate-site/replicate-site.component';
import {GroupEnrollmentComponent} from './group-enrollment/group-enrollment.component';
import {ProspectManagementComponent} from './prospect-management/prospect-management.component';
import {MarketingResourcesComponent} from './marketing-resources/marketing-resources.component';
import {SalesBrokerDashboardComponent} from './sales-broker-dashboard/sales-broker-dashboard.component';
import {UploadsComponent} from './uploads/uploads.component';
import {MatIconModule} from '@angular/material/icon';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {AuthGuard} from './auth.guard';
import {MyProfileComponent} from './my-profile/my-profile.component';
import {AgendaService, DayService, MonthService, ScheduleModule, WeekService, WorkWeekService} from '@syncfusion/ej2-angular-schedule';
import {GanttModule} from '@syncfusion/ej2-angular-gantt';
import {DashboardLayoutModule} from '@syncfusion/ej2-angular-layouts';
import {MatSelectModule} from '@angular/material/select';
import {TagInputModule} from 'ngx-chips';
import {EmailMarketingDashboardComponent} from './email-marketing-dashboard/email-marketing-dashboard.component';
import {EditSequenceComponent} from './edit-sequence/edit-sequence.component';
import {ConnectedAccountsComponent} from './connected-accounts/connected-accounts.component';
import {CreateRevenueComponent} from './create-revenue/create-revenue.component';
import {GeneralComponent} from './admin/general/general.component';
import {CustomizationComponent} from './admin/customization/customization.component';
import {UsersComponent} from './admin/users/users.component';
import {SecurityComponent} from './admin/security/security.component';
import {ApiComponent} from './admin/api/api.component';
import {BillingComponent} from './admin/billing/billing.component';
import {UsageStatsComponent} from './admin/usage-stats/usage-stats.component';
import {AppsComponent} from './admin/apps/apps.component';
import {PermissionsComponent} from './admin/permissions/permissions.component';
import {FinancialReportsComponent} from './financial-reports/financial-reports.component';
import {OpeningBalancesComponent} from './financials/opening-balances/opening-balances.component';
import {KanbanComponent} from './kanban/kanban.component';
import {SubscriptionComponent} from './admin/subscription/subscription.component';
import {DialerComponent} from './campaigns/dialer/dialer.component';
import {EmailComponent} from './campaigns/email/email.component';
import {SmsComponent} from './campaigns/sms/sms.component';
import {SocialComponent} from './campaigns/social/social.component';
import {AdvancedComponent} from './campaigns/advanced/advanced.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {ArchiveComponent} from './archive/archive.component';
import {RecyclebinComponent} from './recyclebin/recyclebin.component';
import {TeamsComponent} from './admin/teams/teams.component';
import {EstimatesComponent} from './customer-portal/estimates/estimates.component';
import {PaymentMadeComponent} from './customer-portal/payment-made/payment-made.component';
import {ProjectsComponent} from './customer-portal/projects/projects.component';
import {PurhcaseOrdersComponent} from './vendor-portal/purhcase-orders/purhcase-orders.component';
import {PaymentReceivedComponent} from './vendor-portal/payment-received/payment-received.component';
import {VendorHomeComponent} from './vendor-portal/vendor-home/vendor-home.component';
import {CustomerHomeComponent} from './customer-portal/customer-home/customer-home.component';
import {PurchaseOrdersComponent} from './vendor-portal/purchase-orders/purchase-orders.component';
import {CustomerStatementsComponent} from './customer-portal/customer-statements/customer-statements.component';
import {CustomerInvoicesComponent} from './customer-portal/customer-invoices/customer-invoices.component';
import {AngularSplitModule} from 'angular-split';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {SchedulerComponent} from './tabs/scheduler/scheduler.component';
import {SingleProjectComponent} from './customer-portal/single-project/single-project.component';
import {SingleInvoiceComponent} from './customer-portal/single-invoice/single-invoice.component';
import {MediaFilesComponent} from './media-files/media-files.component';
import {EditFormComponent} from './forms/edit-form/edit-form.component';
import {EditLandingPageComponent} from './marketing/edit-landing-page/edit-landing-page.component';
import {AddAgentComponent} from './add-agent/add-agent.component';
import {OnboardingComponent} from './onboarding/onboarding.component';
import {CalendarComponent} from './calendar/calendar.component';
import {DashboardTrayComponent} from './trays/dashboard-tray/dashboard-tray.component';
import {PanelTemplateComponent} from './dashboard/panel-template/panel-template.component';
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { CalendarCommonComponent } from './calendar-common/calendar-common.component';
import { ChartModule } from '@syncfusion/ej2-angular-charts';
import { DateFormatOptions } from '@syncfusion/ej2-base'
import { CategoryService, DateTimeService, ScrollBarService, ColumnSeriesService, LineSeriesService,
    ChartAnnotationService, RangeColumnSeriesService, StackingColumnSeriesService,LegendService, TooltipService,
    StepLineSeriesService, SplineSeriesService, StackingLineSeriesService, SplineAreaSeriesService, MultiColoredLineSeriesService, ParetoSeriesService
 } from '@syncfusion/ej2-angular-charts';

import {GetStartedComponent} from "./get-started/get-started.component";
import { MyInboxComponent } from './my-inbox/my-inbox.component';
import { MapsComponent } from './dashboards/maps/maps.component';
import { MapsModule } from '@syncfusion/ej2-angular-maps';
import { CallingComponent } from './admin/calling/calling.component';
import { EmailSettingsComponent } from './admin/email-settings/email-settings.component';
import { NewSegmentComponent } from './marketing/new-segment/new-segment.component';
import { NgxPayPalModule } from 'ngx-paypal';
import { LeftNotificationTrayComponent } from './left-notification-tray/left-notification-tray.component';
import { PageBuilderComponent } from './page-builder/page-builder.component';
import { EditEmailSequenceComponent } from './campaigns/edit-email-sequence/edit-email-sequence.component';
import { EditSmsSequenceComponent } from './campaigns/edit-sms-sequence/edit-sms-sequence.component';
import { EditPromotoinalEmailComponent } from './marketing/edit-promotoinal-email/edit-promotoinal-email.component';
import { CreateLandingPageComponent } from './create-landing-page/create-landing-page.component';
import { TimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { GalleryModalComponent } from './modals/gallery-modal/gallery-modal.component';
import { CrossAccountCopierComponent } from './admin/cross-account-copier/cross-account-copier.component';
import { ManageDuplicateModalComponent } from './modals/manage-duplicate-modal/manage-duplicate-modal.component';
import { ItemValueModalComponent } from './modals/item-value-modal/item-value-modal.component';
import { ItemTerminologyComponent } from './modals/item-terminology/item-terminology.component';
import { MoveLeadToNewBoardComponent } from './modals/move-lead-to-new-board/move-lead-to-new-board.component';
import { InviteMembersModalComponent } from './modals/invite-members-modal/invite-members-modal.component';
import { DuplicateBoardModalComponent } from './modals/duplicate-board-modal/duplicate-board-modal.component';
import { AdminSubscriptionsComponent } from './super-admin/admin-subscriptions/admin-subscriptions.component';
import { AdminEditSubscriptionsComponent } from './super-admin/admin-edit-subscriptions/admin-edit-subscriptions.component';
import { AdminEditAddonsComponent } from './super-admin/admin-edit-addons/admin-edit-addons.component';
import { AdminAddonsComponent } from './super-admin/admin-addons/admin-addons.component';
import { AdminSettingsComponent } from './super-admin/admin-settings/admin-settings.component';
import { MainAndSearchableBoardsComponent } from './modals/main-and-searchable-boards/main-and-searchable-boards.component';
import { DownloadProgressComponent } from './modals/download-progress/download-progress.component';
import { SegmentsComponent } from './segments/segments.component';
import { SetDeadlineComponent } from './modals/set-deadline/set-deadline.component';
import { ClientManagementComponent } from './super-admin/client-management/client-management.component';

const materialModules = [
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatIconModule,
    MatCheckboxModule,
    MatSelectModule,
    ClipboardModule,
    MatDividerModule,
    MatListModule,
    MatSnackBarModule,
];

LicenseManager.setLicenseKey("CompanyName=AtmosAI, LLC,LicensedApplication=AtmosAI,LicenseType=SingleApplication,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=1,AssetReference=AG-037659,SupportServicesEnd=30_January_2024_[v2]_MTcwNjU3MjgwMDAwMA==a8d4c11182ad8be05d50482901af77e5");

@NgModule({
    declarations: [
        AppComponent,
        BoardsComponent,
        LeadsCommonRendererComponent,
        RightSidebarTrayComponent,
        DashboardComponent,
        LeadsHeaderRendererComponent,
        PopupCellRendererComponent,
        PopupsComponent,
        HomeComponent,
        ProductsComponent,
        ServicesComponent,
        EditProductComponent,
        EditServiceComponent,
        FinancialsDashboardComponent,
        DashboardsComponent,
        GooglePlacesComponent,
        FormInvoiceComponent,
        SalesPortalDashboardComponent,
        SalesPortalComponent,
        ReplicateSiteComponent,
        GroupEnrollmentComponent,
        ProspectManagementComponent,
        MarketingResourcesComponent,
        GetStartedComponent,
        SalesBrokerDashboardComponent,
        UploadsComponent,
        MyProfileComponent,
        EmailMarketingDashboardComponent,
        EditSequenceComponent,
        ConnectedAccountsComponent,
        CreateRevenueComponent,
        GeneralComponent,
        CustomizationComponent,
        UsersComponent,
        SecurityComponent,
        ApiComponent,
        BillingComponent,
        UsageStatsComponent,
        AppsComponent,
        PermissionsComponent,
        FinancialReportsComponent,
        OpeningBalancesComponent,
        KanbanComponent,
        SubscriptionComponent,
        DialerComponent,
        EmailComponent,
        SmsComponent,
        SocialComponent,
        AdvancedComponent,
        ArchiveComponent,
        RecyclebinComponent,
        TeamsComponent,
        EstimatesComponent,
        PaymentMadeComponent,
        ProjectsComponent,
        PurhcaseOrdersComponent,
        PaymentReceivedComponent,
        VendorHomeComponent,
        CustomerHomeComponent,
        PurchaseOrdersComponent,
        CustomerStatementsComponent,
        CustomerInvoicesComponent,
        SchedulerComponent,
        SingleProjectComponent,
        SingleInvoiceComponent,
        MediaFilesComponent,
        EditFormComponent,
        EditLandingPageComponent,
        AddAgentComponent,
        OnboardingComponent,
        CalendarComponent,
        DashboardTrayComponent,
        PanelTemplateComponent,
        CalendarCommonComponent,
        MyInboxComponent,
        MapsComponent,
        CallingComponent,
        EmailSettingsComponent,
        NewSegmentComponent,
        LeftNotificationTrayComponent,
        PageBuilderComponent,
        EditEmailSequenceComponent,
        EditSmsSequenceComponent,
        EditPromotoinalEmailComponent,
        CreateLandingPageComponent,
        GalleryModalComponent,
        CrossAccountCopierComponent,
        MoveLeadToNewBoardComponent,
        ManageDuplicateModalComponent,
        ItemValueModalComponent,
        ItemTerminologyComponent,
        InviteMembersModalComponent,
        DuplicateBoardModalComponent,
        AdminSubscriptionsComponent,
        AdminEditSubscriptionsComponent,
        AdminEditAddonsComponent,
        AdminAddonsComponent,
        AdminSettingsComponent,
        MainAndSearchableBoardsComponent,
        DownloadProgressComponent,
        SegmentsComponent,
        SetDeadlineComponent,
        ClientManagementComponent
    ],
    imports: [
        BrowserModule,
        EditorModule,
        HttpClientModule,
        AppRoutingModule,
        AgGridModule,
        DashboardLayoutModule,
        FormsModule,
        ReactiveFormsModule,
        DragDropModule,
        MatDatepickerModule,
        BrowserAnimationsModule,
        materialModules,
        NgxMatDatetimePickerModule,
        NgxMatNativeDateModule,
        NgxMatTimepickerModule,
        ResizableModule,
        MatTooltipModule,
        MatAutocompleteModule,
        MatStepperModule,
        CKEditorModule,
        IgxDateRangePickerModule,
        IgxInputGroupModule,
        MomentModule,
        NgxEchartsModule.forRoot({
            echarts: () => import('echarts'),
        }),
        IgxDatePickerModule,
        ScheduleModule,
        GanttModule,
        TagInputModule,
        AngularSplitModule,
        ToolbarModule,
        ChartModule,
        MapsModule,
        NgxPayPalModule,
        TimePickerModule,
    ],

    providers: [
        RightSidebarTrayComponent,
        LeadsCommonRendererComponent,
        GooglePlacesComponent,
        PopupsComponent,
        HttpService,
        LocalService,
        CacheService,
        ModuleItemsService,
        FormInvoiceComponent,
        DayService,
        WeekService,
        WorkWeekService,
        MonthService,
        AgendaService,
        CategoryService,
        DateTimeService,
        ScrollBarService,
        LineSeriesService,
        ColumnSeriesService,
        ChartAnnotationService,
        RangeColumnSeriesService,
        StackingColumnSeriesService,
        LegendService,
        TooltipService,
        StepLineSeriesService,
        SplineSeriesService,
        StackingLineSeriesService,
        SplineAreaSeriesService,
        MultiColoredLineSeriesService,
        ParetoSeriesService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
