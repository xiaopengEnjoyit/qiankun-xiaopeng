// import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    redirect: "/about",
    meta: {
      title: "菜单一",
    },
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ "../views/about.vue"),
    meta: {
      title: "菜单二",
    },
  },
];
// const router = createRouter({
//   history: createWebHistory(),
//   routes,
// });
// const router = new VueRouter({
//   mode: 'history',
//   base: getBase(name),
//   routes
// })

export default routes;
