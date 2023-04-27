export let adminMenus = [
    {title: 'General', link: '/admin/general/profile', icon: 'fa fa-gear'},
    {title: 'Customization', link: '/admin/customization/branding', icon: 'fa fa-sliders'},
    {title: 'Email', link: '/admin/email/tab', icon: 'fa fa-envelope'},
    {title: 'Calling', link: '/admin/calling/tab', icon: 'fa fa-phone'},
    {title: 'Users', link: '/admin/users/my-team', icon: 'fa fa-users'},
    // {title: 'Security', link: '/admin/security/login', icon: 'fa fa-shield'},
    // {title: 'API', link: '/admin/api', icon: 'fa fa-hubspot'},
    {title: 'Billing', link: '/admin/billing/overview', icon: 'fa fa-books'},
    // {title: 'Usage Stats', link: '/admin/usage-stats/basic', icon: 'fa fa-gauge'},
    {title: 'Apps', link: '/admin/apps/manage', icon: 'fa fa-puzzle-piece'},
    // {title: 'Permissions', link: '/admin/permissions', icon: 'fa fa-street-view'},
];
export let colorVariables: any = {
    light: `
        /* light */
            --at-app-bg: #edf1f7;
            --at-info: #51b6ff;
            --at-success: #2dca8c;
            --at-primary: #3b6bb3;
            --at-warning: #ffa01c;
            --at-danger: #ff3d71;
            --at-border-color: #d0d4e4;
            --at-font-color: #323338;
            --at-card-bg: #fff;
            --at-link-color: #1f76c2;
            --at-list-item-hover: #dcdfec;
            --at-left-menu-bg: #292f4c;
            --at-button-color: #e5e5e5;
            --at-button-bg: #3e79f7;
            --at-light-gray: #f6f7fb;
            --at-card-border: #e4e9f2;
            --at-shadow-color: rgb(175 175 175 / 65%);
            --at-bg-light: #EDF1F7;
            --at-left-minni-men-bg: #292f4c;
            --menu-link-color:#fff;
            --bg-light-gray:#83838324;
        `,
    dark: `
        /* Dark */
            --at-app-bg: #151930;
            --at-info: #51b6ff;
            --at-success: #2dca8c;
            --at-primary: #3366FF;
            --at-warning: #ffa01c;
            --at-danger: #ff3d71;
            --at-border-color: #394459;
            --at-font-color: #e0e0e0;
            --at-card-bg: #222b45;
            --at-link-color: #1f76c2;
            --at-list-item-hover:#343d57;
            --at-left-menu-bg:#222b45;
            --at-button-color:#e5e5e5;
            --at-button-bg:#3366FF;
            --at-light-gray: var(--at-card-bg);
            --at-card-border: #101426;
            --at-shadow-color: rgb(8 8 8 / 65%);
            --at-bg-light: var(--at-app-bg);
            --bs-table-bg: var(--at-app-bg);
            --at-left-minni-men-bg: #222b45;
            --menu-link-color:#e0e0e0;
            --bg-light-gray:#151930;
        `,
};
export let templateFeatures:any = [
    // {title: 'Appointments', img: 'campaign-ideas-request.png', icon: '', slug: 'Appointments', type: '', description: 'Working on your campaigns together with copywriters and designers, in one central place. This template will allow you to assign team members to tasks, track statuses, and make sure the entire team is on track to meet deadlines. In order to make your work efficient and impactful, we’ve created these templates with built-in automation and different views that are perfect for your needs as a marketer.', installs: 100},
    {title: 'Campaign ideas and requests', img: 'campaign-ideas-request.png', icon: '', slug: 'CampaignIdeasRequests', type: '', description: 'Working on your campaigns together with copywriters and designers, in one central place. This template will allow you to assign team members to tasks, track statuses, and make sure the entire team is on track to meet deadlines. In order to make your work efficient and impactful, we’ve created these templates with built-in automation and different views that are perfect for your needs as a marketer.', installs: 100},
    {title: 'Campaign status', img: 'campaign-status.png', icon: '', slug: 'CampaignStatus', description: 'Working on your campaigns together with copywriters and designers, in one central place. This template will allow you to assign team members to tasks, track statuses, and make sure the entire team is on track to meet deadlines. In order to make your work efficient and impactful, we’ve created these templates with built-in automation and different views that are perfect for your needs as a marketer.', installs: 100},
    {title: 'Client projects', img: 'client-projects.png', icon: '', slug: 'ClientProjects', description: 'Working on your campaigns together with copywriters and designers, in one central place. This template will allow you to assign team members to tasks, track statuses, and make sure the entire team is on track to meet deadlines. In order to make your work efficient and impactful, we’ve created these templates with built-in automation and different views that are perfect for your needs as a marketer.', installs: 100},
    {title: 'Documents for sales', img: 'documents-for-sales.png', icon: '', slug: 'DocumentsForSales', description: 'Working on your campaigns together with copywriters and designers, in one central place. This template will allow you to assign team members to tasks, track statuses, and make sure the entire team is on track to meet deadlines. In order to make your work efficient and impactful, we’ve created these templates with built-in automation and different views that are perfect for your needs as a marketer.', installs: 100},
    {title: 'Email template', img: 'email-template.png', icon: '', slug: 'EmailTemplate', description: 'Customize this free email template as a prompt and starting point for structuring, planning and drafting important work emails.', installs: 100},
    {title: 'Marketing activities', img: 'marketing-activities.png', icon: '', slug: 'MarketingActivities', description: 'Centralize and manage all marketing operations in one collaborative place.', installs: 100},
    {title: 'Marketing strategy', img: 'marketing-stratedy.png', icon: '', slug: 'MarketingStrategy', description: 'Working on your campaigns together with copywriters and designers, in one central place. This template will allow you to assign team members to tasks, track statuses, and make sure the entire team is on track to meet deadlines. In order to make your work efficient and impactful, we’ve created these templates with built-in automation and different views that are perfect for your needs as a marketer.', installs: 100},
    {title: 'Properties', img: 'properties.png', icon: '', slug: 'Properties', description: 'Manage the details and finances for multiple properties with this visual and easy-to-use template. This template board shows key rental property details, monthly and annual rent, and expenses so that you can easily oversee and understand which properties are most profitable, and analyze key data on your property portfolio.', installs: 100},
    {title: 'Contacts', img: 'contacts.png', icon: '', slug: '', description: 'Keep track of all contact information in one, secure place.', installs: 100},
    {title: 'Client onboarding', img: 'client-onboarding.png', icon: '', slug: 'ClientOnboarding', description: 'Take control of client onboarding processes, from renewals to collaboration.', installs: 100},
    {title: 'Creative requests', img: 'creative-requests.png', icon: '', slug: '', description: 'Centralize all the creative requests from different channels so you can see the full picture, manage priorities and manage your team workload. Use automation to automate repetitive tasks so you can work on the important things and boost your productivity.', installs: 100},
    {title: 'Digital asset management (DAM)', img: 'dam.png', icon: '', slug: 'DigitalAssetManagement', description: 'Manage, organize, and share digital assets with your team on one platform.', installs: 100},
    {title: 'FormLeads', img: 'form-leads.png', icon: '', slug:'', description: 'Stay up-to-date with a customer-centric project management template.', installs: 100},
    {title: 'Creative assets', img: 'dummy-img.png', icon: '', slug: 'CreativeRequests', description: 'Keeping track of all your digital assets, as well as their progress, in one easy workspace. Plan and execute creative projects with confidence, all while keeping your team on-track to avoid mishaps like version confusion. With this template, you and your team will easily manage all incoming creative requests and ensure that everyone is aligned on all moving parts. ', installs: 100},
    {title: 'AtmosAI basic training', img: 'dummy-img.png', icon: '', slug: '', description: 'This is where most of your questions will be answered. Just click on each item to see a 15-second video of how to complete various tasks using your monday.com board.', installs: 100},
    {title: 'Greek life extras', img: 'dummy-img.png', icon: '', slug:'', description: 'This bundle will enable you to bring your greek org to the next level. Whether it be managing your chapter dues, organizing your orgs recruitment, or even planning a formal. You can customize each board to reflect your own greek orgs processes. Dont forget to check out our Student Org Must Have to further enhance your workflow with budgets, event planning, alumni database, and many more!', installs: 100},
    {title: 'Work Calendar', img: 'dummy-img.png', icon: '', slug:'', description: 'Have your most productive week yet with this work calendar template for teams.', installs: 100},
    {title: 'Legal requests', img: 'dummy-img.png', icon: '', slug:'', description: 'Streamline all legal requests into one visual workspace.', installs: 100},
    {title: 'Jira project progress', img: 'dummy-img.png', icon: '', slug:'', description: 'Import issues from Jira and track the progress of what your R&D team is working on. Easily sync with your sales and customer support teams and work better together.', installs: 100},
    {title: 'Customer projects', img: 'dummy-img.png', icon: '', slug:'', description: 'Stay up-to-date with a customer-centric project management template.', installs: 100},
    {title: 'Student club: communication', img: 'dummy-img.png', icon: '', slug:'', description: 'Manage all communications of your student org. Stay on top of your executive boards activities, keep your club aligned with focused Presidents updates, and plan your next club event, all in one place.', installs: 100},
    {title: 'Privacy program management', img: 'dummy-img.png', icon: '', description: 'This template offers a few steps and processes related to GDPR & privacy compliance.', installs: 100},
    {title: 'Agile project management', img: 'dummy-img.png', icon: '', description: 'Agile roadmap and sprint planning boards', installs: 100},
    {title: 'Risk register', img: 'dummy-img.png', icon: '', description: 'Manage the projects risks and see the risks statuses through a dashboard.', installs: 100},
    {title: 'Big game party planning', img: 'dummy-img.png', icon: '', description: 'Plan your Big Game party so you and your guests can enjoy the game on full stomachs.', installs: 100},
    {title: 'Big game virtual party', img: 'dummy-img.png', icon: '', description: 'Collect coworkers game day predictions for an office friendly competition.', installs: 100},
    {title: 'Employee lifecycle packages', img: 'dummy-img.png', icon: '', description: 'Manage and distribute meaningful packages to employees', installs: 100},
    {title: 'SWOT analysis', img: 'dummy-img.png', icon: '', description: 'This template will help to identify the strengths, weaknesses, opportunities and threats of a business, project or campaign. With multiple views available, collaborate with your team to identify priorities and next steps, see what opportunities to focus on, and much more.', installs: 100},
    {title: 'Timesheet', img: 'dummy-img.png', icon: '', description: 'Manage your time with this customizable template and maintain oversight of your hours, role, pay and more. Use the dashboard view to analyze and visualize your team`s data and keep an eye on trends and costs.', installs: 100},
    {title: 'Project workflow', img: 'dummy-img.png', icon: '', description: 'Organize and track projects and timelines with this project workflow template. Visualize the process of your workflow, add your task details, start and end dates, and duration times, to clarify responsibility, monitor progress and keep tasks and projects on track.', installs: 100},
    {title: 'Work schedule', img: 'dummy-img.png', icon: '', description: 'Stay up-to-date with a customer-centric project management template.', installs: 100},
    {title: 'Inventory management', img: 'dummy-img.png', icon: '', description: 'A simple and intuitive template for managing stock and inventory, enabling you to easily access supplier information, identify when its time to reorder, and keep an eye on costs.', installs: 100},
    {title: 'Attendance sheet', img: 'dummy-img.png', icon: '', description: 'Easily keep track of your employees or students, and monitor total attendance and absences with a customizable and visual weekly or monthly view.', installs: 100},
    {title: 'Professional references', img: 'dummy-img.png', icon: '', description: 'An organized and clear way to document candidate references, with space to record their address, phone number, professional relationship, title, and organization.', installs: 100},
    {title: 'Gap analysis', img: 'dummy-img.png', icon: '', description: 'Use this entirely customizable template to analyze your business current and target performance, and define the necessary steps to actualize your goals.', installs: 100},
    {title: 'Cost estimate', img: 'dummy-img.png', icon: '', description: 'Stay up-to-date with a customer-centric project management template.', installs: 100},
    {title: 'Budget plan', img: 'dummy-img.png', icon: '', description: 'This simple template will enable you to manage each department, team or individuals spend according to their allocated budget, and understand at a glance whether spend is on target or not.', installs: 100},
    {title: 'BudgetWork breakdown structure', img: 'dummy-img.png', icon: '', description: 'Stay up-to-date with a customer-centric project management template.', installs: 100},
    {title: 'Meeting agenda', img: 'dummy-img.png', icon: '', description: 'Use this meeting agenda template to record important meeting details such as location, date, time, attendees, and agenda items as well as descriptions, links and files. Define roles, next steps, and assign ownership to make sure nothing is missed or forgotten.', installs: 100},
    {title: 'Daily work schedule', img: 'dummy-img.png', icon: '', description: 'Manage your day with this customizable daily work schedule. Record your working hours, absences, roles, and responsibilities by the hour, for optimum efficiency and organization.  Share this template with employees or colleagues so they know your schedule and are able to work around it.', installs: 100},
    {title: 'Financial accounting', img: 'dummy-img.png', icon: '', description: 'Use this accounting template to help to keep track of money owed, and to provide a quick look at the total outstanding balances and due dates. You can record and track how many payments are being made, and set deadlines for these payments.', installs: 100},
    {title: 'Expense report', img: 'dummy-img.png', icon: '', description: 'This expense report is a simple and customizable template for documenting expense information such as the products or items purchased, dates of purchase, total costs and payment status and method.', installs: 100},
    {title: 'Action plan', img: 'dummy-img.png', icon: '', description: 'This action plan template breaks down goals into action steps, that can be prioritized, assigned ownership, and tracked for progress. Start and end dates can be added for each action, as well as relevant details and files. With this template, short and long term goals become manageable and achievable, and issues that arise can quickly be noted and addressed.', installs: 100},
    {title: 'Balanced scorecard', img: 'dummy-img.png', icon: '', description: 'Use this simple and customizable balance sheet template to determine your overall financial outlook, across relevant categories. Understand your current financial performance, your objectives, initiatives and targets and see how close you are to reaching your financial goals.', installs: 100},
    {title: 'Medicine chart', img: 'dummy-img.png', icon: '', description: 'This useful medicine chart helps carers/doctors keep track of patient medications, dosages, and important medical information. Assign doctors and keep a record of patient notes and requirements, with this customizable template.', installs: 100},
    {title: 'Call log', img: 'dummy-img.png', icon: '', description: 'Record and detail your teams client calls with this practical and simple call log template. Enter the date and time of client calls, client details, contact numbers, the purpose of the call, and any additional notes or follow-up arrangements.', installs: 100},
    {title: 'Training plan', img: 'dummy-img.png', icon: '', description: 'This Training Plan template is organized by training theme, and clearly documents the important details of planned and upcoming training sessions. Record training details such as content and objectives, delivery status, date and timing, and a place to record participant’s assessment scores.', installs: 100},
    {title: 'Monthly schedule', img: 'dummy-img.png', icon: '', description: 'This monthly schedule template creates a visual representation of your upcoming tasks, work, and events, and can record every deadline and to-do, both personally and professionally. Customize your monthly schedule to your needs, with notes, files, and different views.', installs: 100},
    {title: 'Simple bill of sale', img: 'dummy-img.png', icon: '', description: 'Manage your team or organizations bills and receipts using this practical and simple bill template. You can set up your own custom columns to keep track of important data, such as payment dates, customer names, invoice numbers, amount due, amount paid, payment method and everything in between.', installs: 100},
    {title: 'Self assessment', img: 'dummy-img.png', icon: '', description: 'This self-assessment template provides individuals with a way to evaluate their strengths and weaknesses against their professional goals and objectives. It’s simple to share, view, and collaborate in one place and offers customizable security settings, to protect confidentiality.', installs: 100},
    {title: 'Organizational chart', img: 'dummy-img.png', icon: '', description: 'Use this template to record and detail the organization and management structure of your team or company. Use the kanban and whiteboard views to collaborate creatively to visualize your organizations structure, and more.', installs: 100},
    {title: 'Performance improvement', img: 'dummy-img.png', icon: '', description: 'Record and manage your employee’s performance improvement with this comprehensive and easy-to-use plan. Track your employees work challenges, performance and goals, and create an efficient workflow for improving your employees performance. ', installs: 100},
    {title: 'Root cause analysis (5 whys)', img: 'dummy-img.png', icon: '', description: 'This root cause analysis report template allows for a detailed examination of the incident in question. The five questions structure allows users to define the incident and context, and then analyze the reasons and root cause behind it. 	This template includes a form, where important details and findings related to the root cause, and preventative action steps can be recorded. ', installs: 100},
    {title: 'Competitor analysis', img: 'dummy-img.png', icon: '', description: 'Use this simple Competitor analysis template to compare your company with direct competition, and gain insight into their position in the competitive landscape. This template is simply structured to enable you to strategize and plan for company growth by discovering opportunities and threats ahead of time.', installs: 100},
    {title: 'Decision priority matrix', img: 'dummy-img.png', icon: '', description: 'Use this useful matrix template to prioritize project tasks and inform your decision-making and time management. Easily determine which tasks to work on and which to delegate or eliminate, and organize your work by priority, importance, and level of difficulty, in order to understand priorities and urgencies.', installs: 100},
    {title: 'Resource utilization', img: 'dummy-img.png', icon: '', description: 'Use this customizable template to forecast your project team’s resource bandwidth and understand the resource and hours needed per project. Detail your project resource requirements, and plan and manage demands to ensure you have the right budget and team in place.', installs: 100},
    {title: 'Itinerary', img: 'dummy-img.png', icon: '', description: 'Plan your schedule and activities with this comprehensive itinerary template. Make and record plans for each leg of your trip, including transport details, locations, and accommodation so that you have an organized record of resources while traveling.', installs: 100},
    {title: 'Business continuity plan', img: 'dummy-img.png', icon: '', description: 'The template provides a structured plan to ensure resilience and continuity in the face of any type of business threat. Use this template to plan efficiently for disruption, and present your information to your teams and colleagues in a simple and shareable way.', installs: 100},
    {title: 'Succession planning', img: 'dummy-img.png', icon: '', description: 'Stay up-to-date with a customer-centric project management template.', installs: 100},
    {title: 'Rental property spreadsheet', img: 'dummy-img.png', icon: '', description: 'Stay up-to-date with a customer-centric project management template.', installs: 100},
    {title: 'Construction schedule', img: 'dummy-img.png', icon: '', description: 'Stay up-to-date with a customer-centric project management template.', installs: 100},
    {title: 'Cost comparision', img: 'dummy-img.png', icon: '', description: 'Stay up-to-date with a customer-centric project management template.', installs: 100},
    {title: 'DMAIC analysis', img: 'dummy-img.png', icon: '', description: 'Stay up-to-date with a customer-centric project management template.', installs: 100},
    {title: 'Amortization schedule', img: 'dummy-img.png', icon: '', description: 'Stay up-to-date with a customer-centric project management template.', installs: 100},
    {title: '30 60 90 day plan', img: 'dummy-img.png', icon: '', description: 'Stay up-to-date with a customer-centric project management template.', installs: 100},
    {title: 'Smart goals', img: 'dummy-img.png', icon: '', description: 'Stay up-to-date with a customer-centric project management template.', installs: 100},
    {title: 'Facebook posts plan', img: 'dummy-img.png', icon: '', description: 'Stay up-to-date with a customer-centric project management template.', installs: 100},
    {title: 'Podcast planning', img: 'dummy-img.png', icon: '', description: 'Stay up-to-date with a customer-centric project management template.', installs: 100},
    {title: 'Start from scratch', img: 'dummy-img.png', icon: '', description: 'Stay up-to-date with a customer-centric project management template.', installs: 100},
    {title: 'Basic CRM', img: 'dummy-img.png', icon: '', description: 'Stay up-to-date with a customer-centric project management template.', installs: 100},
    {title: 'Facebook ads integration', img: 'dummy-img.png', icon: '', description: 'Stay up-to-date with a customer-centric project management template.', installs: 100},
    {title: 'High-level marketing budget', img: 'dummy-img.png', icon: '', description: 'Stay up-to-date with a customer-centric project management template.', installs: 100},
    {title: 'Marketing team planning', img: 'dummy-img.png', icon: '', description: 'Stay up-to-date with a customer-centric project management template.', installs: 100},
    {title: 'IT service desk', img: 'dummy-img.png', icon: '', description: 'Stay up-to-date with a customer-centric project management template.', installs: 100},
    {title: 'Sprint restrospective', img: 'dummy-img.png', icon: '', description: 'Stay up-to-date with a customer-centric project management template.', installs: 100},
    {title: 'Client onboarding', img: 'dummy-img.png', icon: '', description: 'Stay up-to-date with a customer-centric project management template.', installs: 100},
    {title: 'Product development', img: 'dummy-img.png', icon: '', description: 'Stay up-to-date with a customer-centric project management template.', installs: 100},
    {title: 'Customer requests', img: 'dummy-img.png', icon: '', description: 'Stay up-to-date with a customer-centric project management template.', installs: 100},
    {title: 'Fundraising CRM', img: 'dummy-img.png', icon: '', description: 'Stay up-to-date with a customer-centric project management template.', installs: 100},
    {title: 'Volunteer registration management', img: 'dummy-img.png', icon: '', description: 'Stay up-to-date with a customer-centric project management template.', installs: 100},
    {title: 'Product development', img: 'dummy-img.png', icon: '', description: 'Stay up-to-date with a customer-centric project management template.', installs: 100},
    {title: 'Real estate agency management', img: 'dummy-img.png', icon: '', description: 'Stay up-to-date with a customer-centric project management template.', installs: 100},

    {title: 'Real estate agency management', img: 'dummy-img.png', icon: '', slug: 'RealEstateContacts', description: 'Manage your real estate agency with one easy-to-use system.', installs: 100},
    {title: 'Onboarding plan', img: 'dummy-img.png', icon: '', slug: '', description: 'Manage processes in visual workspace for a smooth onboarding experience.', installs: 100},
    {title: 'Account management', img: 'dummy-img.png', icon: '', slug: '', description: 'Close deals quickly and collaborate on contracts from one space.', installs: 100},
    {title: 'Sales enablement kit: winning processes for stronger sales teams', img: 'dummy-img.png', icon: '', description: 'Streamline and manage your sales team onboarding and performance.', installs: 100},
    {title: 'CRM', img: 'dummy-img.png', icon: '', slug: '', description: 'Capture leads, track sales pipelines, and manage contacts— all in one place.', installs: 100},
    {title: 'Employee onboarding', img: 'dummy-img.png', icon: '', slug: '', description: 'Streamline the onboarding process to get new employees up to speed.', installs: 100},
    {title: 'Real estate CRM', img: 'dummy-img.png', icon: '', slug: '', description: 'Manage all real estate business operations from one central database.', installs: 100},
    {title: 'Customer Onboarding', img: 'dummy-img.png', icon: '', slug: '', description: 'Manage the entire process of your client’s onboarding in one place.', installs: 100},
    {title: 'Call Log', img: 'dummy-img.png', icon: '', slug: '', description: 'Record and detail your teams client calls with this practical and simple call log template. Enter the date and time of client calls, client details, contact numbers, the purpose of the call, and any additional notes or follow-up arrangements. ', installs: 100},
    {title: 'Campaign Planning',img: 'dummy-img.png', icon: '', slug:'', description: 'Working on your campaigns together with copywriters and designers, in one central place. This template will allow you to assign team members to tasks, track statuses, and make sure the entire team is on track to meet deadlines. In order to make your work efficient and impactful, we’ve created these templates with built-in automation and different views that are perfect for your needs as a marketer.', installs: 100},
    // {title: 'Creative Requests', icon: '', description: 'Centralize all the creative requests from different channels so you can see the full picture, manage priorities and manage your team workload. Use automation to automate repetitive tasks so you can work on the important things and boost your productivity.', installs: 100},
    // {title: 'Creative assets', icon: '', description: 'Keeping track of all your digital assets, as well as their progress, in one easy workspace. Plan and execute creative projects with confidence, all while keeping your team on-track to avoid mishaps like version confusion. With this template, you and your team will easily manage all incoming creative requests and ensure that everyone is aligned on all moving parts. ', installs: 100},
    // {title: 'Email marketing', icon: '', description: 'Managing your entire email marketing workflow - from the initial request to sending and tracking your campaign. These boards will enable you to stay up-to-date on all campaign requests and campaign statuses in one place. We’ve created a bundle of boards, built-in with automationsand different views, that are perfectly suited for your needs as a marketer.', installs: 100},
    // {title: 'Contact Us Form', icon: '', description: 'Add \'Contact us\' page to your website to capture leads', installs: 100},
    // {title: 'Marketing team planning', icon: '', description: 'Managing your entire marketing high-level initiatives and ongoing tasks in one central place, together with your team. This package of templates combines a high-level board divided by quarters and a weekly to-do board for your team’s day-to-day tasks. These templates allow you to assign team members to tasks, track their status, and make sure the entire team is on track to meet their deadlines and goals.', installs: 100},
    // {title: 'Single Marketing Project', icon: '', description: 'This template can be used as a low-level project board to help you plan and track everything that needs to be done to complete your project in one place! With 6 views, automations, and due date reminders, your whole team will stay on top of your project all the way through. The Kanban View lets you manage your project at a glance, and the Gantt View will help you visualize the progression of your project to help you better manage deadlines. ', installs: 100},
    // {title: 'Product marketing launch', icon: '', description: 'Plan and execute your product marketing launch from A-Z with your team with the Product Marketing Launch template set. These powerful boards and dashboard lets you visualize each phase and manage your deadlines in a Gantt View, plan campaigns with your content/creative teams and easily monitor campaign performance and your teams workload. Get an overview to ensure youre on track, hitting goals and never miss a beat. ', installs: 100},
    // {title: 'Marketing activities', icon: '', description: 'Centralize and manage all marketing operations in one collaborative place.', installs: 100},
    // {title: 'Legal requests', icon: '', description: 'Streamline all legal requests into one visual workspace.', installs: 100},
    // {title: 'Product Launch Plan monday workdoc', icon: '', description: 'Collaborate with your team to define your perfect product launch plan. Easily embed all relevant boards, dashboards, and more so all of your work is centralized and your team is on the same page.', installs: 100},
    // {title: 'Atmosai marketer', icon: '', description: 'Get everything you need for all your marketing and creative processes. This full set of templates provides you with robust capabilities to handle any marketing initiative or creative project. Plan your strategies for your next quarters, manage budgets, plan and track campaigns, streamline creative requests, annotate on assets, approve final versions, and more. This solution is customizable to adapt to the way you and your team work so you can get things done fast and efficiently. ', installs: 100},
    // {title: 'Contextualizing sprints', icon: '', description: 'Stay on-track with your team’s product roadmap.', installs: 100},
    // {title: 'Financial Accounting', icon: '', description: 'Use this accounting template to help to keep track of money owed, and to provide a quick look at the total outstanding balances and due dates. You can record and track how many payments are being made, and set deadlines for these payments.', installs: 100},
    // {title: 'Training Plan', icon: '', description: 'This Training Plan template is organized by training theme, and clearly documents the important details of planned and upcoming training sessions. Record training details such as content and objectives, delivery status, date and timing, and a place to record participant’s assessment scores. ', installs: 100},
    // {title: 'Rental Property Spreadsheet', icon: '', description: 'Manage the details and finances for multiple properties with this visual and easy-to-use template. This template board shows key rental property details, monthly and annual rent, and expenses so that you can easily oversee and understand which properties are most profitable, and analyze key data on your property portfolio. ', installs: 100},
    // {title: 'Google Ads management', icon: '', description: 'Beta feature: Use monday.com with Google Ads to equip yourself with the best practice marketing tactics and tools you need to help promote your business. Sync your Google Ads data directly into monday.com. Easily launch, manage, and track all of your ad search campaigns from one place. ', installs: 100},
    // {title: 'Digital asset management', icon: '', description: 'Manage, organize, and share digital assets with your team on one platform.', installs: 100},
    // {title: 'Creative Processes', icon: '', description: 'Use this customizable Creative Processes template to get up and running with your creative team tasks and projects. Visualize your work with different views such as the Kanban View to update your progress, the Calendar View to manage your deadlines, the Files View to see all your digital assets in one place, and the Creative Request Form to efficiently review any incoming requests. This template also includes a built in date reminder to automatically notify you when a publish date is approaching. ', installs: 100},
    // {title: 'High-level marketing budget', icon: '', description: 'Plan and track your marketing budget and costs throughout the year.', installs: 100},
    // {title: 'Client campaigns for agencies', icon: '', description: 'Manage clients, campaigns, and initiatives all in one place.', installs: 100},
    // {title: 'Facebook ads Integration', icon: '', description: 'Integrate your Facebook account to manage and monitor ad campaigns.', installs: 100},
    // {title: 'Social media planner', icon: '', description: 'Create, schedule, and design all social media content in one place.', installs: 100},
    // {title: 'Event Management', icon: '', description: 'Manage all your events visually in one collaborative workspace.', installs: 100},
    // {title: 'Post-event opportunities', icon: '', description: 'Manage feedback, sales leads, and opportunities from events.', installs: 100},
    // {title: 'Powerful campaign planning', icon: '', description: 'Plan all your upcoming campaigns in a visual way.', installs: 100},
    // {title: 'Customer requests', icon: '', description: 'Tackle customer support requests with an efficient system.', installs: 100},
    // {title: 'Supporting sales materials', icon: '', description: 'Centralize, manage, and track all sales materials from one organized place.', installs: 100},
    // {title: 'A/B testing and planning', icon: '', description: 'Track and analyze A/B test results to achieve your conversion goals.', installs: 100},

];
