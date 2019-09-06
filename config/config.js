import defaultSettings from './defaultSettings'; // https://umijs.org/config/

import slash from 'slash2';
import webpackPlugin from './plugin.config';
import { blue, red, gold } from '@ant-design/colors';

const { pwa, primaryColor } = defaultSettings; // preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;
const isAntDesignProPreview = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site';
const plugins = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        // default false
        enable: true,
        // default zh-CN
        default: 'zh-CN',
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: true,
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3,
      },
      pwa: pwa
        ? {
            workboxPluginMode: 'InjectManifest',
            workboxOptions: {
              importWorkboxFrom: 'local',
            },
          }
        : false, // default close dll, because issue https://github.com/ant-design/ant-design-pro/issues/4665
      // dll features https://webpack.js.org/plugins/dll-plugin/
      // dll: {
      //   include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
      //   exclude: ['@babel/runtime', 'netlify-lambda'],
      // },
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
]; // 针对 preview.pro.ant.design 的 GA 统计代码

if (isAntDesignProPreview) {
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },
  ]);
  plugins.push([
    'umi-plugin-pro',
    {
      serverUrl: 'https://ant-design-pro.netlify.com',
    },
  ]);
}

export default {
  plugins,
  block: {
    // 国内用户可以使用码云
    // defaultGitUrl: 'https://gitee.com/ant-design/pro-blocks',
    defaultGitUrl: 'https://github.com/ant-design/pro-blocks',
  },
  hash: true,
  targets: {
    ie: 11,
  },
  devtool: isAntDesignProPreview ? 'source-map' : false,
  // umi routes: https://umijs.org/zh/guide/router.html
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          routes: [
            {
              path: '/',
              redirect: '/welcome',
            },
            {
              path: '/welcome',
              name: 'welcome',
              icon: 'windows',
              component: './Welcome',
            },
            {
              path: '/brand',
              name: 'brand',
              icon: 'apple',
              routes: [
                {
                  path: '/brand/brand-list',
                  name: 'brand-list',
                  component: './brand/brand-list',
                },
              ],
            },
            {
              path: '/company',
              name: 'company',
              icon: 'github',
              routes: [
                {
                  path: '/company/news',
                  name: 'news',
                  component: './company/news',
                },
              ],
            },
            {
              path: '/come',
              name: 'come',
              icon: 'google',
              routes: [
                {
                  path: '/come/introduce',
                  name: 'introduce',
                  component: './come/introduce',
                },
                {
                  path: '/come/beauty',
                  name: 'beauty',
                  component: './come/beauty',
                },
              ],
            },
            {
              path: '/contact',
              name: 'contact',
              icon: 'twitter',
              routes: [
                {
                  path: '/contact/join',
                  name: 'join',
                  component: './contact/join',
                },
                {
                  path: '/contact/recruit',
                  name: 'recruit',
                  component: './contact/recruit',
                },
              ],
            },
            {
              path: '/clouds',
              name: 'clouds',
              icon: 'facebook',
              routes: [
                {
                  path: '/clouds/mall',
                  name: 'mall',
                  component: './clouds/mall',
                },
                {
                  path: '/clouds/merchant',
                  name: 'merchant',
                  component: './clouds/merchant',
                },
              ],
            },
            {
              path: '/account',
              name: 'account',
              icon: 'user',
              routes: [
                {
                  path: '/account/settings',
                  name: 'settings',
                  component: './user/settings',
                },
              ],
            },
            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    '@font-size-sm': '12px',
    '@font-size-base': '12px',
    '@primary-color': '#0070cc',
    '@border-radius-base': '0',
    '@border-radius-sm': '0',

    '@text-color': 'fade(#000, 65%)',
    '@text-color-secondary': 'fade(#000, 45%)',
    '@background-color-base': 'hsv(0, 0, 96%)',

    '@success-color': '#1e8e3e',
    '@error-color': '#d93026',
    '@warning-color': '#ffc440',
    '@info-color': '@primary-color',
    '@danger-color': '@error-color',
    '@processing-color': '@primary-color',

    '@border-color-base': '#dedede',
    '@border-color-split': '#dedede',

    '@outline-width': '0',
    '@outline-color': '#737373',

    '@input-height-lg': '36px',
    '@input-height-base': '32px',
    '@input-height-sm': '24px',
    '@input-hover-border-color': '#737373',

    '@form-item-margin-bottom': '16px',

    '@btn-default-bg': '#fafafa',
    '@btn-default-border': '#dedede',
    '@btn-danger-color': '#fff',
    '@btn-danger-bg': '@error-color',
    '@btn-danger-border': '@error-color',

    '@switch-color': '@success-color',

    '@table-header-bg': '#fafafa',
    '@table-row-hover-bg': '#fafafa',
    '@table-padding-vertical': '8px',

    '@badge-color': '@error-color',

    '@breadcrumb-base-color': '@text-color',
    '@breadcrumb-last-item-color': '@text-color-secondary',

    '@slider-rail-background-color': '@background-color-base',
    '@slider-rail-background-color-hover': '#e1e1e1',
    '@slider-track-background-color': '@primary-color',
    '@slider-track-background-color-hover': '@primary-color',
    '@slider-handle-border-width': '1px',
    '@slider-handle-color': '#dedede',
    '@slider-handle-color-hover': '#dedede',
    '@slider-handle-color-focus': '#dedede',
    '@slider-handle-color-tooltip-open': '#ddd',
    '@slider-handle-color-focus-shadow': 'transparent',
    '@slider-handle-shadow': '1px 1px 4px 0 rgba(0,0,0,.13)',

    '@alert-success-border-color': '#dff4e5',
    '@alert-success-bg-color': '#dff4e5',
    '@alert-info-border-color': '#e5f3ff',
    '@alert-info-bg-color': '#e5f3ff',
    '@alert-error-border-color': '#fcebea',
    '@alert-error-bg-color': '#fcebea',
    '@alert-warning-border-color': '#fff7db',
    '@alert-warning-bg-color': '#fff7db',

    '@radio-button-bg': 'transparent',
    '@radio-button-checked-bg': 'transparent',

    '@progress-radius': '0',

    '@tabs-card-gutter': '-1px',
    '@tabs-card-tab-active-border-top': '2px solid @primary-color',
  },
  define: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, _, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  chainWebpack: webpackPlugin,
  proxy: {
    '/api/': {
      target: 'http://192.168.1.119:8080/',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
};
