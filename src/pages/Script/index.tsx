import React, { useEffect, useRef, useState } from 'react';
import { Layout, Tree, TreeSelect, TreeDataNode, Form, Card, Table } from 'antd';
import { ProTable, ActionType } from '@ant-design/pro-components';
import { Tag, Button, message, Modal } from 'antd';
import CreateForm from './components/CreateForm';
import { DownOutlined, PlusCircleOutlined } from '@ant-design/icons';
const { Content, Sider } = Layout;
import { searchListAndChildUsingGet, getDirectoryUsingGet } from '@/services/Directory/muluguanli'
import services from '@/services/Script'
const { addPythonScriptUsingPost, batchUpdatePythonScriptStatusUsingPut, classifyPythonScriptUsingPut, deletePythonScriptUsingDelete, queryPythonScriptUsingPost, testPythonScriptUsingPost, updatePythoScriptUsingPut } = services.pythonScriptController
// 在顶部添加TreeDataNode类型定义
type DirectoryTreeDataNode = TreeDataNode & {
  id: number;
  children?: DirectoryTreeDataNode[];
};
interface DetailData {
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
  description?: string;
  updateTime?: string;
  className?: string;
  funcName?: string;
  // requestParams: {
  //   dataInType?: number;
  //   dataInValue?: string;
  //   isRequired?: number;
  //   paramInName?: string;
  //   paramIndescription?: string;
  // },
  // responseParams: {
  //   dataOutType?: number;//1-Int 2-Float 3-String
  //   paramOutName?: string;
  //   paramOutdescription?: string;
  // }
  requestParams?: Record<string, any>[];
  responseParams?: Record<string, any>[];
}





