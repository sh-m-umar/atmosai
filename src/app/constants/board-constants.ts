export const tabsTypes: any = [
    {name: 'Chart', boardType: ['lead', 'opportunity', 'contact', 'account', 'activity'], type: 'chart', icon: 'fa fa-chart-waterfall'},
    {name: 'Kanban', boardType: ['lead', 'opportunity', 'contact', 'account', 'activity'], type: 'kanban', icon: 'fa fa-square-kanban'},
    {name: 'Gantt', boardType: ['lead', 'opportunity', 'contact', 'account', 'activity'], type: 'gantt', icon: 'fa fa-chart-gantt'},
    {name: 'Calendar', boardType: ['activity'], type: 'calendar', icon: 'fa fa-calendar'},
    {name: 'Scheduler', boardType: ['lead', 'opportunity', 'contact', 'account', 'activity'], type: 'scheduler', icon: 'fa fa-calendar-lines-pen'},
    {name: 'Cards', boardType: ['lead', 'opportunity', 'contact', 'account', 'activity'], type: 'cards', icon: 'fa fa-cards'},
    {name: 'Files', boardType: ['lead', 'opportunity', 'contact', 'account', 'activity'], type: 'files', icon: 'fa fa-files'},
    {name: 'Dashboard', boardType: ['lead', 'opportunity', 'contact', 'account', 'activity'], type: 'dashboard', icon: 'fa fa-gauge'},
    {name: 'Recurring', boardType: ['invoice', 'estimate'], type: 'recurring-invoice', icon: 'fa fa-recycle'},
    {name: 'Drafted', boardType: ['invoice', 'estimate'], type: 'drafted-invoice', icon: 'fa fa-files'},
    {name: 'Approved', boardType: ['invoice', 'estimate'], type: 'approved-invoices', icon: 'fa fa-file-check'},
    {name: 'Sent', boardType: ['invoice', 'estimate'], type: 'sent-invoices', icon: 'fa fa-inbox-out'},
    {name: 'Overdue', boardType: ['invoice', 'estimate'], type: 'overdue-invoices', icon: 'fa fa-diamond-exclamation'},
    {name: 'Paid', boardType: ['invoice', 'estimate'], type: 'paid-invoices', icon: 'fa fa-file-invoice-dollar'},
    {name: 'Assets', boardType: ['chart-of-account'], type: 'assets', icon: 'fa fa-building'},
    {name: 'Liabilities & Credit Cards', boardType: ['chart-of-account'], type: 'liabilities', icon: 'fa fa-jug'},
    {name: 'Income', boardType: ['chart-of-account'], type: 'income', icon: 'fa fa-sack-dollar'},
    {name: 'Expenses', boardType: ['chart-of-account'], type: 'expenses', icon: 'fa fa-badge-dollar'},
    {name: 'Equity', boardType: ['chart-of-account'], type: 'equity', icon: 'fa fa-chart-pie'},
];

export const colTypes:any = [
    // Essentials
    {name: 'Text', type: 'text', description: '', icon: 'fa-list-ol', cat: 'essential'},
    {name: 'Email', type: 'email', description: '', icon: 'fa-envelope', cat: 'essential'},
    {name: 'Numbers', type: 'numbers', description: '', icon: 'fa-list-ol', cat: 'essential'},
    {name: 'Status', type: 'status', description: '', icon: 'fa-bars', cat: 'essential'},
    {name: 'Files', type: 'file', description: '', icon: 'fa-file', cat: 'essential'},

    // Super Useful
    {name: 'Connect boards', type: 'connect-board', description: '', icon: 'fa-circle-user', cat: 'super'},
    {name: 'Dropdown', type: 'dropdown', description: '', icon: 'fa-circle-user', cat: 'super'},
    {name: 'Phone', type: 'phone', description: '', icon: 'fa-circle-user', cat: 'super'},
    {name: 'Last updated', description: '', type: 'last-updated', icon: 'fa-circle-user', cat: 'super'},
    {name: 'People', type: 'people', description: '', icon: 'fa-circle-user', cat: 'super'},
    {name: 'Priority', type: 'status', description: '', icon: 'fa-circle-user', cat: 'super'},
    {name: 'Date', type: 'date', description: '', icon: 'fa-calendar', cat: 'super'},
    {name: 'Label', type: 'status', description: '', icon: 'fa-calendar', cat: 'super'},
];

