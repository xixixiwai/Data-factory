// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 新增数据库 新增数据库 POST /database-table/addDataBase */
export async function addDataBaseUsingPost(
  body: dataFactory.AddDatabaseDTO,
  options?: { [key: string]: any },
) {
  return request<dataFactory.Robject>('/api/database-table/addDataBase', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除数据库 删除数据库 DELETE /database-table/deleteDatabase */
export async function deleteDataBaseUsingDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: dataFactory.deleteDataBaseUsingDELETEParams,
  options?: { [key: string]: any },
) {
  return request<dataFactory.Robject>('/api/database-table/deleteDatabase', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 条件查询数据库 条件查询数据库 POST /database-table/queryDbList */
export async function queryDbListUsingPost(
  body: dataFactory.QueryDbListDTO,
  options?: { [key: string]: any },
) {
  return request<dataFactory.Robject>('/api/database-table/queryDbList', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 数据源连通性测试 数据源连通性测试 POST /database-table/testConnection */
export async function testConnectionUsingPost(
  body: dataFactory.TestDbDTO,
  options?: { [key: string]: any },
) {
  return request<dataFactory.Robject>('/api/database-table/testConnection', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 修改数据库 修改数据库 PUT /database-table/updateDatabase */
export async function updateDataBaseUsingPut(
  body: dataFactory.UpdateDbDTO,
  options?: { [key: string]: any },
) {
  return request<dataFactory.Robject>('/api/database-table/updateDatabase', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 修改数据库状态 修改数据库状态 PUT /database-table/updateDbStatus */
export async function updateDbStatusUsingPut(
  body: dataFactory.UpdateStatusDTO,
  options?: { [key: string]: any },
) {
  return request<dataFactory.Robject>('/api/database-table/updateDbStatus', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
