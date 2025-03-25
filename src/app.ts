// 运行时配置

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
import { defineApp } from '@umijs/max';
console.log('运行时配置文件被加载');
export const request = {
  requestInterceptors: [
    (url: string, options: any) => {
      console.log('请求拦截器触发,URL:', url); // 添加日志
      const token = localStorage.getItem('access_token');
      if (token) {
        options.headers = {
          ...options.headers,
          token: `${token}`,
        };
      }
      return { url, options };
    },
  ],
};
// 全局初始化数据配置
export async function getInitialState() {
  console.log('getInitialState 被调用');
  // 从 localStorage 中读取 token 和用户信息
  const token = localStorage.getItem('access_token');
  const userInfo = token ? { name: 'admin'} : undefined;
  console.log('userInfo:', userInfo);
  
  return {
    currentUser: userInfo, // 当前用户信息
    // settings: {}, // 其他全局设置
  };
}

export const layout = () => {
  console.log('layout 被调用');
  return {
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    title:'数据工厂',
    menu: {
      locale: false,// 不使用国际化

    },
    layout:'mix',
     logout: () => {
      localStorage.removeItem('access_token'); // 清除 token
      window.location.href = '/'; // 跳转到登录页
    },
  };
};

export default defineApp({
  request,
  getInitialState,
  layout,
})