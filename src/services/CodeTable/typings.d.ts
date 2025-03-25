declare namespace dataFactory {
  type AddCodeTBDTO = {
    /** 码表详细说明 */
    description?: string;
    /** 码表名称 */
    name?: string;
  };

  type BatchUpdateCodeTableStatusDTO = {
    codeTableIds?: string[];
    status?: number;
  };

  type CodeMsgP = {
    codeTbId?: string;
    id?: number;
    mean?: string;
    name?: string;
    value?: string;
  };

  type CodeMsgPP = {
    mean?: string;
    name?: string;
    value?: string;
  };

  type CodeQueryDTO = {
    currentPage: number;
    name?: string;
    pageSize: number;
    status?: number;
  };

  type CodeTbP = {
    description?: string;
    id: string;
    name: string;
    status: number;
  };

  type deleteCodeMsgUsingDELETEParams = {
    /** id */
    id: number;
  };

  type deleteCodeTableUsingDELETEParams = {
    /** id */
    id: string;
  };

  type importCodeTableUsingPOSTParams = {
    /** 文件 */
    file: string;
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

  type Robject = {
    code?: number;
    data?: Record<string, any>;
    msg?: string;
  };

  type tianjiamabiaoDTO = {
    /** 码表信息 */
    addCodeTBDTO?: AddCodeTBDTO;
    /** 码值 */
    codeMsgList?: CodeMsgPP[];
  };

  type UpdateCodeTableDTO = {
    codeMsgPList?: CodeMsgP[];
    codeTb?: CodeTbP;
  };

  type View = {
    contentType?: string;
  };
}
