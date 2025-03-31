import React, { useEffect, useState } from 'react';
import { Form, Layout, Table, Tree, TreeDataNode } from 'antd';
import { ProTable } from '@ant-design/pro-components';
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
  id: number;
  name: string;
  agreement: number;
  type: number;
  method: number;
  format: string;
  ip: string;
  timeout: number;
  path: string;
  description: string;
}



export default function ApiManagement() {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false); // 创建表单弹窗
  const [addjk, setAddjk] = useState<boolean>(false); // 添加接口分类弹窗
  const [treeData, setTreeData] = useState<any[]>([]); // 接口分类树形数据
  //详情框内数据
  const [detailData, setDetailData] = useState<DetailData>({
    id: 0,
    name: '',
    agreement: 0,
    type: 0,
    method: 0,
    format: '',
    ip: '',
    timeout: 0,
    path: '',
    description: '',
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
            setDetailData({
              id: record.id,
              name: record.name,
              agreement: record.agreement,
              type: record.type,
              method: record.method,
              format: record.format,
              ip: record.ip,
              timeout: record.timeout,
              path: record.path,
              description: record.description,
            })
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
      render: (_, record) => [
        <Button type="link">编辑</Button>,
        <Button type="link">删除</Button>,
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
            request={fetchTableData}
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
        bodyStyle={{ maxHeight: '80vh', overflowY: 'auto' }}
        title="接口详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={1000}
      >
        <strong>基本信息</strong>
        <Form style={{ display: 'flex', flexWrap: 'wrap' }} key={detailData.id} >
          <Form.Item label="接口名称" name="name" style={{ width: '50%' }}>
            <span>{detailData.name}</span>
          </Form.Item>
          <Form.Item label="请求协议" name="agreement" style={{ width: '50%' }}>
            <span>{detailData.agreement}</span>
          </Form.Item>
          <Form.Item label="接口分类" name="type" style={{ width: '50%' }}>
            <span>{detailData.type}</span>
          </Form.Item>
          <Form.Item label="请求方式" name="method" style={{ width: '50%' }}>
            <span>{detailData.method}</span>
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
        <strong>请求参数</strong>
        <Table
          columns={[
            {
              title: '参数名',
              dataIndex: 'paramName',
              key: 'paramName',
            },
            {
              title: '参数位置',
              dataIndex: 'paramPosition',
              key: 'paramPosition',
            },
            {
              title: '数据类型',
              dataIndex: 'dataType',
              key: 'dataType',
            },
            {
              title: '是否必填',
              dataIndex: 'required',
              key: 'required',
            },
            {
              title: '默认请求参数',
              dataIndex: 'defValue',
              key: 'defValue',
            },
            {
              title: '说明',
              dataIndex: 'decs',
              key: 'decs',
            }

          ]}
        >
        </Table>
        <strong>请求body</strong>
        <Table
          columns={[
            {
              title: '参数名称',
              dataIndex: 'paramBodyName',
              key: 'paramBodyName',
            },
            {
              title: '数据类型',
              dataIndex: 'dateType',
              key: 'dateType',
            },
            {
              title: '参数说明',
              dataIndex: 'decs',
              key: 'decs',
            }
          ]}
        >
        </Table>
        <hr />
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
              dataIndex: 'dateType',
              key: 'dateType',
            },
            {
              title: '参数说明',
              dataIndex: 'description',
              key: 'description',
            }
          ]}
        >

        </Table>
      </Modal >
    </>
  );
}