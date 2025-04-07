// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 新增接口 新增接口 POST /interface-directory/addDir */
export async function addDirUsingPost(
  body: dataFactory.xinzengjiekouxinxifengzhuanglei,
  options?: { [key: string]: any },
) {
  return request<dataFactory.Robject>('/api/interface-directory/addDir', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 批量分类接口 批量分类接口 POST /interface-directory/batchCategorize */
export async function batchCategorizeUsingPost(
  body: dataFactory.BatchCategorizeDTO,
  options?: { [key: string]: any },
) {
  return request<dataFactory.Robject>('/api/interface-directory/batchCategorize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 批量修改接口状态 批量修改接口状态 PUT /interface-directory/batchUpdateStatus */
export async function batchUpdateStatusUsingPut(
  body: dataFactory.BatchUpdateStatusDTO,
  options?: { [key: string]: any },
) {
  return request<dataFactory.Robject>(
    '/api/interface-directory/batchUpdateStatus',
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    },
  );
}

/** 删除接口 删除接口 DELETE /interface-directory/delete */
export async function deleteUsingDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: dataFactory.deleteUsingDELETEParams,
  options?: { [key: string]: any },
) {
  return request<dataFactory.Robject>('/api/interface-directory/delete', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 根据id查询接口 根据id查询接口 GET /interface-directory/getById */
export async function queryByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: dataFactory.queryByIdUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<dataFactory.Robject>('/api/interface-directory/getById', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 条件查询接口 条件查询接口 POST /interface-directory/query */
export async function queryUsingPost(
  body: dataFactory.InterfaceQueryDTO,
  options?: { [key: string]: any },
) {
  return request<dataFactory.Robject>('/api/interface-directory/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 测试接口 POST /interface-directory/test */
export async function testUsingPost(
  body: dataFactory.InterFaceTestDTO,
  options?: { [key: string]: any },
) {
  return request<dataFactory.Robject>('/api/interface-directory/test', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 根据id更新接口 根据id更新接口 PUT /interface-directory/update */
export async function updateUsingPut(
  body: dataFactory.gengxinjiekouxinxifengzhuanglei,
  options?: { [key: string]: any },
) {
  return request<dataFactory.Robject>('/api/interface-directory/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