export const allColTypes:any = [
    // Essentials
    {name: 'Status', type: 'status', description: '', icon: 'fa-bars', cat: 'essential'},
    {name: 'Priority', type: 'status', description: '', icon: 'fa-circle-user', cat: 'essential'},
    {name: 'Labels', type: 'status', description: '', icon: 'fa-calendar', cat: 'essential'},
    {name: 'People', type: 'people', description: '', icon: 'fa-circle-user', cat: 'essential'},
    {name: 'Numbers', type: 'numbers', description: '', icon: 'fa-list-ol', cat: 'essential'},
    {name: 'Timeline', type: 'date-range', description: '', icon: 'fa-bars-staggered', cat: 'essential'},
    {name: 'Date', type: 'date', description: '', icon: 'fa-calendar', cat: 'essential'},
    {name: 'Text', type: 'text', description: '', icon: 'fa-list-ol', cat: 'essential'},
    {name: 'Long Text', type: 'long-text', description: '', icon: 'fa-list-ol', cat: 'essential'},
    {name: 'Connect boards', type: 'connect-boards', description: '', icon: 'fa-circle-user', cat: 'essential'},
    {name: 'Mirror', type: 'mirror', description: '', icon: 'fa-arrow-turn-down', cat: 'essential'},

    // Super Useful
    {name: 'Checkbox', type: 'checkbox', description: '', icon: 'fa-circle-user', cat: 'super'},
    {name: 'Link', type: 'link', description: '', icon: 'fa-link', cat: 'super'},
    {name: 'World Clock', type: 'world-clock', description: '', icon: 'fa-circle-user', cat: 'super'},
    {name: 'Item ID', type: 'item-id', description: '', icon: 'fa-circle-user', cat: 'super'},
    {name: 'Phone', type: 'phone', description: '', icon: 'fa-circle-user', cat: 'super'},
    {name: 'Location', type: 'location', description: '', icon: 'fa-circle-user', cat: 'super'},
    {name: 'Files', type: 'files', description: '', icon: 'fa-bars-staggered', cat: 'featured'},

    // Team power-up
    {name: 'Tags', type: 'tags', description: '', icon: 'fa-bars-staggered', cat: 'team-power-up'},
    {name: 'Vote', type: 'vote', description: '', icon: 'fa-bars-staggered', cat: 'team-power-up'},
    {name: 'Rating', type: 'rating', description: '', icon: 'fa-bars-staggered', cat: 'team-power-up'},
    {name: 'Creation Log', type: 'creation-log', description: '', icon: 'fa-bars-staggered', cat: 'team-power-up'},
    {name: 'Last updated', type: 'last-updated', description: '', icon: 'fa-bars-staggered', cat: 'team-power-up'},
    {name: 'Auto number', type: 'auto-number', description: '', icon: 'fa-bars-staggered', cat: 'team-power-up'},
    {name: 'Progress tracking', type: 'progress-tracking', description: '', icon: 'fa-bars-staggered', cat: 'team-power-up'},

    // Board power-up
    {name: 'Button', type: 'button', description: '', icon: 'fa-envelope', cat: 'board-power-up'},
    {name: 'Dependency', type: 'dependency', description: '', icon: 'fa-envelope', cat: 'board-power-up'},
    {name: 'Dropdown', type: 'dropdown', description: '', icon: 'fa-circle-user', cat: 'board-power-up'},
    {name: 'Week', type: 'week', description: '', icon: 'fa-envelope', cat: 'board-power-up'},
    {name: 'Formula', type: 'formula', description: '', icon: 'fa-envelope', cat: 'board-power-up'},
    {name: 'Country', type: 'country', description: '', icon: 'fa-envelope', cat: 'board-power-up'},
    {name: 'Color picker', type: 'color-picker', description: '', icon: 'fa-envelope', cat: 'board-power-up'},
    {name: 'Time tracking', type: 'time-tracking', description: '', icon: 'fa-envelope', cat: 'board-power-up'},
    {name: 'Hour', type: 'hour', description: '', icon: 'fa-envelope', cat: 'board-power-up'},
    {name: 'Email', type: 'email', description: '', icon: 'fa-envelope', cat: 'board-power-up'},

    // Combose
    {name: 'Date + Status', type: 'date_status', description: '', icon: 'fa-envelope', cat: 'combose'},
    {name: 'Timeline + Status', type: 'timeline_status', description: '', icon: 'fa-envelope', cat: 'combose'},
    {name: 'Timeline + Numeric', type: 'timeline_numeric', description: '', icon: 'fa-envelope', cat: 'combose'},
];

export const statuses:any = [
    {name: 'Contacted', color: 0},
    {name: 'Follow up', color: 1},
    {name: 'Unqualified', color: 2},
    {name: 'Attempted to contact', color: 3},
    {name: 'Qualified', color: 4},
    {name: 'New lead', color: 13},
    {name: 'Cancelled', color: 12},
];

