// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 邮箱+密码登录 POST /user/login */
export async function getAwardCountUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: dataFactory.getAwardCountUsingPOSTParams,
  options?: { [key: string]: any },
) {
  return request<dataFactory.Robject>('/api/user/login', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 登出 POST /user/logOut */
export async function logoutUsingPost(options?: { [key: string]: any }) {
  return request<dataFactory.Robject>('/api/user/logOut', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 注册用户 POST /user/register */
export async function registerUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: dataFactory.registerUsingPOSTParams,
  options?: { [key: string]: any },
) {
  return request<dataFactory.Robject>('/api/user/register', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
