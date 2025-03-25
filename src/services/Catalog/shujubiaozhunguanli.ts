// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 新增数据标准 新增数据标准 POST /data-standard/addDataStandard */
export async function addDataStandardUsingPost(
  body: dataFactory.AddDataStandardDTO,
  options?: { [key: string]: any },
) {
  return request<dataFactory.Robject>('/api/data-standard/addDataStandard', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除数据标准 删除数据标准 DELETE /data-standard/deleteDataStandard */
export async function deleteDataStandardUsingDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: dataFactory.deleteDataStandardUsingDELETEParams,
  options?: { [key: string]: any },
) {
  return request<dataFactory.Robject>('/api/data-standard/deleteDataStandard', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 标准模板下载 GET /data-standard/excel/download */
export async function exportExcelUsingGet(options?: { [key: string]: any }) {
  return request<any>('/api/data-standard/excel/download', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 导入数据标准 POST /data-standard/excel/import */
export async function importExcelUsingPost(
  body: {},
  file?: File,
  options?: { [key: string]: any },
) {
  const formData = new FormData();

  if (file) {
    formData.append('file', file);
  }

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele];

    if (item !== undefined && item !== null) {
      if (typeof item === 'object' && !(item instanceof File)) {
        if (item instanceof Array) {
          item.forEach((f) => formData.append(ele, f || ''));
        } else {
          formData.append(ele, JSON.stringify(item));
        }
      } else {
        formData.append(ele, item);
      }
    }
  });

  return request<dataFactory.Robject>('/api/data-standard/excel/import', {
    method: 'POST',
    data: formData,
    requestType: 'form',
    ...(options || {}),
  });
}

/** 条件查询数据标准 条件查询数据标准 POST /data-standard/queryDataStandard */
export async function queryDataStandardUsingPost(
  body: dataFactory.QueryDataStandardDTO,
  options?: { [key: string]: any },
) {
  return request<dataFactory.Robject>('/api/data-standard/queryDataStandard', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 修改数据标准 修改数据标准 PUT /data-standard/updateDataStandard */
export async function updateDataStandardUsingPut(
  body: dataFactory.UpdateDataStandardDTO,
  options?: { [key: string]: any },
) {
  return request<dataFactory.Robject>('/api/data-standard/updateDataStandard', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 批量修改数据标准状态 批量修改数据标准状态 PUT /data-standard/updateDataStandardStatus */
export async function updateDataStandardStatusUsingPut(
  body: dataFactory.BatchUpdateStatusDTO,
  options?: { [key: string]: any },
) {
  return request<dataFactory.Robject>(
    '/api/data-standard/updateDataStandardStatus',
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
