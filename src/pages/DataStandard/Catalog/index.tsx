import { useRef, useState, useEffect } from 'react';
import CataForm from './components/CataForm';
import { request } from '@umijs/max';
import { ProTable, ActionType, ProColumns, ProFormUploadButton } from '@ant-design/pro-components';
import { Tag, Button, message, Modal, Table, Upload } from 'antd';
import { PlusOutlined, ImportOutlined } from '@ant-design/icons';
import services from '@/services/Catalog';
import CodeTableDetail from '../CodeTable/components/codeTableDetail';
import service1 from '@/services/CodeTable';
// const { queryCodeListUsingPost, deleteCatalogUsingDelete,updateCatalogStatusUsingPut,exportExcelUsingGet,importCatalogUsingPost } = services.mabiaoguanli;
const { queryDataStandardUsingPost, deleteDataStandardUsingDelete, importExcelUsingPost, updateDataStandardStatusUsingPut, exportExcelUsingGet } = services.shujubiaozhunguanli
const { queryCodeListUsingPost } = service1.mabiaoguanli
type Catalog = {
  accuracy?: number;
  agency?: string;
  chName?: string;
  codeNum?: string;
  deleted?: number;
  description?: string;
  dftValue?: string;
  enName?: string;
  isEmpty?: number;
  length?: number;
  maxVal?: number;
  minVal?: number;
  status?: number;
  type?: string;
  valueRange?: number;
};

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
export default function CatalogManagement() {
  const actionRef = useRef<ActionType>(); // 用于刷新表格数据
  const [modalVisible, setModalVisible] = useState(false); // 用于控制模态框的显示与隐藏停用发布。。
  const [formModalVisible, setFormModalVisible] = useState(false);// 用于控制新增数据标准目录模态框的显示与隐藏
  const [isEdit, setIsEdit] = useState(false); // 是否是编辑模式
  const [currentRecord, setCurrentRecord] = useState<Catalog | null>(null); // 当前操作的记录
  const [selectedRows, setSelectedRows] = useState<Catalog[]>(); // 用于存储选中的行数据（批量操作）
  const [batchActionType, setBatchActionType] = useState<'publish' | 'disable'>(); // 用于存储批量操作类型
  const [CatalogDetailVisible, setCatalogDetailVisible] = useState(false); // 控制数据标准目录详情模态框的显示与隐藏
  const [CatalogDetail, setCatalogDetail] = useState<[]>([]); // 用于存储数据标准目录详情数据
  const [CatalogIds, setCatalogIds] = useState<string[]>([]); // 用于存储数据标准目录ID,用于批量操作
  const [codeTableDetailVisible, setCodeTableDetailVisible] = useState(false); // 控制码表详情模态框的显示与隐藏
  const [codeTableDetail, setCodeTableDetail] = useState<CodeTable['codeMsgPList']>([]); // 用于存储码表详情数据
  const [enumRange, setEnumRange] = useState<Record<string, string>>({}); // 枚举范围

  // 状态映射关系
  const statusMap = {
    '待发布': 0,
    '已发布': 1,
    '已停用': 2,
  };
  //获取所有码表名称
  const fetchCodeList = async () => {
    try {
      const response = await queryCodeListUsingPost({
        currentPage: 1,
        pageSize: 100,
        name: '',
        status: -1,
      });
      // console.log('response', response.data.records.name);
      const enumrange = response.data.records.map(item => item.name);
      console.log('enum', enumrange);

      const enumOptions = enumrange.reduce((acc, item) => {
        acc[item] = item;
        return acc;
      }, {} as Record<string, string>);
      setEnumRange(enumOptions);
      // return{
      //   data: enumrange,
      //   success: true,
      // }
      // const options = response.data.reduce((acc, item) => {
      //   acc[item.id] = item.name;
      //   return acc;
      // }, {} as Record<string, string>);
    } catch (error) {
      console.error('Error fetching code list:', error);
    }
  }
  // 处理批量操作
  const handleBatchAction = async () => {
    try {
      await request('/api/api-standard/Catalog/batchUpdate', {
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
      setModalVisible(false);
    }
  };

  const [agencyOptions, setAgencyOptions] = useState<Record<string, string>>({});// 列定义
  const columns: ProColumns<Catalog>[] = [
    {
      title: '标准编号',
      dataIndex: 'id',
      width: 150,
      render: (text, record) => (
        <span
          style={{ cursor: 'pointer', color: 'blue' }}
          onClick={() => {
            console.log('record', record); // 打印整个 record 对象
            setCatalogDetail([record]);
            console.log('catalogDetail', CatalogDetail);

            // if (record) {
            //   setCatalogDetail(record);
            // } else {
            //   console.error('codeMsgPList字段不存在');
            // }
            setCatalogDetailVisible(true);
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: '中文名称',
      dataIndex: 'chName',
      width: 150,

    },
    {
      title: '英文名称',
      dataIndex: 'enName',
      width: 300,
    },
    {
      title: '标准说明',
      dataIndex: 'description',
      width: 300,
      search: false,
    },
    {
      title: '来源机构',
      // dataIndex: 'source',
      dataIndex: 'agency',
      width: 300,
      valueType: 'select', // 指定搜索表单类型为下拉框
      valueEnum: agencyOptions, // 使用状态中的来源机构选项

    },
    {
      title: '数据类型',
      dataIndex: 'type',
      width: 300,
      search: false,

    },
    {
      title: '数据长度',
      dataIndex: 'length',
      width: 300,
      search: false,
    },
    {
      title: '数据精度',
      dataIndex: 'accuracy',
      width: 300,
      search: false
    },
    {
      title: '默认值',
      dataIndex: 'dftValue',
      width: 300,
      search: false
    },
    {
      title: '取值范围',
      dataIndex: 'valueRange',
      width: 300,
      search: false
    },
    {
      title: '枚举范围',
      dataIndex: 'codeNum',
      width: 300,
      search: false,
      render: (text, record) => (
        <span
          style={{ cursor: 'pointer', color: 'blue' }}
          onClick={async () => {
            setCodeTableDetailVisible(true);
            const res = await queryCodeListUsingPost({
              currentPage: 1,
              pageSize: 10,
              name: record.codeNum,
              status: -1,
            });
            console.log('res', res);
            console.log('res.data.records.codeMsgPList', res.data.records[0].codeMsgPList);
            if (res.data.records[0].codeMsgPList) {
              setCodeTableDetail(res.data.records[0].codeMsgPList);
            } else {
              console.error('codeMsgPList字段不存在');
            }
            setCodeTableDetailVisible(true);
            console.log('record', record);
            console.log('text', text);

          }}
        >
          {text}
        </span>
      )
    },
    {
      title: '是否可为空',
      dataIndex: 'isEmpty',
      width: 300,
      search: false
    },
    {
      title: '标准状态',
      dataIndex: 'status',
      valueType: 'select', // 指定搜索表单类型为下拉框
      valueEnum: { // 定义选项值
        '待发布': { text: '待发布' },
        '已发布': { text: '已发布' },
        '已停用': { text: '已停用' },
      },
      render: (_, record) => (
        <Tag color={record.status === '已发布' ? 'green' : record.status === '已停用' ? 'red' : 'orange'}>
          {record.status}
        </Tag>
      ),

    },
    {
      title: '更新日期',
      dataIndex: 'updateTime',
      width: 300,
      search: false
    },
    {
      title: '操作',
      //宽度
      width: 300,
      dataIndex: 'option',// 操作列
      valueType: 'option',// 操作列类型
      render: (_, record) => [
        (record.status === '待发布' || record.status === '已停用') && (
          <a key="publish" onClick={() => {
            Modal.confirm({//创建一个确认对话框
              title: '确认发布',
              content: '确定要发布该码表吗？',
              onOk: async () => {
                try {
                  await updateDataStandardStatusUsingPut({
                    ids: [record.id],
                    status: 1,
                  })
                  actionRef.current?.reload();
                  message.success('发布成功');
                } catch (error) {
                  message.error('发布失败');
                }
              }
            });
          }}>发布</a>
        ),
        record.status === '已发布' && (
          <a key="disable" onClick={() => {
            Modal.confirm({
              title: '确认停用',
              content: '确定要停用该码表吗？',
              onOk: async () => {
                try {
                  await updateDataStandardStatusUsingPut({
                    ids: [record.id],
                    status: 2,
                  })
                  actionRef.current?.reload();
                  message.success('停用成功');
                } catch (error) {
                  message.error('停用失败');
                }
              }
            });
          }}>停用</a>
        ),
        (record.status === '待发布' || record.status === '已停用') && (
          <a key="edit" onClick={() => {
            setFormModalVisible(true);
            setCurrentRecord(record);
            setIsEdit(true);
          }}>编辑</a>
        ),
        record.status === '待发布' && (
          <a key="delete" onClick={() => {
            Modal.confirm({
              title: '确认删除',
              content: '确定要删除该码表吗？',
              onOk: async () => {
                const res = await deleteDataStandardUsingDelete({
                  id: record.id,
                })
                console.log('res', res);
                actionRef.current?.reload();
                message.success('删除成功');
              }
            });
          }}>删除</a>
        ),
      ].filter(Boolean),
    },
  ];

  return (
    <>
      <ProTable<Catalog>
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
        actionRef={actionRef}
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
            const res = await queryDataStandardUsingPost({
              ...params,
              status: params.status === '待发布' ? 0 : params.status === '已发布' ? 1 : params.status === '已停用' ? 2 : null,
              currentPage: params.current || 1,
              pageSize: params.pageSize || 20,
            })
            console.log('params', res);

            // 提取来源机构数据并去重
            const agencies = res.data.records.map(item => item.agency);
            console.log('agencies', agencies);

            const uniqueAgencies = [...new Set(agencies)];
            console.log('uniqueAgencies', uniqueAgencies);

            // 构建下拉选项对象
            const agencyOptions = uniqueAgencies.reduce((acc, agency) => {
              acc[agency] = agency;
              return acc;
            }, {} as Record<string, string>);

            setAgencyOptions(agencyOptions);

            return {
              data: res.data.records,
              success: true,
              total: res.data.total
            }
          } catch (err) {
            console.log(err)
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
                  content: `确定要发布选中的 ${selectedRows.length} 个数据标准目录吗？`,
                  onOk: async () => {
                    try {
                      const res = await updateDataStandardStatusUsingPut({
                        ids: selectedRows.map((row) => row.id),
                        status: 1,
                      }
                      )
                      if (res.code === 100200) {
                        message.success('批量发布成功');
                        //清空已选择的
                        setSelectedRows([]);
                        actionRef.current?.reload();
                        actionRef.current?.clearSelected?.(); // 清空已选择的行
                      } else {
                        message.error('批量发布失败');
                        setSelectedRows([]);
                        actionRef.current?.clearSelected?.(); // 清空已选择的行
                      }
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
                  content: `确定要停用选中的 ${selectedRows.length} 个数据标准目录吗？`,
                  onOk: async () => {
                    try {
                      await updateDataStandardStatusUsingPut({
                        ids: selectedRows.map((row) => row.id),
                        status: 2,
                      }
                      )
                      message.success('批量停用成功');
                      //清空已选择的
                      setSelectedRows([]);
                      actionRef.current?.reload();
                      actionRef.current?.clearSelected?.(); // 清空已选择的行 
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
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setCurrentRecord(null); // 清空当前记录
              setIsEdit(false); // 设置为新增模式
              setFormModalVisible(true) // 显示新增表单模态框
              fetchCodeList();
              console.log('enumRange', enumRange);

            }}
          >
            新增数据标准目录
          </Button>,
          <Upload
            key="import"
            accept=".xlsx, .xls"
            beforeUpload={async (file) => {
              try {
                const formData = new FormData();
                formData.append('file', file);

                const res = await importExcelUsingPost({}, file);

                console.log('导入res', res);

                if (res.code === 100200) {
                  message.success('导入成功');
                  actionRef.current?.reload();
                } else {
                  message.error('导入失败');
                  actionRef.current?.reload();
                }
                return false; // 阻止默认上传行为
              } catch (error) {
                message.error('导入失败'); actionRef.current?.reload();
                return false;
              }
            }}
          >
            <Button icon={<ImportOutlined />}>
              数据标准目录导入
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
                link.download = '数据标准目录模板.xls'; // 与后端返回的 Content-Disposition 一致
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

            }
            }
          >
            模板下载
          </Button>
        ]}
      />

      <Modal
        title={`确认${batchActionType === 'publish' ? '发布' : '停用'}`}
        open={modalVisible}
        onOk={handleBatchAction}
        onCancel={() => setModalVisible(false)}
      >
        <p> </p>
      </Modal>

      <CataForm

        modalVisible={formModalVisible}// 弹窗是否显示
        onCancel={() => {
          setFormModalVisible(false);
          setIsEdit(false);
          setCurrentRecord(null);
          actionRef.current?.reload();
        }}
        onSuccess={() => {
          setFormModalVisible(false);
          setIsEdit(false);
          setCurrentRecord(null);
          actionRef.current?.reload();
        }}
        record={currentRecord}
        isEdit={isEdit}
        agencyOptions={agencyOptions}
        enumRange={enumRange}
      />

      {/* 数据标准目录详情模块窗 */}
      <Modal
        title="数据标准目录详情"
        open={CatalogDetailVisible}
        onCancel={() => setCatalogDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setCatalogDetailVisible(false)}>
            关闭
          </Button>,
        ]}
        width={1200}
      >
        <Table
          //key竖着排列
          columns={[
            {
              title: '标准编号',
              dataIndex: 'id',
              key: 'id',
            },
            {
              title: '中文名称',
              dataIndex: 'chName',
              key: 'chName',
            },
            {
              title: '英文名称',
              dataIndex: 'enName',
              key: 'enName',
            },
            {
              title: '标准说明',
              dataIndex: 'description',
              key: 'description',
            },
            {
              title: '来源机构',
              dataIndex: 'agency',
              key: 'agency',
            },
            {
              title: '数据类型',
              dataIndex: 'type',
              key: 'type',
            },
            {
              title: '枚举范围',
              dataIndex: 'codeNum',
              key: 'codeNum',
            },
            {
              title: '默认值',
              dataIndex: 'dftValue',
              key: 'dftValue',
            }
          ]}
          dataSource={CatalogDetail}
          pagination={false}
        />
      </Modal>
      <CodeTableDetail
        visible={codeTableDetailVisible}
        onCancel={() => setCodeTableDetailVisible(false)}
        codeTableDetail={codeTableDetail}
      >

      </CodeTableDetail>
    </>
  );
}