export const colorPallets = [
    'red',
    'rgb(3, 129, 138)',
    'rgb(38, 0, 255)',
    'rgb(0, 255, 76)',
    'rgb(0, 195, 255)',
    'rgb(255, 0, 157)',
    'rgb(158, 18, 128)',
    'rgb(102, 102, 102)',
    'rgb(0, 0, 0)',
    'rgb(247, 25, 235)',
    'rgb(0, 179, 110)',
    'rgb(188, 204, 166)',
    'rgba(58, 70, 233, 0.24)',
    'rgb(51, 11, 11)',
    'rgb(255, 196, 196)',
];

export const defaultCols:any = [
    {
        field: 'action',
        headerName: '',
        width: 20,
        minWidth: 38,
        resizable: false,
        pinned: 'left',
        lockPosition: 'left',
        editable: false,
        suppressMovable: true,
        suppressNavigable: true,
        cellRendererParams: {
            typeCol: 'action',
            sub: false,
            settings: []
        }
    },
    {
        field: 'checkbox',
        headerName: '',
        // dndSource: true,  // TODO: add drag and drop support
        width: 20,
        resizable: false,
        minWidth: 38,
        pinned: 'left',
        lockPosition: 'left',
        headerCheckboxSelection: true,
        checkboxSelection: true,
        showDisabledCheckboxes: true,
        suppressMovable: true,
        suppressNavigable: true,
        cellRendererParams: {
            typeCol: 'checkbox',
            settings: []
        }
    },
];

export const defaultSubCols:any = [
    {
        field: 'action',
        headerName: '',
        width: 20,
        resizable: false,
        minWidth: 38,
        pinned: 'left',
        lockPosition: 'left',
        suppressMovable: true,
        suppressNavigable: true,
        cellRendererParams: {
            typeCol: 'action',
            sub: true,
            settings: []
        },
    },
    {
        field: 'empty',
        headerName: '',
        width: 20,
        minWidth: 38,
        resizable: false,
        pinned: 'left',
        lockPosition: 'left',
        suppressMovable: true,
        suppressNavigable: true,
        cellRendererParams: {
            typeCol: 'empty',
            settings: []
        },
    },
    {
        field: 'checkbox',
        headerName: '',
        width: 20,
        minWidth: 38,
        pinned: 'left',
        resizable: false,
        lockPosition: 'left',
        suppressNavigable: true,
        suppressMovable: true,
        headerCheckboxSelection: true,
        checkboxSelection: true,
        showDisabledCheckboxes: true,
        cellRendererParams: {
            typeCol: 'checkbox',
            settings: []
        }
    }
];

export const lastColumnAdd: any = {
    field: 'new',
    headerName: 'New',
    resizable: false,
    sortable: false,
    filter: false,
    lockPosition: 'right',
    lockPinned: true,
    width: 200,
    suppressMovable: true,
    suppressNavigable: true,
    cellRendererParams: {
        typeCol: 'new',
        id: 0,
        collapsed: 0,
        description: '',
        settings: []
    }
};

export const hideMenuIcons: any = {
    "action": "fa-exclamation",
    "checkbox": "fa-square-check",
    "item": "fa-circle-info",
    "people": "fa-circle-user",
    "status": "fa-layer-group",
    "text": "fa-text-size",
    "phone": "fa-mobile",
    "email": "fa-envelope",
    "createContact": "fa-address-book",
    "creation-log": "fa-circle-info",
    "latest-comm": "fa-tty",
    "latest-comm-user": "fa-circle-user",
    "latest-comm-date": "fa-calendar",
    "first-comm": "fa-tty",
    "first-comm-date": "fa-calendar",
    "connect-boards": "fa-game-board",
    "date": "fa-calendar",
    "link": "fa-link",
    "mirror": "fa-arrow-turn-down",
    "files": "fa-file",
    "location": "fa-location-dot",
    "time-tracking": "fa-solid fa-timer",
    "country": "fa-flag",
    "new": "fa-plus",
};

export const bulkEmailActionObj = {
    email_from: '',
    email_template: '',
    enroll_for: '',
    templateType: 'text',
    wait: false,
    errorMsg: '',
    successMessage: '',
};

export const permissions: any = {
    viewing_permission: 'all',
    editing_permission: {option:'everything', assigned_people:[]},
};

export const boardTypeModel:any = {
    current: 'main',
    changeTo: 'shareable',
    boardId: 0,
};

export const kanBanOptions = [
    {name: 'Minimal', value: 'minimal'},
    {name: 'All actual values', value: 'actual'},
    {name: 'All expected values', value: 'expected'},
];

export const newCol: any = {
    field: 'newcol',
    headerName: 'New Column',
    width: 150,
    cellRendererParams: {
        typeCol: 'text',
        id: 0,
        collapsed: 0,
        description: ''
    }
};

export const mergeColumnKey: any = {
    skip: {name: '', key: ''},
    overwrite: {name: '', key: ''},
};
