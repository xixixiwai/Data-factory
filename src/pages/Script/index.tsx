import React, { useState } from 'react';
import { Layout, TreeSelect,  } from 'antd';
import { ProTable } from '@ant-design/pro-components';
import { Tag, Button, message, Modal } from 'antd';
import CreateForm from './components/CreateForm';
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
    title:'脚本名称',
    dataIndex:'name',
    key:'name',
  },
  {
    title: '脚本描述',
    dataIndex: 'nameEn',
    key: 'nameEn',
    search:false
  },
  {
    title:'脚本分类',
    dataIndex:' description',
    key:'description',
    search: false,
  },
  {
    title: '脚本状态',
    dataIndex: 'status',
    key: 'status',
    valueEnum: {
      未发布: { text: '未发布', status: 'Default' },
      已发布: { text: '已发布', status: 'Processing' },
      已停用: { text: '已停用', status: 'Error' },
    },
  },
  {
    title: '更新日期',
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

// 生成模拟数据

const data = [
  {
    key: '1',
    name: '脚本1',
    nameEn: '脚本1',
    description: '脚本1',
    status: '未发布',
    updateTime: '2022-01-01',
  },
  {
    key: '2',
    name: '脚本2',
    nameEn: '脚本2',
    description: '脚本2',
    status: '已发布',
    updateTime: '2022-01-02',
  },
  {
    key: '3',
    name: '脚本3',
    nameEn: '脚本3',
    description: '脚本3',
    status: '已停用',
    updateTime: '2022-01-03',
  },
];

export default function ScriptManagement() {
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false); // 创建表单弹窗
  const [add1, setAdd1] = useState<boolean>(false); // 添加接口分类弹窗

  const handleAdd = () => {
    setAdd1(true);
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
    </>
  );
}