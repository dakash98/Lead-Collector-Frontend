import Vue from 'vue';
import Router from 'vue-router';
// import FetchAllLeads from '@/components/FetchAllLeads';
import Dashboard from '@/components/Dashboard';
Vue.use(Router);

const routes = [
    {
        path: '/dashboard',
        name: 'dashboard',
        title: 'Dashboard',
        component: Dashboard,
      },
//   {
//     path: '/fetch-all-leads',
//     name: 'fetch-all-leads',
//     title: 'FetchAllLeads',
//     component: FetchAllLeads,
//   },
//   {
//     path: '*',
//     redirect: { name: 'dashboard' },
//   },
];

export default new Router({
  routes,
});