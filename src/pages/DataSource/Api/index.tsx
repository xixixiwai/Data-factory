import React, { useEffect, useState, useRef } from 'react';
import { Descriptions, Divider, Form, Input, Layout, Row, Table, Tree, TreeDataNode } from 'antd';
import { ProTable, ActionType } from '@ant-design/pro-components';
import { Tag, Button, message, Modal } from 'antd';
import CreateForm from './components/CreateForm';
import service from '@/services/Directory';
import { PlusCircleOutlined, MinusCircleOutlined, EditOutlined, DownOutlined, CarryOutOutlined } from '@ant-design/icons';
const { searchListAndChildUsingGet } = service.muluguanli;
const { Content, Sider } = Layout;
import { getDirectoryUsingGet } from '@/services/Directory/muluguanli';
import services from '@/services/Api'
const { addDirUsingPost, batchCategorizeUsingPost, deleteUsingDelete, queryByIdUsingGet, queryUsingPost, testUsingPost, updateUsingPut } = services.jiekoumulu
// 在顶部添加TreeDataNode类型定义
type DirectoryTreeDataNode = TreeDataNode & {
  id: number;
  children?: DirectoryTreeDataNode[];
};
//数据详情
interface DetailData {
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

}



export default function ApiManagement() {
  const actionRef = useRef<ActionType>(); // 用于刷新表格数据
  const [createModalVisible, handleModalVisible] = useState<boolean>(false); // 创建表单弹窗
  const [addjk, setAddjk] = useState<boolean>(false); // 添加接口分类弹窗
  const [treeData, setTreeData] = useState<any[]>([]); // 接口分类树形数据
  const [testModalVisible, setTestModalVisible] = useState(false);//控制接口测试模态框
  const [testData, setTestData] = useState<any[]>([]);//接口测试数据
  const [selectedRows, setSelectedRows] = useState<DetailData[]>(); // 用于存储选中的行数据（批量操作）
  const [batchActionType, setBatchActionType] = useState<'publish' | 'disable'>(); // 用于存储批量操作类型
  // 在组件状态中添加：
  const [testParams, setTestParams] = useState<Record<string, any>>({});
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  //详情框内数据
  const [detailData, setDetailData] = useState<Partial<DetailData>>({
    requestParamList: [],
    requestBodyList: [],
    responseList: [],
  });

  const [detailModalVisible, setDetailModalVisible] = useState(false);  //详情框
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
  // 定义表格列
  const columns = [
    {
      title: '接口名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: any, record: any) => (
        <span
          style={{ cursor: 'pointer', color: 'blue' }}
          onClick={async () => {
            console.log('record详细', record);
            setDetailModalVisible(true);
            setDetailData(record);
            console.log('detailData', detailData);

            console.log('详细数据', record);

          }}
        >
          {text}
        </span>
      )
    },
    {
      title: '接口描述',
      dataIndex: 'description',
      key: 'description',
      search: false,
    },
    {
      title: '接口分类',
      dataIndex: 'type',
      key: 'type',
      search: false,

    },
    {
      title: '接口来源',
      dataIndex: 'source',
      key: 'source',
      type: 'select',
      valueEnum: {
        0: { text: '数据服务' },
        1: { text: '指标管理' },
        2: { text: '决策引擎' },
      }
    },
    {
      title: 'API状态',
      dataIndex: 'status',
      key: 'status',
      valueEnum: {
        0: { text: '待发布', status: '0' },
        1: { text: '已发布', status: '1' },
        2: { text: '已停用', status: '2' },
      },
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      search: false,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_: any, record: any) => [
        // <Button key={"edit"} type="link">编辑</Button>,
        // <Button key={"del"} type="link">删除</Button>,
        (record.status === '已停用' || record.status === '未发布') && (
          <>
            <a
              key="publish"
              onClick={() => {
                Modal.confirm({
                  title: '确认发布',
                  content: '确定要发布该码表吗？',
                  onOk: async () => {
                    try {
                      console.log('record', record.id);

                      // const res = await updateStatusUsingPut({
                      //   ids: record.id,
                      //   status: 1,
                      // })
                      // console.log(res);

                      // actionRef.current?.reload();
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
            <a
              key="edit"
              onClick={() => {
                // setCurrentRecord(record); // 设置当前操作的记录
                // console.log('record', record);

                // setIsEdit(true); // 设置为编辑模式
                // setCreateModalVisible(true);
              }}
            >
              编辑
            </a>
          </>

        ),
        (record.status === '未发布') && (
          <a
            key="delete"
            onClick={() => {
              Modal.confirm({
                title: '确认删除',
                content: '确定要删除该码表吗？',
                onOk: async () => {
                  try {
                    const res = await deleteUsingDelete({ id: record.id });
                    console.log('res', res);
                    if (res.code === 100200) {
                      console.log('删除成功', actionRef);

                      actionRef.current?.reload();
                      message.success('删除成功');

                    } else {
                      message.error('删除失败');
                    }

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
        (record.status === '已发布' || record.status === '已停用' || record.status === '未发布') && (
          <a
            key="test"
            onClick={() => {
              setTestModalVisible(true);
              setDetailData(record);
            }}
          >
            接口测试
          </a>
        )
      ],
    },
  ];

  // 处理添加接口分类
  const handleAdd = () => {
    setAddjk(true);
  };

  // 获取目录树数据
  const fetchTreeData = async () => {
    try {
      const res = await searchListAndChildUsingGet({ name: '企业信息' });
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

  //获取表格数据
  const fetchTableData = async (params: any) => {
    try {
      const res = await queryUsingPost({
        currentPage: params.current || 1,
        pageSize: params.pageSize || 10,
        name: params.name,
        // type: params.type,
        status: params.status,
        source: params.source,
      });
      console.log('res', res);

      // 对每个接口记录调用convertType获取分类名称
      const processedRecords = await Promise.all(
        res.data.records.map(async (record: any) => {
          const typeName = await convertType(record.type); // 确保record.type是有效的id
          return {
            ...record,
            type: typeName, // 将分类名称附加到记录中
          };
        })
      );
      return {
        data: processedRecords,

        success: true,
        total: res.data.total,
      }
    } catch (error) {
      console.log('获取表格数据失败', error);
    }
  }

  useEffect(() => {
    fetchTreeData()
  }, [])

  // 测试按钮点击处理函数
  const handleTest = async () => {
    try {
      setLoading(true);

      // 构造请求参数
      const params = {
        id: detailData.id,
        inputParam: Object.entries(testParams).map(([key, value]) => ({
          key,
          value
        })),
        inputBody: detailData.requestBodyList?.map(body => ({
          name: body.name,
          inputBody: Object.entries(testParams).map(([key, value]) => ({
            key,
            value
          }))
        })) || []
      };
      console.log('params', params);

      const res = await testUsingPost(params);
      console.log('res', res);

      if (res.code === 100200) {
        setTestResult(JSON.stringify(res.data, null, 2));
      } else {
        message.error(res.msg || '测试失败');
      }
    } catch (error) {
      message.error('测试请求失败');
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Button
        style={{ float: 'right' }}
        type="primary"
        onClick={() => handleModalVisible(true)}
      >
        人工注册
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
            接口分类
            <PlusCircleOutlined
              style={{ marginLeft: 10 }}
              onClick={handleAdd}
            />
          </div>
          <Tree
            showLine
            treeData={treeData}
            style={{ width: '100%' }}
            defaultExpandAll
            switcherIcon={<DownOutlined />}
          // titleRender={(node) => node.title}
          />
        </Sider>
        <Content>
          <ProTable
            rowKey="id"
            columns={columns}
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
                          await updateDataStandardStatusUsingPut({
                            ids: selectedRows.map((row) => row.id),
                            status: 1,
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
                        // try {
                        //   await updateDataStandardStatusUsingPut({
                        //     ids: selectedRows.map((row) => row.id),
                        //     status: 2,
                        //   }
                        //   )
                        message.success('批量停用成功');
                        //   //清空已选择的
                        //   setSelectedRows([]);
                        actionRef.current?.reload();
                        actionRef.current?.clearSelected?.(); // 清空已选择的行 
                        // } catch (error) {
                        //   message.error('批量停用失败');
                        // }
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
        open={addjk}
        onCancel={() => setAddjk(false)}
        onOk={() => setAddjk(false)}

      >
        <input placeholder="请输入接口分类名称" />
      </Modal>

      {/* 创建表单的 Modal */}
      <CreateForm
        treeData={treeData}
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
      />
      {/* 详情框 */}
      <Modal
        // style={{ maxHeight: '80vh', overflowY: 'auto' }}
        title="接口详情"
        //固定title，其他下滑
        styles={{
          body: {
            maxHeight: '80vh',
            overflowY: 'auto',
          },
        }}
        open={detailModalVisible}
        onCancel={() => {
          setDetailModalVisible(false)
          // setDetailData({})
        }

        }
        footer={null}
        width={1000}
      >
        <br />
        <strong>基本信息</strong>
        <Form style={{ display: 'flex', flexWrap: 'wrap', margin: 20 }} key={detailData.id} >
          <Form.Item label="接口名称" name="name" style={{ width: '50%' }}>
            <span>{detailData.name}</span>
          </Form.Item>
          <Form.Item label="请求协议" name="agreement" style={{ width: '50%' }}>
            <span>{detailData.agreement === 0 ? 'HTTP' : 'HTTPS'}</span>
          </Form.Item>
          <Form.Item label="接口分类" name="type" style={{ width: '50%' }}>
            <span>{detailData.type}</span>
          </Form.Item>
          <Form.Item label="请求方式" name="method" style={{ width: '50%' }}>
            <span>{detailData.method === 0 ? 'GET' : 'POST'}</span>
          </Form.Item>
          {/* 没有 */}
          <Form.Item label="支持格式" name="format" style={{ width: '50%' }}>
            <span>JSON</span>
          </Form.Item>
          <Form.Item label="IP端口" name="ip" style={{ width: '50%' }}>
            <span>{detailData.ip}</span>
          </Form.Item>
          <Form.Item label="超时时间" name="timeout" style={{ width: '50%' }}>
            <span>{detailData.timeout}s</span>
          </Form.Item>
          <Form.Item label="Path" name="path" style={{ width: '50%' }}>
            <span>{detailData.path}</span>
          </Form.Item>
          <Form.Item label="接口描述" name="description" style={{ width: '50%' }}>
            <span>{detailData.description}</span>
          </Form.Item>
        </Form>
        <hr />
        <br />
        <strong>请求参数</strong>
        <Table
          columns={[
            {
              title: '参数名',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: '参数位置',
              dataIndex: 'position',
              key: 'position',
            },
            {
              title: '数据类型',
              dataIndex: 'dataType',
              key: 'dataType',
            },
            {
              title: '是否必填',
              dataIndex: 'isRequired',
              key: 'isRequired',
            },
            {
              title: '默认请求参数',
              dataIndex: 'defValue',
              key: 'defValue',
            },
            {
              title: '说明',
              dataIndex: 'description',
              key: 'description',
            }

          ]}
          dataSource={detailData.requestParamList || []}
          pagination={false}
          style={{ margin: 20 }}
        >
        </Table>
        <strong>请求body</strong>
        <Table
          columns={[
            {
              title: '参数名称',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: '数据类型',
              dataIndex: 'dataType',
              key: 'dataType',
            },
            {
              title: '参数说明',
              dataIndex: 'description',
              key: 'description',
            }
          ]}
          dataSource={detailData.requestBodyList || []}
          pagination={false}
          style={{ margin: 20 }}
        >
        </Table>
        <hr />
        <br />
        <strong>接口返回参数</strong>
        <Table
          columns={[
            {
              title: '参数名称',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: '数据类型',
              dataIndex: 'dataType',
              key: 'dataType',
            },
            {
              title: '参数说明',
              dataIndex: 'description',
              key: 'description',
            },

          ]}
          dataSource={detailData.responseList || []}
          //取消底部工具栏
          pagination={false}
          style={{ margin: 20 }}

        >

        </Table>
      </Modal >
      {/* 接口测试模态框 */}
      <Modal
        title="接口测试"
        open={testModalVisible}
        onCancel={() => {
          setTestModalVisible(false);
          setTestParams({});
          setTestResult('');
        }}
        footer={null}
        width={1200}
      >
        <Layout style={{ background: '#fff' }}>
          <Sider width={600} style={{ padding: 16, background: '#fff' }}>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="接口名称">{detailData.name}</Descriptions.Item>
              <Descriptions.Item label="请求协议">
                {detailData.agreement === 0 ? 'HTTP' : 'HTTPS'}
              </Descriptions.Item>
              <Descriptions.Item label="请求方式">
                {detailData.method === 0 ? 'GET' : 'POST'}
              </Descriptions.Item>
              <Descriptions.Item label="请求路径">
                {detailData.path}
              </Descriptions.Item>
            </Descriptions>

            <Divider orientation="left">输入参数</Divider>

            <Table
              columns={[
                { title: '参数名', dataIndex: 'name' },
                { title: '参数位置', dataIndex: 'position' },
                { title: '必填', render: (_, r) => (r.isRequired ? '是' : '否') },
                {
                  title: '测试值',
                  dataIndex: 'testValue',
                  render: (_, record) => (
                    <Input
                      value={testParams[record.name] || ''}
                      onChange={(e) =>
                        setTestParams(prev => ({
                          ...prev,
                          [record.name]: e.target.value
                        }))
                      }
                    />
                  )
                }
              ]}
              dataSource={detailData.requestParamList || []}
              pagination={false}
              size="small"
            />

            <Divider orientation="left">请求Body</Divider>

            <Table
              columns={[
                { title: '参数名', dataIndex: 'name' },
                { title: '类型', dataIndex: 'dataType' },
                {
                  title: '测试值',
                  dataIndex: 'testValue',
                  render: (_, record) => (
                    <Input
                      value={testParams[record.name] || ''}
                      onChange={(e) =>
                        setTestParams(prev => ({
                          ...prev,
                          [record.name]: e.target.value
                        }))
                      }
                    />
                  )
                }
              ]}
              dataSource={detailData.requestBodyList || []}
              pagination={false}
              size="small"
            />

            <Button
              type="primary"
              onClick={handleTest}
              loading={loading}
              style={{ marginTop: 16 }}
            >
              执行测试
            </Button>
          </Sider>

          <Content style={{ padding: 16, borderLeft: '1px solid #f0f0f0' }}>
            <h4>测试结果</h4>
            <pre style={{
              background: '#f6f8fa',
              padding: 16,
              borderRadius: 4,
              maxHeight: 600,
              overflow: 'auto'
            }}>
              {testResult || '等待测试结果...'}
            </pre>
          </Content>
        </Layout>
      </Modal>
    </>
  );
}