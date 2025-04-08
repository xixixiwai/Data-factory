// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 新增资产 新增资产 POST /data-assets/addDataAsset */
export async function addDataAssetUsingPost(
  body: dataFactory.AddDataAssetsDTO,
  options?: { [key: string]: any },
) {
  return request<dataFactory.Robject>('/api/data-assets/addDataAsset', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 新增字段 新增字段 POST /data-assets/addDataAssetField */
export async function addDataAssetFieldUsingPost(
  body: dataFactory.AddFieldDTO,
  options?: { [key: string]: any },
) {
  return request<dataFactory.Robject>('/api/data-assets/addDataAssetField', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除资产 删除资产 DELETE /data-assets/deleteDataAsset */
export async function deleteDataAssetUsingDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: dataFactory.deleteDataAssetUsingDELETEParams,
  options?: { [key: string]: any },
) {
  return request<dataFactory.Robject>('/api/data-assets/deleteDataAsset', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 删除资产字段 删除资产字段 DELETE /data-assets/deleteDataAssetField */
export async function deleteDataAssetFieldUsingDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: dataFactory.deleteDataAssetFieldUsingDELETEParams,
  options?: { [key: string]: any },
) {
  return request<dataFactory.Robject>('/api/data-assets/deleteDataAssetField', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 修改字段 修改字段 PUT /data-assets/editDataAssetField */
export async function updateDataAssetFieldUsingPut(
  body: dataFactory.UpdateFieldDTO,
  options?: { [key: string]: any },
) {
  return request<dataFactory.Robject>('/api/data-assets/editDataAssetField', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 条件查询资产 条件查询资产 POST /data-assets/queryDataAssetList */
export async function queryDataAssetListUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: dataFactory.queryDataAssetListUsingPOSTParams,
  options?: { [key: string]: any },
) {
  return request<dataFactory.Robject>('/api/data-assets/queryDataAssetList', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 条件查询数据资产表目录 条件查询数据资产表目录 GET /data-assets/queryDirectoryList */
export async function queryDirectoryListUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: dataFactory.queryDirectoryListUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<dataFactory.Robject>('/api/data-assets/queryDirectoryList', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 修改资产 修改资产 PUT /data-assets/updateDataAsset */
export async function updateDataAssetUsingPut(
  body: dataFactory.UpdateDataAssetsDTO,
  options?: { [key: string]: any },
) {
  return request<dataFactory.Robject>('/api/data-assets/updateDataAsset', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 批量修改状态 批量修改状态 PUT /data-assets/updateStatus */
export async function updateStatusUsingPut(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: dataFactory.updateStatusUsingPUTParams,
  options?: { [key: string]: any },
) {
  return request<dataFactory.Robject>('/api/data-assets/updateStatus', {
    method: 'PUT',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