export default function ScriptManagement() {
  const actionRef = useRef<ActionType>(); // 用于刷新表格数
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false); // 创建表单弹窗
  const [add1, setAdd1] = useState<boolean>(false); // 添加脚本分类弹窗
  const [treeData, setTreeData] = useState<any[]>([]); // 脚本分类树形数据
  //脚本数据

  const [selectedRows, setSelectedRows] = useState<DetailData[]>(); // 用于存储选中的行数据（批量操作）
  const [detailData, setDetailData] = useState<Partial<DetailData>>({
    requestParams: [],
    responseParams: []
  }); // 用于存储当前行的数据（编辑操作）
  const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false); // 编辑表单弹窗
  // 定义表格列
  const columns = [
    {
      title: '脚本名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: any, record: any) => (
        <span
          style={{ cursor: 'pointer', color: 'blue' }}
          onClick={() => {
            setDetailModalVisible(true);
            setDetailData({
              ...record,
              requestParams: record.requestParams
                ? JSON.parse(record.requestParams).map((item: any) => ({
                  ...item,
                  dataInType: item.dataInType === 1 ? 'Int' : item.dataInType === 2 ? 'Float' : 'String'
                }))
                : [],
              responseParams: record.responseParams
                ? JSON.parse(record.responseParams).map((item: any) => ({
                  ...item,
                  dataOutType: item.dataOutType === 1 ? 'Int' : item.dataOutType === 2 ? 'Float' : 'String'
                }))
                : [],

            });
          }}
        >
          {text}
        </span>
      )
    },
    {
      title: '脚本描述',
      dataIndex: 'description',
      key: 'description',
      search: false
    },
    {
      title: '脚本分类',
      dataIndex: 'classified',
      key: 'classified',
      search: false,
    },
    {
      title: '脚本状态',
      dataIndex: 'status',
      key: 'status',
      valueEnum: {
        未发布: { text: '待发布' },
        已发布: { text: '已发布' },
        已停用: { text: '已停用' },
      },
      render: (_: any, record: any) => {
        return <Tag color={record.status === '已发布' ? 'green' : record.status === '已停用' ? 'red' : 'orange'}>{record.status}</Tag>
      }
    },
    {
      title: '更新日期',
      dataIndex: 'updateTime',
      key: 'updateTime',
      search: false,
    },
    {
      title: '操作',
      width: 300,
      dataIndex: 'option',
      valueType: 'option',
      render: (_: any, record: any) => [
        (record.status === '待发布' || record.status === '已停用' || record.status === '已发布') && (
          <Button
            type='primary'
            key={'test'}
            onClick={async () => {
              try {
                const data = {
                  // address: record.address,
                  className: record.className,
                  funcName: record.funcName,
                  id: record.id,
                  name: record.name,
                  requestParams: record.requestParams,
                }
                console.log('测试data', data);

                // const res = await testPythonScriptUsingPost({
                //   ...data  
                // })
                // console.log('测试res', res);

              } catch (error) {
                message.error('测试失败');
              }

            }}
          >
            测试
          </Button>
        ),
        (record.status === '待发布' || record.status === '已停用') && (

          <>
            <Button
              type='primary'
              key={'publish'}
              onClick={async () => {
                try {
                  const res = await batchUpdatePythonScriptStatusUsingPut({ ids: [record.id], method: 1 });
                  console.log('发布res', res);
                  actionRef.current?.reload();
                } catch (error) {
                  message.error('发布失败');
                }
              }}>
              发布
            </Button>
            <Button
              type='primary'
              key={'publish'}
              onClick={async () => { }}>
              编辑
            </Button>
          </>
        ),
        record.status === '已发布' && (
          <Button
            type='primary'
            key={'publish'}
            onClick={async () => {
              try {
                const res = await batchUpdatePythonScriptStatusUsingPut({ ids: [record.id], method: 2 });
                console.log('停用res', res);
                actionRef.current?.reload();
              } catch (error) {
                message.error('停用失败');
              }
            }}
          >停用</Button>
        ),
        record.status === '待发布' && (
          <Button
            type='primary'
            key={'publish'}
            onClick={async () => {
              try {
                const res = await deletePythonScriptUsingDelete({ id: record.id });
                console.log('删除res', res);
                if (res.code === 100200) {
                  message.success('删除成功');
                }
                actionRef.current?.reload();
              } catch (error) {
                message.error('删除失败');
              }
            }}
          >删除</Button>
        )
      ],
    },
  ];

  // 获取TreeSelect 的数据// 获取目录树数据
  const fetchTreeData = async () => {
    try {
      const res = await searchListAndChildUsingGet({ name: 'Python脚本' });
      const convertTreeData = (data: any[]): DirectoryTreeDataNode[] => {
        return data.map(item => ({
          title: item.name,
          key: item.id.toString(),
          id: item.id,
          children: convertTreeData(item.children || []),
          isLeaf: item.child?.length === 0,
        }));
      };
      console.log('目录树数据:', convertTreeData(res));

      setTreeData(convertTreeData(res || []));


    } catch (error) {
      console.error('获取目录树失败:', error);
    }
  };
  //把typeid转换为type所属目录 getDirectoryUsingGet
  const convertType = async (id: number) => {
    try {
      const res = await getDirectoryUsingGet({ id });
      console.log('type转换', res);

      // 确保 res.data 是一个数组
      const data = Array.isArray(res.data) ? res.data : [res.data];

      const findName = (data: any[], targetId: number): string | null => {
        if (!data || data.length === 0) {
          return null;
        }

        for (const item of data) {
          if (item.id === targetId) {
            return item.name;
          }

          if (item.child && item.child.length > 0) {
            const name = findName(item.child, targetId);
            if (name) {
              return name;
            }
          }
        }

        return null;
      };

      const a = findName(data, id);
      console.log('findName', a);

      return a || '';
    } catch (error) {
      console.error('type转换失败:', error);
      return '';
    }
  };

  // 获取表格数据
  const fetchTableData = async (params: any) => {
    try {
      console.log('表格参数:', params);

      const res = await queryPythonScriptUsingPost({
        ...params,
        pageNumber: params.current || 1,
        pageSize: params.pageSize || 10,
      });
      // 对每个接口记录调用convertType获取分类名称
      const processedRecords = await Promise.all(
        res.data.records.map(async (record: any) => {
          console.log('record', record);

          const classified = await convertType(record.classified); // 确保record.type是有效的id
          return {
            ...record,
            classified: classified, // 将分类名称附加到记录中
          };
        })
      );
      console.log('processedRecords', processedRecords);

      return {
        data: processedRecords,
        success: true,
        total: res.data.total,
      }
    } catch (error) {
      console.error('获取表格数据失败:', error);
      return {
        data: [],
        success: false,
      };
    }
  }
  const handleAdd = () => {
    setAdd1(true);
  };


  useEffect(() => {
    fetchTreeData();
  }, [])
  return (
    <>
      <Button
        style={{ float: 'right' }}
        type="primary"
        onClick={() => setCreateModalVisible(true)}
      >
        新增脚本
      </Button>

      <Layout style={{ minHeight: '100vh' }}>
        <Sider theme="light" width={200}>
          <div
            style={{
              height: 50,
              marginBottom: 16,
              textAlign: 'center',
              background: 'rgb(230, 233, 237)',
              lineHeight: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            脚本分类
            <PlusCircleOutlined
              style={{ marginLeft: 10 }}
              onClick={handleAdd}
            />
          </div>
          <Tree
            showLine
            defaultExpandAll
            treeData={treeData}
            style={{ width: '100%' }}
            switcherIcon={<DownOutlined />}
          />
        </Sider>
        <Content>
          <ProTable
            columns={columns}
            rowKey={'id'}
            pagination={{
              showTotal: (total) => `共${total}条`,
              showSizeChanger: true,
              showQuickJumper: true,
              pageSizeOptions: ['10', '20', '30', '40'],
            }}
            rowSelection={{
              onChange: (_, selectedRows) => setSelectedRows(selectedRows),
            }}
            request={fetchTableData}
            actionRef={actionRef}
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
                          await batchUpdatePythonScriptStatusUsingPut({
                            ids: selectedRows.map((row) => row.id),
                            method: 1,
                          }
                          )
                          message.success('批量发布成功');
                          //清空已选择的
                          setSelectedRows([]);
                          actionRef.current?.reload();
                          actionRef.current?.clearSelected?.(); // 清空已选择的行
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
                          await batchUpdatePythonScriptStatusUsingPut({
                            ids: selectedRows.map((row) => row.id),
                            method: 2,
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
          />
        </Content>
      </Layout>

      {/* 添加接口分类的 Modal */}
      <Modal
        open={add1}
        onCancel={() => setAdd1(false)}
        onOk={() => setAdd1(false)}
      >
        <input placeholder="请输入脚本分类名称" />
      </Modal>

      {/* 创建表单的 Modal */}
      <CreateForm
        onCancel={() => setCreateModalVisible(false)}
        modalVisible={createModalVisible}
      />
      {/* 详情模态框 */}
      <Modal
        onCancel={() => setDetailModalVisible(false)}
        open={detailModalVisible}
        footer={null}
        title="脚本详情"
        width={1000}
      >
        <strong>基础信息</strong>
        <Card>
          <Form.Item label="脚本名称">{detailData?.name}</Form.Item>
          <Form.Item label="脚本分类">{detailData?.classified}</Form.Item>
          <Form.Item label="脚本描述">{detailData?.description}</Form.Item>
          <Form.Item label="类名">{detailData?.className}</Form.Item>
          <Form.Item label="方法名">{detailData?.funcName}</Form.Item>
        </Card>
        <strong>参数信息</strong>
        <Table
          title={() => '输入参数'}
          dataSource={detailData?.requestParams || []}
          columns={[
            {
              title: '参数名称',
              dataIndex: 'paramInName',
              key: 'paramInName',
            },
            {
              title: '数据类型',
              dataIndex: 'dataInType',
              key: 'dataInType',
            },
            {
              title: '是否必填',
              dataIndex: 'isRequired',
              key: 'isRequired',
            },
            {
              title: '参数描述',
              dataIndex: 'paramIndescription',
              key: 'paramIndescription'
            }
          ]}
          pagination={false}
        >


        </Table>
        <Table
          title={() => '输出参数'}
          dataSource={detailData?.responseParams || []}
          columns={[
            {
              title: '参数名称',
              dataIndex: 'paramOutName',
              key: 'paramOutName',
            },
            {
              title: '数据类型',
              dataIndex: 'dataOutType',
              key: 'dataOutType',
            },
            {
              title: '参数描述',
              dataIndex: 'paramOutdescription',
              key: 'paramOutdescription'
            }
          ]}
          pagination={false}
        >


        </Table>

      </Modal>

    </>
  );
}