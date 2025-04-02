declare namespace dataFactory {
  type ceshijiaobenxinxifengzhuanglei = {
    /** 脚本的地址 */
    address: string;
    /** 类名 */
    className: string;
    /** 函数名 */
    funcName: string;
    /** 脚本编号，脚本记录的唯一标识，整数类型，自增长 */
    id: number;
    /** 脚本的名称 */
    name: string;
    requestParams: jiaobenrucanxinxi[];
  };

  type chaxunjiaobenxinxifengzhuanglei = {
    /** 脚本分类目录编号，关联脚本分类 */
    classified?: number;
    /** 脚本的编号 */
    id?: number;
    /** 脚本的名称，必须唯一 */
    name?: string;
    pageNumber: number;
    pageSize: number;
    /** 脚本的状态，0 表示未发布，1 表示已发布，2 表示已停用 */
    status?: number;
  };

  type deletePythonScriptUsingDELETEParams = {
    /** id */
    id: number;
  };

  type jiaobenchucanxinxi = {
    /** 数据类型只能为数字(1-Int、2-Float、3-String) */
    dataOutType: number;
    /** 出参参数名称 */
    paramOutName: string;
    /** 出参参数说明 */
    paramOutdescription: string;
  };

  type jiaobenrucanxinxi = {
    /** 数据类型只能为数字(1-Int、2-Float、3-String) */
    dataInType: number;
    /** 参数值 */
    dataInValue: string;
    /** 是否必须 */
    isRequired: number;
    /** 入参参数名称 */
    paramInName: string;
    /** 入参参数说明 */
    paramIndescription?: string;
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

  type piliangfenleijiaobenfengzhuanglei = {
    /** 分类目录编号 */
    directoryId: number;
    /** 脚本编号列表 */
    pythonScriptId: number[];
  };

  type pilianggengxinjiaobenzhuangtai = {
    /** 脚本编号数组 */
    ids: number[];
    /** 操作 1 代表把status为0和2的修改为1， 2代表把status为1的修改为2 */
    method: number;
  };

  type Robject = {
    code?: number;
    data?: Record<string, any>;
    msg?: string;
  };

  type View = {
    contentType?: string;
  };

  type xinzengjiaobenxinxifengzhuanglei = {
    /** 类名 */
    className: string;
    /** 脚本的分类目录编号 */
    classified: number;
    /** 任务的描述 */
    description?: string;
    /** 函数名 */
    funcName: string;
    /** 脚本的名称 */
    name: string;
    /** 输入参数 */
    requestParams: jiaobenrucanxinxi[];
    /** 输出参数 */
    responseParams: jiaobenchucanxinxi[];
    /** 脚本的状态，0 表示未发布，1 表示已发布，2 表示已停用 */
    status: number;
    /** 脚本的类型 */
    style: string;
  };

  type xiugaijiaoben = {
    /** 类名 */
    className: string;
    /** 脚本分类目录编号 */
    classified: number;
    /** 任务的描述 */
    description?: string;
    /** 函数名 */
    funcName: string;
    /** 脚本编号 */
    id: number;
    /** 脚本的名称 */
    name: string;
    /** 请求参数 */
    requestParams: jiaobenrucanxinxi[];
    /** 响应参数 */
    responseParams: jiaobenchucanxinxi[];
    /** 脚本的状态，0 表示未发布，1 表示已发布，2 表示已停用 */
    status: number;
    /** 脚本的类型 */
    style: string;
  };
}
