// 父组件
import service from '@/services/Db';
import React, { useState, useRef } from 'react';
import { ProTable, ProFormText, ProFormSelect, ProForm, ActionType } from '@ant-design/pro-components';
import { Button, Modal, message, Tag, Table } from 'antd';
import { PlusOutlined, ImportOutlined } from '@ant-design/icons';

import db1 from '@/assets/db1.jpg';
import db2 from '@/assets/db2.jpg';
import db3 from '@/assets/db3.jpg';
import db4 from '@/assets/db4.jpg';
import db5 from '@/assets/db5.jpg';
import db6 from '@/assets/db6.jpg';
import db7 from '@/assets/db7.jpg';
import db8 from '@/assets/db8.jpg';
import db9 from '@/assets/db9.jpg';
import db10 from '@/assets/db10.jpg';
import db11 from '@/assets/db11.jpg';
import db12 from '@/assets/db12.jpg';
import db13 from '@/assets/db13.jpg';
import db14 from '@/assets/db14.jpg';
import db15 from '@/assets/db15.jpg';
import DbForm from './components/DbForm';
const { updateDataBaseUsingPut, updateDbStatusUsingPut, queryDbListUsingPost, testConnectionUsingPost, deleteDataBaseUsingDelete } = service.shujukubiaoguanli
// 状态映射关系
const statusMap = {
  '待发布': 0,
  '已发布': 1,
  '已停用': 2,
};


