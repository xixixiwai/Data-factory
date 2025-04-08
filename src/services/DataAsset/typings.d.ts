declare namespace dataFactory {
  type AddDataAssetsDTO = {
    chName: string;
    daFieldList: DaFieldList[];
    description: string;
    directoryIds: string;
    enName: string;
  };

  type AddFieldDTO = {
    assetsId: number;
    chName: string;
    dataStandardId?: string;
    description?: string;
    enName: string;
  };

  type DaFieldList = {
    chName?: string;
    dataStandardId?: string;
    description?: string;
    enName?: string;
  };

  type deleteDataAssetFieldUsingDELETEParams = {
    /** id */
    id?: number;
  };

  type deleteDataAssetUsingDELETEParams = {
    /** id */
    id?: number;
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

  type queryDataAssetListUsingPOSTParams = {
    chName?: string;
    currentPage: number;
    directoryName?: string;
    enName?: string;
    pageSize: number;
    status?: number;
  };

  type queryDirectoryListUsingGETParams = {
    /** name */
    name: string;
  };

  type Robject = {
    code?: number;
    data?: Record<string, any>;
    msg?: string;
  };

  type UpdateDaFieldList = {
    assetsId?: number;
    chName?: string;
    dataStandardId?: string;
    description?: string;
    enName?: string;
    id: number;
  };

  type UpdateDataAssetsDTO = {
    chName?: string;
    description?: string;
    directoryIds?: string;
    enName?: string;
    id?: number;
    updateDaFieldLists?: UpdateDaFieldList[];
  };

  type UpdateFieldDTO = {
    chName: string;
    dataStandardId?: string;
    description?: string;
    enName: string;
    id: number;
  };

  type updateStatusUsingPUTParams = {
    ids?: number[];
    status?: number;
  };

  type View = {
    contentType?: string;
  };
}
