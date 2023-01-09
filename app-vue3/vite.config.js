import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { UserConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import qiankun from "vite-plugin-qiankun";
const { title, name } = require("./package");
const isProduction = process.env.NODE_ENV === "production";
// https://vitejs.dev/config/
const useDevMode = true
export default defineConfig({
  plugins: [
    qiankun("app5"),
    vue(),
    ...(useDevMode ? [] : [reactRefresh()]),
    qiankun("viteapp", {
      useDevMode,
    }),
  ],
  // 打包配置
  build: {
    target: "esnext",
    lib: {
      name,
      entry: "src/main.js",
      formats: ["umd"],
    },
  },

  // base: isProduction ? '/reportManage' : './',
  server: {
    port: 9998,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    proxy: {
      "/api/twReport/": {
        target: "http://10.0.0.171:8081",
        changeOrigin: true,
      },
      "^/api": {
        target: "http://10.0.0.171:28083",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});

// const { name } = require('./package.json')
// const port = 9998

// module.exports = {
//   devServer: {
//     port,
//     // 允许被主应用跨域fetch请求到
//     headers: {
//       'Access-Control-Allow-Origin': '*'
//     }, proxy: {
//       '/omg': {
//         target: 'http://127.0.0.1',
//         changeOrigin: true,
//         ws: true,
//         pathRewrite: { '^/omg': '' }
//       }
//     }
//   },
//   configureWebpack: {
//     output: {
//       library: `${name}-[name]`,
//       // 把子应用打包成umd库格式
//       // 当我们把 libraryTarget 设置为 umd 后，我们的 library 就暴露为所有的模块定义下都可运行的方式了，主应用就可以获取到微应用的生命周期钩子函数了
//       libraryTarget: 'umd',
//       jsonpFunction: `webpackJsonp_${name}`
//     }
//   }
// }
