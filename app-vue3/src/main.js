import { createApp } from "vue";
import App from "./App.vue";
import routes from "./router";
import "./public-path";
import { createRouter, createWebHistory } from "vue-router";
import {
  renderWithQiankun,
  qiankunWindow,
} from "vite-plugin-qiankun/dist/helper";
let router = null;
let instance = null;
let history = null;
// some code
renderWithQiankun({
  mount(props) {
    console.log("mount");
    render(props);
  },
  bootstrap() {
    console.log("bootstrap");
  },
  unmount(props) {
    console.log("unmount");
    const { container } = props;
    const mountRoot = container?.querySelector("#root");
    ReactDOM.unmountComponentAtNode(
      mountRoot || document.querySelector("#root")
    );
  },
});

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render({});
}

function render(props = {}) {
  const { container } = props;
  console.log("props.name", props.name);
  history = createWebHistory(
    window.__POWERED_BY_QIANKUN__ ? `${props.name}` : "/"
  );
  router = createRouter({
    history,
    routes,
  });
  instance = createApp(App);
  instance.use(router);
  instance.mount("#app");
}
// if (!window.__POWERED_BY_QIANKUN__) {
//   render();
// }
// // 生命周期 - 挂载前,在这里由主应用传过来的参数
// export async function bootstrap() {
//   // console.log('one bootstrap'+JSON.stringify(props))
//   console.log(localStorage.getItem("test"));
// }

// // 生命周期 - 挂载后
// export async function mount(props) {
//   render(props);

//   //console.log(props.msg.data);

//   // // 主应用传递过来的 props.fn 是一个对象。循环遍历下，将各个属性绑定到子应用的原型链上
//   // Object.keys(props.fn).forEach(method => {
//   //     createApp.prototype[`$${method}`] = props.fn[method]
//   // })
//   // 渲染
// }

// // 生命周期 - 解除挂载
// export async function unmount() {
//   instance.unmount();
//   instance._container.innerHTML = "";
//   instance = null;
//   router = null;
//   history.destroy();
//   // instance=instance.unmount(props);
//   // instance._container.innerHTML = "";
//   // instance = null;
//   // router = null
// }
// // createApp(App).mount("#app").use(router);
const useDevMode = true;