// 新增数据源表单
const DbType = ({ visible, onCancel, onCreate }: any) => {
  return (
    <Modal
      open={visible}
      title="新增数据源"
      onCancel={onCancel}
      footer={null} // 去掉模态框自带的按钮
      width={700}
      height={800}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {/* 数据库类型选择项 */}
        <div
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px', cursor: 'pointer' }}
          onClick={() => onCreate('mysql')}
        >
          <img
            style={{
              width: '100px',
              height: '100px',
              objectFit: 'cover',
              border: '1px solid #ccc',
            }}
            src={db1}
            alt="Mysql"
          />
          <span style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>
            Mysql
          </span>
        </div>
        <div
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px', cursor: 'pointer' }}
          onClick={() => onCreate('oracle')}
        >
          <img
            style={{
              width: '100px',
              height: '100px',
              objectFit: 'cover',
              border: '1px solid #ccc',
            }}
            src={db2}
            alt="Oracle"
          />
          <span style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>
            Oracle
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px', cursor: 'pointer' }}
          onClick={() => onCreate('SQL Server')}>
          <img
            style={{
              width: '100px',
              height: '100px',
              objectFit: 'cover',
              border: '1px solid #ccc',
            }}
            src={db3}
            alt="SQL Server"
          />
          <span style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>
            SQL Server
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px', cursor: 'pointer' }} onClick={() => onCreate('DB2')}>
          <img
            style={{
              width: '100px',
              height: '100px',
              objectFit: 'cover',
              border: '1px solid #ccc',
            }}
            src={db4}
            alt="DB2"
          />
          <span style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>
            DB2
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px', cursor: 'pointer' }} onClick={() => onCreate('DM DBMS')}>
          <img
            style={{
              width: '100px',
              height: '100px',
              objectFit: 'cover',
              border: '1px solid #ccc',
            }}
            src={db5}
            alt="DM DBMS"
          />
          <span style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>
            DM DBMS
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px', cursor: 'pointer' }} onClick={() => onCreate('Essbase')}>
          <img
            style={{
              width: '100px',
              height: '100px',
              objectFit: 'cover',
              border: '1px solid #ccc',
            }}
            src={db6}
            alt="Essbase"
          />
          <span style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>
            Essbase
          </span>
        </div>
        <div onClick={() => onCreate('GBase')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px', cursor: 'pointer' }}>
          <img
            style={{
              width: '100px',
              height: '100px',
              objectFit: 'cover',
              border: '1px solid #ccc',
            }}
            src={db7}
            alt="GBase"
          />
          <span style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>
            GBase
          </span>
        </div>
        <div onClick={() => onCreate('Greenplum')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px', cursor: 'pointer' }}>
          <img
            style={{
              width: '100px',
              height: '100px',
              objectFit: 'cover',
              border: '1px solid #ccc',
            }}
            src={db8}
            alt="Greenplum"
          />
          <span style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>
            Greenplum
          </span>
        </div>
        <div onClick={() => onCreate('KingBaseEs')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px', cursor: 'pointer' }}>
          <img
            style={{
              width: '100px',
              height: '100px',
              objectFit: 'cover',
              border: '1px solid #ccc',
            }}
            src={db9}
            alt="KingBaseEs"
          />
          <span style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>
            KingBaseEs
          </span>
        </div>
        <div onClick={() => onCreate('Netezza')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px', cursor: 'pointer' }}>
          <img
            style={{
              width: '100px',
              height: '100px',
              objectFit: 'cover',
              border: '1px solid #ccc',
            }}
            src={db10}
            alt="Netezza"
          />
          <span style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>
            Netezza
          </span>
        </div>
        <div onClick={() => onCreate('Sybase')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px', cursor: 'pointer' }}>
          <img
            style={{
              width: '100px',
              height: '100px',
              objectFit: 'cover',
              border: '1px solid #ccc',
            }}
            src={db11}
            alt="Sybase"
          />
          <span style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>
            Sybase
          </span>
        </div>
        <div onClick={() => onCreate('PetaBase')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px', cursor: 'pointer' }}>
          <img
            style={{
              width: '100px',
              height: '100px',
              objectFit: 'cover',
              border: '1px solid #ccc',
            }}
            src={db12}
            alt="PetaBase"
          />
          <span style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>
            PetaBase
          </span>
        </div>
        <div onClick={() => onCreate('Teradata')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px', cursor: 'pointer' }}>
          <img
            style={{
              width: '100px',
              height: '100px',
              objectFit: 'cover',
              border: '1px solid #ccc',
            }}
            src={db13}
            alt="Teradata"
          />
          <span style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>
            Teradata
          </span>
        </div>
        <div onClick={() => onCreate('Hive')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px', cursor: 'pointer' }}>
          <img
            style={{
              width: '100px',
              height: '100px',
              objectFit: 'cover',
              border: '1px solid #ccc',
            }}
            src={db14}
            alt="Hive"
          />
          <span style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>
            Hive
          </span>
        </div>
        <div onClick={() => onCreate('其他')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px', cursor: 'pointer' }}>
          <img
            style={{
              width: '100px',
              height: '100px',
              objectFit: 'cover',
              border: '1px solid #ccc',
            }}
            src={db15}
            alt="其他"
          />
          <span style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>
            其他
          </span>
        </div>
      </div>
    </Modal>
  );
};

export default function DataSourceManagement() {
  const actionRef = useRef<ActionType>(); // 用于刷新表格数据
  const [modalVisible, setModalVisible] = useState(false); // 新增数据源表单模态框
  const [dbTypeVisible, setDbTypeVisible] = useState(false); // 数据库类型选择模态框
  const [selectedDbType, setSelectedDbType] = useState(''); // 选中的数据库类型
  const [detailModalVisible, setDetailModalVisible] = useState(false); // 数据源详情模态框
  const [codeTableDetail, setCodeTableDetail] = useState<[]>([]); //用于存储码表详情数据
  const [isEdit, setIsEdit] = useState(false); // 是否是编辑模式
  const [currentRecord, setCurrentRecord] = useState<null>(null); // 当前操作的记录

  // 定义表格列
  const columns = [
    {
      title: '数据源名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: any, record: any) => (
        <span
          style={{ cursor: 'pointer', color: 'blue' }}
          onClick={() => {
            console.log('record', record); // 打印整个 record 对象
            setCodeTableDetail([record]);
            setDetailModalVisible(true);
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: '数据源类型',
      dataIndex: 'type',
      key: 'type',
      search: false,
    },
    {
      title: '数据源描述',
      dataIndex: 'description',
      key: 'description',
      search: false,
    },
    {
      title: '连接信息',
      dataIndex: 'url',
      key: 'url',
      search: false,
    },
    {
      title: '应用状态',
      dataIndex: 'status',
      key: 'status',
      type: 'select',
      initialValue: '待发布',
      valueEnum: {
        待发布: { text: '待发布' },
        已发布: { text: '已发布' },
        已停用: { text: '已停用' },
      },
      search: {//搜索框
        transform: (value: any) => ({ status: statusMap[value] }),
      },
      render: (_: any, record: any) => (
        <Tag color={record.status === '已发布' ? 'green' : record.status === '已停用' ? 'red' : 'orange'}>
          {record.status}
        </Tag>
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      search: false,
    },
    {
      title: '操作',
      width: 300,
      valueType: 'option',
      dataIndex: 'option',
      render: (text: any, record: any) => [
        (record.status === "待发布" || record.status === "已发布" || record.status === "已停用") && (
          <a key="test" onClick={() => {
            Modal.confirm({
              title: '确认联通测试',
              content: '是否确认联通测试',
              onOk: async () => {
                const res = await testConnectionUsingPost({
                  id: record.id,
                  password: record.password,
                  url: record.url,
                  username: record.username,
                });
                console.log('res', res);

                if (res.code === 100200) {
                  message.success('联通测试成功');
                } else {
                  message.error('联通测试失败');
                }
                actionRef.current?.reload();//刷新表格
                console.log('res', res);

              }
            });
          }}>联通测试</a>
        ),
        (record.status === "待发布" || record.status === "已停用") && (
          <a key="publish" onClick={() => {
            Modal.confirm({
              title: '确认发布',
              content: '是否确认发布',
              onOk: async () => {
                const res = await updateDbStatusUsingPut({
                  ids: [record.id],
                  status: 1,
                })
                actionRef.current?.reload();//刷新表格
                console.log('res', res);

                record.status = "已发布";
              }
            });
          }}>发布</a>
        ),
        (record.status === "待发布" || record.status === "已停用") && (
          <a key="edit" onClick={() => {
            setIsEdit(true);
            setModalVisible(true);
            setCurrentRecord(record);
            console.log('currentRecord', currentRecord);

          }}

          >编辑</a>
        ),
        (record.status === "待发布") && (
          <a key="delete"
            onClick={() => {
              Modal.confirm({
                title: '确认删除',
                content: '是否确认删除',
                onOk: () => {

                  try {
                    deleteDataBaseUsingDelete({ id: record.id });
                    message.success('删除成功');
                  } catch (e) {
                    message.error('删除失败');
                    console.log(e);
                  }
                  actionRef.current?.reload();//刷新表格
                }

              });
            }}
          >
            删除
          </a>
        ),
        (record.status === "已发布") && (
          <a key="disable"
            onClick={() => {
              Modal.confirm({
                title: '确认停用',
                content: '是否确认停用',
                onOk: async () => {
                  const res = await updateDbStatusUsingPut({
                    ids: [record.id],
                    status: 2,
                  })

                  console.log('res', res);

                  record.status = "已停用";
                  actionRef.current?.reload();//刷新表格

                }
              });
            }}
          >
            停用
          </a>
        )
      ]
    },
  ];

  // 处理新增数据源
  const handleCreate = (values: any) => {

    setModalVisible(false); // 关闭模态框
  };

  // 打开新增数据源表单
  const openDbForm = (dbType: string) => {
    setSelectedDbType(dbType);
    setModalVisible(true);
    setDbTypeVisible(false); // 关闭数据库类型选择模态框
  };

  return (
    <>
      <Button
        key="add"
        type="primary"
        style={{ float: 'right' }}
        icon={<PlusOutlined />}
        onClick={() => {
          setDbTypeVisible(true);// 打开数据库类型选择模态框
          setIsEdit(false);
          setCurrentRecord(null);
        }}
      >
        新增数据源
      </Button>
      <ProTable
        actionRef={actionRef}
        columns={columns}
        pagination={{
          showTotal: (total) => `共 ${total} 条`,
          showSizeChanger: true, // 显示分页大小选择器
          showQuickJumper: true, // 显示快速跳转输入框
          pageSizeOptions: ['10', '20', '50', '100'],
        }}
        request={async (params = {}) => {
          try {
            const body: dataFactory.QueryDbListDTO = {
              name: params.name || '',
              status: params.status || 0,
              pageNumber: params.current || 1,
              pageSize: params.pageSize || 20,
            };
            console.log('调用前', body);

            const response = await queryDbListUsingPost(body);
            console.log('response', response);

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
      />
      <DbType
        visible={dbTypeVisible}
        onCancel={() => setDbTypeVisible(false)}
        onCreate={openDbForm}
      />
      <DbForm

        modalVisible={modalVisible}
        onCancel={() => {
          setModalVisible(false)// 关闭模态框
          setIsEdit(false);
          setCurrentRecord(null);
          actionRef.current?.reload();//刷新表格
        }}
        onSuccess={() => {
          setModalVisible(false)// 关闭模态框
          setIsEdit(false);
          setCurrentRecord(null);
          actionRef.current?.reload();//刷新表格
        }}
        isEdit={isEdit}
        onCreate={handleCreate}
        selectedDbType={selectedDbType}
        record={currentRecord}
      />
      <Modal
        title="码表详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>,
        ]}
      >
        <Table
          columns={[
            {
              title: 'id',
              dataIndex: 'id',
              key: 'id',
            },
            {
              title: '数据源名称',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: '账户',
              dataIndex: 'username',
              key: 'username',
            },
            {
              title: '密码',
              dataIndex: 'password',
              key: 'password',
            },
          ]}
          dataSource={codeTableDetail}
          pagination={false}
        />
      </Modal>
    </>
  );
}