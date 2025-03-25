// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 新增码表 POST /codeTable/addCodeTable */
export async function addCodeTableUsingPost(
  body: dataFactory.tianjiamabiaoDTO,
  options?: { [key: string]: any },
) {
  return request<dataFactory.Robject>('/api/codeTable/addCodeTable', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除码值 DELETE /codeTable/deleteCodeMsg */
export async function deleteCodeMsgUsingDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: dataFactory.deleteCodeMsgUsingDELETEParams,
  options?: { [key: string]: any },
) {
  return request<dataFactory.Robject>('/api/codeTable/deleteCodeMsg', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 删除码表 DELETE /codeTable/deleteCodeTable */
export async function deleteCodeTableUsingDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: dataFactory.deleteCodeTableUsingDELETEParams,
  options?: { [key: string]: any },
) {
  return request<dataFactory.Robject>('/api/codeTable/deleteCodeTable', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 码表模板下载 GET /codeTable/excel/download */
export async function exportExcelUsingGet(options?: { [key: string]: any }) {
  return request<any>('/api/codeTable/excel/download', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 导入码表 POST /codeTable/excel/import */
export async function importCodeTableUsingPost(
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

  return request<dataFactory.Robject>('/api/codeTable/excel/import', {
    method: 'POST',
    data: formData,
    requestType: 'form',
    ...(options || {}),
  });
}

/** 条件查询码表 POST /codeTable/queryCodeList */
export async function queryCodeListUsingPost(
  body: dataFactory.CodeQueryDTO,
  options?: { [key: string]: any },
) {
  return request<dataFactory.Robject>('/api/codeTable/queryCodeList', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 修改码表 PUT /codeTable/updateCodeTable */
export async function updateCodeTableUsingPut(
  body: dataFactory.UpdateCodeTableDTO,
  options?: { [key: string]: any },
) {
  return request<dataFactory.Robject>('/api/codeTable/updateCodeTable', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 批量修改码表状态 PUT /codeTable/updateCodeTableStatus */
export async function updateCodeTableStatusUsingPut(
  body: dataFactory.BatchUpdateCodeTableStatusDTO,
  options?: { [key: string]: any },
) {
  return request<dataFactory.Robject>('/api/codeTable/updateCodeTableStatus', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
