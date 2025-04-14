// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 新增Python脚本信息 POST /python-script/add-script-info */
export async function addScriptInfoUsingPost(
  body: dataFactory.xinzengjiaobenxinxifengzhuanglei,
  options?: { [key: string]: any },
) {
  return request<dataFactory.R>('/api/python-script/add-script-info', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 批量修改脚本状态 PUT /python-script/batchUpdatePythonScriptStatus */
export async function batchUpdatePythonScriptStatusUsingPut(
  body: dataFactory.pilianggengxinjiaobenzhuangtai,
  options?: { [key: string]: any },
) {
  return request<dataFactory.Robject>(
    '/api/python-script/batchUpdatePythonScriptStatus',
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

/** 批量分类脚本 PUT /python-script/classifyPythonScript */
export async function classifyPythonScriptUsingPut(
  body: dataFactory.piliangfenleijiaobenfengzhuanglei,
  options?: { [key: string]: any },
) {
  return request<dataFactory.Robject>('/api/python-script/classifyPythonScript', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除脚本 DELETE /python-script/deletePythonScript */
export async function deletePythonScriptUsingDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: dataFactory.deletePythonScriptUsingDELETEParams,
  options?: { [key: string]: any },
) {
  return request<dataFactory.Robject>('/api/python-script/deletePythonScript', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 查询脚本信息 POST /python-script/queryPythonScript */
export async function queryPythonScriptUsingPost(
  body: dataFactory.chaxunjiaobenxinxifengzhuanglei,
  options?: { [key: string]: any },
) {
  return request<dataFactory.Robject>('/api/python-script/queryPythonScript', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 测试脚本 POST /python-script/testPythonScript */
export async function testPythonScriptUsingPost(
  body: dataFactory.ceshijiaobenxinxifengzhuanglei,
  options?: { [key: string]: any },
) {
  return request<dataFactory.Robject>('/api/python-script/testPythonScript', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新脚本 PUT /python-script/updatePythonScript */
export async function updatePythoScriptUsingPut(
  body: {
    /** 脚本信息 */
    updatePythonScriptDTO: dataFactory.xiugaijiaoben;
  },
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

  return request<dataFactory.Robject>('/api/python-script/updatePythonScript', {
    method: 'PUT',
    data: formData,
    requestType: 'form',
    ...(options || {}),
  });
}

/** 上传Python脚本文件 POST /python-script/upload-file */
export async function uploadFileUsingPost(
  body: {},
  files?: File,
  options?: { [key: string]: any },
) {
  const formData = new FormData();

  if (files) {
    formData.append('files', files);
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

  return request<dataFactory.R>('/api/python-script/upload-file', {
    method: 'POST',
    data: formData,
    requestType: 'form',
    ...(options || {}),
  });
}
