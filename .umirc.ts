import { defineConfig } from '@umijs/max';
import { Component } from 'react';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},

  proxy: {
    '/api':{
      'target': 'http://192.168.183.83:8088',
      // 'target': 'http://192.168.239.83:8088',
      // 'target': 'http://192.168.57.83:8088',
      'changeOrigin': true,
      'pathRewrite': { '^/api': '' },
      'timeout': 30000,
    },
  // '/api1': {
  //     context: ['/api1'],
  //     target: 'http://192.168.11.83:8088',
  //     // target: 'http://192.168.79.83:8088',
  //     changeOrigin: true,
  //     pathRewrite: { '^/api1': '' },
  //     timeout: 30000,
  //   },
  //   '/api2': {
  //     context: ['/api2'],
  //     target: 'http://192.168.11.83:8088',
  //     // target: 'http://192.168.79.83:8088',
  //     changeOrigin: true,
  //     pathRewrite: { '^/api2': '' },
  //     timeout: 30000,
  //   },
  //   '/api3': {
  //     context: ['/api3'],
  //     target: 'http://192.168.11.83:8088',
  //     // target: 'http://192.168.79.83:8088',
  //     changeOrigin: true,
  //     pathRewrite: { '^/api3': '' },
  //     timeout: 30000,
  //   },
    

},

  request: {
   
  },
  //umi使用的插件
  plugins: ['@umijs/max-plugin-openapi'],
  //配置openAPI
  openAPI: {
    //请求使用的是什么插件
    requestLibPath: "import { request } from '@umijs/max';",
    //是否启用mock
    mock: false,
    //后端的接口地址，自行替换+/v2/api-docs
    // schemaPath: 'http://192.168.11.83:8083/v3/api-docs',
    // schemaPath: 'http://192.168.11.83:8088/v3/api-docs',
    schemaPath: 'http://192.168.183.83:8086/v3/api-docs',
    // schemaPath: 'http://192.168.79.83:8086/v3/api-docs',
    // schemaPath: 'http://192.168.183.83:8087/v3/api-docs',
    //希望在哪个文件夹生成
    projectName: 'DataAsset',
    //命名空间qiao
    namespace: 'dataFactory',
  },
  layout: {
    title: '@umijs/max',
  },
  routes: [
    {
      path: '/',
      component: './Login',
      layout: false,
    },
    {
      name: '数据工厂',
      path: '/home',
      component: './Home',
      routes:[
      //   {
      //     name: '权限演示',
      //     path: '/home/access',
      //     component: './Access',
      //   },
      //   {
      //     name:'CRUD 示例',
      //     path: '/home/table',
      //     component: './Table'
      //   },
        {
          name:'数据源管理',
          path: '/home/datasource',
          routes:[
            {
              name:'接口管理',
              path: '/home/datasource/api',
              component: './DataSource/Api',
            },
            {
              name:'数据库管理',
              path: '/home/datasource/db',
              component: './DataSource/Db',
            }
          ]
        },
        {
          name:'数据标准管理',
          path: '/home/datastandard',
          routes:[
            {
              name:'数据标准目录',
              path: '/home/datastandard/catalog',
              component: './DataStandard/Catalog',
            },
            {
              name:'码表管理',
              path: '/home/datastandard/codetable',
              component: './DataStandard/CodeTable',
            }
          ]
        },
        {
          name:'数据资产管理',
          path: '/home/dataasset',
          component: './DataAsset',
        },
        {
          name:'脚本管理',
          path: '/home/script',
          component: './Script',
        },
        {
          name:'任务管理',
          path: '/home/task',
          component: './Task',
        }
      ]
    },
    
    
  ],
  npmClient: 'pnpm',
});

