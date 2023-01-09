/* 应用配置 */

export const NAVBAR_MENUS = [
  {
    name: 'app1',
    entry: '//localhost:9991',
    activeRule: 'app1',
    title: '应用一',
    children: [
      {
        name: '菜单一',
        index: '/app1/home',
        icon: 'el-icon-menu',
        permissionsName: ''
      },
      {
        name: '菜单二',
        index: '/app1/about',
        icon: 'el-icon-menu',
        permissionsName: ''
      }
    ]
  },
  {
    name: 'app2',
    entry: '//localhost:9992',
    activeRule: 'app2',
    title: '应用二',
    children: [
      {
        name: '菜单一',
        index: '/app2/home',
        icon: 'el-icon-menu',
        permissionsName: ''
      },
      {
        name: '菜单二',
        index: '/app2/about',
        icon: 'el-icon-menu',
        permissionsName: ''
      }
    ]
  },
  {
    name: 'app3',
    entry: '//localhost:9999',
    activeRule: 'app3',
    title: '应用三',
    children: [
      {
        name: '菜单一',
        index: '/app3/home',
        icon: 'el-icon-menu',
        permissionsName: ''
      },
      {
        name: '菜单二',
        index: '/app3/about',
        icon: 'el-icon-menu',
        permissionsName: ''
      }
    ]
  },
  {
    name: 'app4',
    entry: '//localhost:8088',
    activeRule: 'app4',
    title: '应用4',
    children: [
      {
        name: '菜单一',
        index: '/app4/login',
        icon: 'el-icon-menu',
        permissionsName: ''
      }
    ]
  },
  {
    name: 'app5',
    entry: '//localhost:9998',
    activeRule: 'app5',
    title: '应用5',
    children: [
      {
        name: '菜单一',
        index: '/app5/home',
        icon: 'el-icon-menu',
        permissionsName: ''
      }
    ]
  }
]
// export function asyncApps() {
//   return new Promise((resolve, reject) => {

//     resolve(navbar_menus)
//   })
// }