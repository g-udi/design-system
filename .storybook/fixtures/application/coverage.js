// Application workflow entry points. Component coverage lives in ../reui/coverage.json.
export const blockCoverage = [
  [
    'App Shell / Navbar',
    'AppShell + supplied navigation',
    'blocks-application-appshell--content-workspace-example'
  ],
  [
    'Auth',
    'AuthForm: password, email link and failed submission',
    'blocks-application-authform--password'
  ],
  [
    'Card / List / Profile',
    'ResourceList + Card, Avatar, Pill and SettingsPanel',
    'blocks-application-resourcelist--recent-articles'
  ],
  [
    'Dashboard / Stats / Chart',
    'Editorial workspace + StatGroup; MDX charts remain isolated',
    'blocks-application-statgroup--editorial-summary'
  ],
  [
    'Dialog / Sheet',
    'Dialog with modal, sheet and confirmation variants',
    'core-dialog--detail-sheet'
  ],
  [
    'Empty State',
    'EmptyState and collection states',
    'core-emptystate--first-article'
  ],
  [
    'Form / Settings',
    'SettingsPanel + Field, Input, Textarea, Select, RadioGroup',
    'blocks-application-settingspanel--profile-and-preferences'
  ],
  [
    'Kanban Board',
    'Controlled editorial board with explicit move actions',
    'blocks-application-kanbanboard--editorial-workflow'
  ],
  [
    'Onboarding / Wizard',
    'Wizard: validation, review, completion and failed save',
    'blocks-application-wizard--collection-setup'
  ],
  [
    'Timeline',
    'Timeline activity and publication milestones',
    'core-timeline--editorial-activity'
  ]
];
