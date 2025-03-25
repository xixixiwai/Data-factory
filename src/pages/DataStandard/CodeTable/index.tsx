import { useRef, useState } from 'react';
import CodeForm from './components/CodeForm';
import { request } from '@umijs/max';
import { ProTable, ActionType, ProColumns,ProFormUploadButton } from '@ant-design/pro-components';
import { Tag, Button, message, Modal, Table,Upload } from 'antd';
import { PlusOutlined, ImportOutlined } from '@ant-design/icons';
import services from '@/services/CodeTable';
import CodeTableDetail from './components/codeTableDetail'; 
const { queryCodeListUsingPost, deleteCodeTableUsingDelete,updateCodeTableStatusUsingPut,exportExcelUsingGet,importCodeTableUsingPost } = services.mabiaoguanli;

type CodeTable = {
  id: string;
  name: string;
  description: string;
  status: '待发布' | '已发布' | '已停用';
  updateTime: string;
  codeMsgPList: Array<{
    mean: string;
    name: string;
    value: string;
    codeTbId: string;
  }>;
};

export default function CodeTableManagement() {
  const actionRef = useRef<ActionType>(); // 用于刷新表格数据
  const [modalVisible, setModalVisible] = useState(false); // 用于控制模态框的显示与隐藏新增/编辑
  //控制停用/启用模态框
  const [disableModalVisible, setDisableModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false); // 是否是编辑模式
  const [currentRecord, setCurrentRecord] = useState<CodeTable | null>(null); // 当前操作的记录
  const [selectedRows, setSelectedRows] = useState<CodeTable[]>(); // 用于存储选中的行数据（批量操作）
  const [batchActionType, setBatchActionType] = useState<'publish' | 'disable'>(); // 用于存储批量操作类型
  const [codeTableDetailVisible, setCodeTableDetailVisible] = useState(false); // 控制码表详情模态框的显示与隐藏
  const [codeTableDetail, setCodeTableDetail] = useState<CodeTable['codeMsgPList']>([]); // 用于存储码表详情数据
  const [codeTableIds, setCodeTableIds] = useState<string[]>([]); // 用于存储码表ID,用于批量操作
  // 状态映射关系
  const statusMap = {
    '待发布': 0,
    '已发布': 1,
    '已停用': 2,
  };

  // 处理批量操作
  const handleBatchAction = async () => {
    try {
      await request('/api/api-standard/codeTable/batchUpdate', {
        method: 'POST',
        data: {
          ids: selectedRows.map(row => row.id),
          action: batchActionType,
        },
      });
      message.success(`${batchActionType === 'publish' ? '发布' : '停用'}成功`);
      actionRef.current?.reload();
      actionRef.current?.clearSelected?.();
    } catch (error) {
      message.error('操作失败');
    } finally {
      setDisableModalVisible(false);
    }
  };

  // 列定义
  const columns: ProColumns<CodeTable>[] = [
    {
      title: '码表编号',
      dataIndex: 'id',
      width: 150,
      search: false,
      render: (text, record) => (
        <span
          style={{ cursor: 'pointer', color: 'blue' }}
          onClick={() => {
            console.log('record', record); // 打印整个 record 对象
            console.log('record.codeMsgPList', record.codeMsgPList); // 打印 codeMsgPList 字段
            if (record.codeMsgPList) {
              setCodeTableDetail(record.codeMsgPList);
            } else {
              console.error('codeMsgPList字段不存在');
            }
            setCodeTableDetailVisible(true);
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: '码表名称',
      dataIndex: 'name',
      width: 150,
      search: {
        transform: (value) => ({ name: value }),
      },
    },
    {
      title: '码表说明',
      dataIndex: 'description',
      width: 300,
      search: false,
    },
    {
      title: '码表状态',
      dataIndex: 'status',
      valueType: 'select',
      initialValue: '已发布',
      valueEnum: {
        '待发布': { text: '待发布' },
        '已发布': { text: '已发布' },
        '已停用': { text: '已停用' },
      },
      search: {
        transform: (value) => ({ status: statusMap[value] }),// 将状态映射为数字
      },
      render: (_, record) => (
        <Tag color={record.status === '已发布' ? 'green' : record.status === '已停用' ? 'red' : 'orange'}>
          {record.status}
        </Tag>
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        (record.status === '待发布' || record.status === '已停用') && (
          <a
            key="publish"
            onClick={() => {
              Modal.confirm({
                title: '确认发布',
                content: '确定要发布该码表吗？',
                onOk: async () => {
                  try {
                  
                    await updateCodeTableStatusUsingPut({
                      codeTableIds: [record.id],
                      status: 1,
                    })

                    actionRef.current?.reload();
                    message.success('发布成功');
                  } catch (error) {
                    message.error('发布失败');
                  }
                },
              });
            }}
          >
            发布
          </a>
        ),
        record.status === '已发布' && (
          <a
            key="disable"
            onClick={() => {
              Modal.confirm({
                title: '确认停用',
                content: '确定要停用该码表吗？',
                onOk: async () => {
                  try {
                    await updateCodeTableStatusUsingPut({
                      codeTableIds: [record.id],
                      status: 2,
                    })
                    actionRef.current?.reload();
                    message.success('停用成功');
                  } catch (error) {
                    message.error('停用失败');
                  }
                },
              });
            }}
          >
            停用
          </a>
        ),
        (record.status === '待发布' || record.status === '已停用') && (
          <a
            key="edit"
            onClick={() => {
              setCurrentRecord(record); // 设置当前操作的记录
              setIsEdit(true); // 设置为编辑模式
              setModalVisible(true);
            }}
          >
            编辑
          </a>
        ),
        record.status === '待发布' && (
          <a
            key="delete"
            onClick={() => {
              Modal.confirm({
                title: '确认删除',
                content: '确定要删除该码表吗？',
                onOk: async () => {
                  try {
                    const res = await deleteCodeTableUsingDelete({ id: record.id });
                    console.log('res', res);
                    actionRef.current?.reload();
                    message.success('删除成功');
                  } catch (error) {
                    message.error('删除失败');
                  }
                },
              });
            }}
          >
            删除
          </a>
        ),
      ].filter(Boolean),
    },
  ];

  return (
    <>
      <ProTable<CodeTable>
        rowSelection={{// 行选择
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
        actionRef={actionRef}// 表格操作引用
        columns={columns}
        rowKey="id"
        pagination={{
          showTotal: (total) => `共 ${total} 条`,
          showSizeChanger: true, // 显示分页大小选择器
          showQuickJumper: true, // 显示快速跳转输入框
          pageSizeOptions: ['10', '20', '50', '100'],
        }}
        request={async (params = {}) => {
          try {
            const body: dataFactory.CodeQueryDTO = {
              name: params.name || '',
              status: params.status || 0,
              currentPage: params.current || 1,
              pageSize: params.pageSize || 20,
            };
            console.log('调用前', body);

            const response = await queryCodeListUsingPost(body);
            console.log('response', response);
            console.log('selectedRows', selectedRows);
            
            return {
              data: response.data.records,
              total: response.data.total,
              success: true,
            };
          } catch (error) {
            console.error('获取数据失败:', error);
            return {
              data: [],
              total: 0,
              success: false,
            };
          }
        }}
        search={{ defaultCollapsed: false }}
        headerTitle={
          <>
            <Button
            key="batchPublish"
            
            onClick={() => {
              Modal.confirm({
                title: '确认批量发布',
                content: `确定要发布选中的 ${selectedRows.length} 个码表吗？`,
                onOk: async () => {
                  try {
                    await updateCodeTableStatusUsingPut({
                      codeTableIds: selectedRows.map((row) => row.id),
                      status: 1,
                    }
                    )
                    message.success('批量发布成功');
                    //清空已选择的
                    setSelectedRows([]);
                    actionRef.current?.reload();
                  } catch (error) {
                    message.error('批量发布失败');
                  }
                },
                onCancel() {
                  console.log('Cancel');
                },
              });
            }}
          >
            批量发布
          </Button>
            <Button
            key="batchDisable"
            
            onClick={() => {
              Modal.confirm({
                title: '确认批量停用',
                content: selectedRows?.length?`确定要停用选中的 ${selectedRows.length} 个码表吗？`: '请选择要停用的码表',
                onOk: async () => {
                  try {
                    await updateCodeTableStatusUsingPut({
                      codeTableIds: selectedRows.map((row) => row.id),
                      status: 2,
                    }
                    )
                    message.success('批量停用成功');
                    //清空已选择的
                    setSelectedRows([]);
                    actionRef.current?.reload();
                  } catch (error) {
                    message.error('批量停用失败');
                  }
                },
                onCancel() {
                  console.log('Cancel');
                },
              });
            }}
          >
            批量停用
          </Button>
            
          </>
        }
        toolBarRender={() => [
          <Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => {
            setCurrentRecord(null); // 清空当前记录
            setIsEdit(false); // 设置为新增模式
            setModalVisible(true);
          }}>
            新增码表
          </Button>,
           <Upload
            key="import"
            accept=".xlsx, .xls"
            beforeUpload={async (file) => {
              try {
                const formData = new FormData();
                formData.append('file', file);

                await importCodeTableUsingPost({}, file);
                message.success('导入成功');
                actionRef.current?.reload();
                return false; // 阻止默认上传行为
              } catch (error) {
                message.error('导入失败');
                return false;
              }
            }}
          >
            <Button icon={<ImportOutlined />}>
              码表导入
            </Button>
          </Upload>,
          <Button
          key="template"
          onClick={async () => { // 移除无用参数 `res`
            try {
              // 1. 明确配置请求参数：要求返回二进制流
              const response = await exportExcelUsingGet({
                responseType: 'blob', // 关键配置
                headers: {
                  Accept: 'application/vnd.ms-excel' // 强制要求返回 Excel 格式
                }
              });
            
              console.log('response.data', response); // 检查数据是否为 Blob
            
              // 2. 直接使用 response.data 生成 Blob（无需 new Blob）
              const url = window.URL.createObjectURL(response);
              const link = document.createElement('a');
              link.href = url;
              link.download = '码表模板.xls'; // 与后端返回的 Content-Disposition 一致
              link.style.display = 'none';
            
              document.body.appendChild(link);
              link.click();
            
              // 3. 清理资源
              window.URL.revokeObjectURL(url); // 释放内存
              document.body.removeChild(link);
            
              message.success('下载成功');
            } catch (error) {
              message.error('下载失败');
            }
          }}
        >
          模板下载
        </Button>
        ]}
      />

      <Modal
        title={`确认${batchActionType === 'publish' ? '发布' : '停用'}`}
        open={disableModalVisible}
        onOk={handleBatchAction}
        onCancel={() => setDisableModalVisible(false)}
      >
        <p>
        </p>
      </Modal>

      <CodeForm
        modalVisible={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setIsEdit(false);
          setCurrentRecord(null);
        }}
        onSuccess={() => {
          setModalVisible(false);
          setIsEdit(false);
          setCurrentRecord(null);
          actionRef.current?.reload();
        }}
        record={currentRecord}
        isEdit={isEdit}
      />

      {/* 码表详情模块窗 */}
      <CodeTableDetail
        visible={codeTableDetailVisible}
        onCancel={() => setCodeTableDetailVisible(false)}
        codeTableDetail={codeTableDetail}
      />
    </>
  );
}