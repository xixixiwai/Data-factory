import React, { useState } from 'react';
import { Layout, TreeSelect,  } from 'antd';
import { ProTable } from '@ant-design/pro-components';
import { Tag, Button, message, Modal } from 'antd';
import CreateForm from '@/pages/Table/components/CreateForm';
import {PlusCircleOutlined} from '@ant-design/icons';
const { Content, Sider } = Layout;

// 定义 TreeSelect 的数据
const items = [
  {
    key: '1',
    label: 'nav 1',
  },
  {
    key: '2',
    label: 'nav 2',
  },
  {
    key: '3',
    label: 'nav 3',
  },
];

// 定义表格列
const columns = [
  {
    title: '接口名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '接口描述',
    dataIndex: 'desc',
    key: 'desc',
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
    search: false,
  },
  {
    title: 'API状态',
    dataIndex: 'status',
    key: 'status',
    valueEnum: {
      0: { text: '禁用', status: 'Error' },
      1: { text: '启用', status: 'Success' },
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

// 模拟数据
const data = [
  {
    name: '接口名称1',
    desc: '接口描述1',
    type: '接口分类1',
    source: '接口来源1',
    status: 1,
    updateTime: '2022-12-12',
  },
  {
    name: '接口名称2',
    desc: '接口描述2',
    type: '接口分类2',
    source: '接口来源2',
    status: 0,
    updateTime: '2022-12-12',
  },
];

export default function ApiManagement() {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false); // 创建表单弹窗
  const [addjk, setAddjk] = useState<boolean>(false); // 添加接口分类弹窗

  // 处理添加接口分类
  const handleAdd = () => {
    setAddjk(true);
  };

  // 处理 TreeSelect 变化
  const handleTreeSelectChange = (value: string) => {
    console.log('Selected value:', value);
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
          <TreeSelect
            style={{ width: '80%' }}
            treeData={items}
            placeholder="请选择"
            onChange={handleTreeSelectChange}
          />
        </Sider>
        <Content>
          <ProTable
            dataSource={data}
            columns={columns}
            pagination={{
              pageSize: 5,
            }}
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
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
      />
    </>
  );
}