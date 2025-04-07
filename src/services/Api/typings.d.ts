declare namespace dataFactory {
  type BatchCategorizeDTO = {
    directoryId: number;
    interfaceIds: number[];
  };

  type BatchUpdateStatusDTO = {
    ids?: number[];
    status?: number;
  };

  type deleteUsingDELETEParams = {
    /** id */
    id: number;
  };

  type gengxinjiekouxinxifengzhuanglei = {
    /** 请求协议，如 HTTP、HTTPS 等,0是HTTP 1是HTTPS */
    agreement: number;
    /** 接口的详细说明 */
    description?: string;
    /** 接口编号 */
    id: number;
    /** IP 端口 */
    ip: string;
    /** 请求方式，如 GET、POST 等 0是GET 1是POST */
    method: number;
    /** 接口的名称，用于识别接口 */
    name: string;
    /** Path */
    path: string;
    /** 输入 body，JSON 类型 */
    requestBodyList: Record<string, any>[];
    /** 输入参数，JSON 类型 */
    requestParamList: Record<string, any>[];
    /** 输出参数，JSON 类型 */
    responseList: Response[];
    /** 接口的来源 */
    source: string;
    /** 判断更新的时候这个是否是草稿,3代表这个是草稿，不输入的话代表这个不是草稿 */
    status?: number;
    /** 超时时间，默认时间是30s */
    timeout: number;
    /** 接口分类目录编号，关联接口分类 */
    type: number;
  };

  type InterfaceQueryDTO = {
    currentPage: number;
    name?: string;
    pageSize: number;
    source?: string;
    status?: number;
    type?: number;
  };

  type InterFaceTestDTO = {
    /** 接口编号 */
    id?: number;
    /** 请求Body */
    inputBody?: jiekouceshiqingqiuBody[];
    /** 输入参数 */
    inputParam?: jiekouceshishurucanshu[];
  };

  type jiekouceshiqingqiuBody = {
    /** 请求Body参数字段 */
    inputBody?: jiekouceshishurucanshu[];
    /** 请求Body名称 */
    name?: string;
  };

  type jiekouceshishurucanshu = {
    /** 参数名 */
    key?: string;
    /** 参数值 */
    value?: string;
  };

  type ModelAndView = {
    empty?: boolean;
    model?: Record<string, any>;
    modelMap?: Record<string, any>;
    reference?: boolean;
    status?:
      | 'ACCEPTED'
      | 'ALREADY_REPORTED'
      | 'BAD_GATEWAY'
      | 'BAD_REQUEST'
      | 'BANDWIDTH_LIMIT_EXCEEDED'
      | 'CHECKPOINT'
      | 'CONFLICT'
      | 'CONTINUE'
      | 'CREATED'
      | 'DESTINATION_LOCKED'
      | 'EXPECTATION_FAILED'
      | 'FAILED_DEPENDENCY'
      | 'FORBIDDEN'
      | 'FOUND'
      | 'GATEWAY_TIMEOUT'
      | 'GONE'
      | 'HTTP_VERSION_NOT_SUPPORTED'
      | 'IM_USED'
      | 'INSUFFICIENT_SPACE_ON_RESOURCE'
      | 'INSUFFICIENT_STORAGE'
      | 'INTERNAL_SERVER_ERROR'
      | 'I_AM_A_TEAPOT'
      | 'LENGTH_REQUIRED'
      | 'LOCKED'
      | 'LOOP_DETECTED'
      | 'METHOD_FAILURE'
      | 'METHOD_NOT_ALLOWED'
      | 'MOVED_PERMANENTLY'
      | 'MOVED_TEMPORARILY'
      | 'MULTIPLE_CHOICES'
      | 'MULTI_STATUS'
      | 'NETWORK_AUTHENTICATION_REQUIRED'
      | 'NON_AUTHORITATIVE_INFORMATION'
      | 'NOT_ACCEPTABLE'
      | 'NOT_EXTENDED'
      | 'NOT_FOUND'
      | 'NOT_IMPLEMENTED'
      | 'NOT_MODIFIED'
      | 'NO_CONTENT'
      | 'OK'
      | 'PARTIAL_CONTENT'
      | 'PAYLOAD_TOO_LARGE'
      | 'PAYMENT_REQUIRED'
      | 'PERMANENT_REDIRECT'
      | 'PRECONDITION_FAILED'
      | 'PRECONDITION_REQUIRED'
      | 'PROCESSING'
      | 'PROXY_AUTHENTICATION_REQUIRED'
      | 'REQUESTED_RANGE_NOT_SATISFIABLE'
      | 'REQUEST_ENTITY_TOO_LARGE'
      | 'REQUEST_HEADER_FIELDS_TOO_LARGE'
      | 'REQUEST_TIMEOUT'
      | 'REQUEST_URI_TOO_LONG'
      | 'RESET_CONTENT'
      | 'SEE_OTHER'
      | 'SERVICE_UNAVAILABLE'
      | 'SWITCHING_PROTOCOLS'
      | 'TEMPORARY_REDIRECT'
      | 'TOO_EARLY'
      | 'TOO_MANY_REQUESTS'
      | 'UNAUTHORIZED'
      | 'UNAVAILABLE_FOR_LEGAL_REASONS'
      | 'UNPROCESSABLE_ENTITY'
      | 'UNSUPPORTED_MEDIA_TYPE'
      | 'UPGRADE_REQUIRED'
      | 'URI_TOO_LONG'
      | 'USE_PROXY'
      | 'VARIANT_ALSO_NEGOTIATES';
    view?: View;
    viewName?: string;
  };

  type queryByIdUsingGETParams = {
    /** id */
    id: number;
  };

  type Response = {
    /** 下级返回参数 */
    children?: Response[];
    /** 数据类型只能为(3-String、1-Int、2-Float、0-Object、4-Array) */
    dataType?: number;
    /** 参数描述 */
    description?: string;
    /** 参数名称 */
    name?: string;
  };

  type Robject = {
    code?: number;
    data?: Record<string, any>;
    msg?: string;
  };

  type View = {
    contentType?: string;
  };

  type xinzengjiekouxinxifengzhuanglei = {
    /** 请求协议，如 HTTP、HTTPS 等,0是HTTP 1是HTTPS */
    agreement: number;
    /** 接口的详细说明 */
    description?: string;
    /** IP 端口 */
    ip: string;
    /** 请求方式，如 GET、POST 等 0是GET 1是POST */
    method: number;
    /** 接口的名称，用于识别接口 */
    name: string;
    /** Path */
    path: string;
    /** 输入 body，JSON 类型 */
    requestBodyList: Record<string, any>[];
    /** 输入参数，JSON 类型 */
    requestParamList: Record<string, any>[];
    /** 输出参数，JSON 类型 */
    responseList: Response[];
    /** 接口的来源,写死（数据服务、指标管理、决策引擎） */
    source: string;
    /** 判断新增的时候这个是否是草稿,3代表这个是草稿，不输入的话代表这个不是草稿 */
    status?: number;
    /** 超时时间，默认时间是30s */
    timeout: number;
    /** 接口分类目录编号，关联接口分类 */
    type: number;
  };
}
