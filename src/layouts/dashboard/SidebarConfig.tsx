// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Label from '../../components/Label';
import SvgIconStyle from '../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name: string) => (
  <SvgIconStyle src={`/static/icons/navbar/${name}.svg`} sx={{ width: '100%', height: '100%' }} />
);

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  project: getIcon('ic_user'),
  kanban: getIcon('ic_kanban'),
  banking: getIcon('ic_banking'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  booking: getIcon('ic_booking')
};

const sidebarConfig = [
  
  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'Project Management',
    items: [
      // MANAGEMENT : USER
      {
        title: 'project',
        path: PATH_DASHBOARD.project.root,
        icon: ICONS.project,
        children: [
          { title: 'list', path: PATH_DASHBOARD.project.list },
          { title: 'create', path: PATH_DASHBOARD.project.newProject },
          { title: 'edit', path: PATH_DASHBOARD.project.editById },
        ]
      },
    ]
  },

  // APP
  // ----------------------------------------------------------------------
  {
    subheader: 'shift management',
    items: [
      { title: 'calendar', path: PATH_DASHBOARD.calendar, icon: ICONS.calendar },
    ]
  }
];

export default sidebarConfig;
