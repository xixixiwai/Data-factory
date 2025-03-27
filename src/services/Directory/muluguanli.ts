// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 新增目录 新增目录 POST /directory/add */
export async function addUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: dataFactory.addUsingPOSTParams,
  options?: { [key: string]: any },
) {
  return request<dataFactory.Robject>('/api/directory/add', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 删除目录 删除目录 DELETE /directory/delete */
export async function deleteUsingDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: dataFactory.deleteUsingDELETEParams,
  options?: { [key: string]: any },
) {
  return request<dataFactory.Robject>('/api/directory/delete', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 编辑目录 编辑目录 PUT /directory/edit */
export async function editUsingPut(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: dataFactory.editUsingPUTParams,
  options?: { [key: string]: any },
) {
  return request<dataFactory.Robject>('/api/directory/edit', {
    method: 'PUT',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 判断id是否存在 判断id是否存在 GET /directory/existId */
export async function existIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: dataFactory.existIdUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<boolean>('/api/directory/existId', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 根据id获取所属目录 根据id获取所属目录 GET /directory/getResourceById */
export async function getDirectoryUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: dataFactory.getDirectoryUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<dataFactory.Robject>('/api/directory/getResourceById', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 根据ids批量获取所属目录 根据ids批量获取所属目录 GET /directory/getResourcesByIds */
export async function getResourcesByIdsUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: dataFactory.getResourcesByIdsUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<dataFactory.Robject>('/api/directory/getResourcesByIds', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取目录树形列表 获取目录树形列表 GET /directory/getTree */
export async function getTreeUsingGet(options?: { [key: string]: any }) {
  return request<dataFactory.Robject>('/api/directory/getTree', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 查询是否拥有子目录 查询是否拥有子目录 GET /directory/hasChild */
export async function hasChildUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: dataFactory.hasChildUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<boolean>('/api/directory/hasChild', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 根据名称获取目录 根据名称获取所有目录 GET /directory/searchByName */
export async function searchByNameUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: dataFactory.searchByNameUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<dataFactory.Directory[]>('/api/directory/searchByName', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 根据名称模糊查询目录及其子目录 根据名称模糊查询目录及其子目录 GET /directory/searchListAndChild */
export async function searchListAndChildUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: dataFactory.searchListAndChildUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<dataFactory.DirectoryListVO[]>(
    '/api/directory/searchListAndChild',
    {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    },
  );
}
