import { Layout, Tree, Form, Input, Table } from 'antd';
import { ProTable, ActionType } from '@ant-design/pro-components';
import { Tag, Button, message, Modal,TreeDataNode } from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined, EditOutlined, DownOutlined, CarryOutOutlined } from '@ant-design/icons';
import service from '@/services/Directory';
import { useForm } from 'antd/es/form/Form';
import DataAssetForm from './components/DataAssetForm';
const { Content, Sider } = Layout;
const { addUsingPost, deleteUsingDelete, editUsingPut, getTreeUsingGet, hasChildUsingGet, searchByNameUsingGet } = service.muluguanli;
import service1 from '@/services/DataAsset'
const { addDataAssetUsingPost, queryDataAssetListUsingPost, queryDirectoryListUsingGet } = service1.zichanguanli


import React, { useState, useEffect, useRef } from 'react';

// 在顶部添加TreeDataNode类型定义
type DirectoryTreeDataNode = TreeDataNode & {
  id: number;
  children?: DirectoryTreeDataNode[];
};

interface CreateFormState {
  chName: string; //中文名称
  daFieldList: Array<{
    chName: string; //字段中文名称
    codeTbld: string; //数据资产字段数据表准映射
    description: string; //字段说明
    enName: string; //字段英文名称
  }>
  description: string; //数据资产表描述
  directoryIds: string; //数据资产目录id
  enName: string; //英文名称
}

// 状态映射关系
const statusMap = {
  '待发布': 0,
  '已发布': 1,
  '已停用': 2,
};

export default function DataAssetManagement() {
  const actionRef = useRef<ActionType>(); // 用于刷新表格数据
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false); //创建数据资产
  const [addSubModalVisible, setAddSubModalVisible] = useState<boolean>(false); //添加下级目录
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false); //编辑目录
  const [selectedValue, setSelectedValue] = useState<string[]>([]); //目录选择
  const [treeData, setTreeData] = useState<any[]>([]); //目录数据
  const [form] = Form.useForm();
  const [DataAssetDetailVisible, setDataAssetDetailVisible] = useState(false); // 控制数据资产详情的模态框
  const [DataAssetDetail, setDataAssetDetail] = useState<CreateFormState['daFieldList']>([]); // 数据资产详情
  const [chName, setChName] = useState(''); //中文名称
  const [enName, setEnName] = useState(''); //英文名称
  const [description, setDescription] = useState(''); //描述
  const [directoryNameList, setDirectoryNameList] = useState<string[]>([]);
  const [currentNode, setCurrentNode] = useState<DirectoryTreeDataNode | null>(null); //当前操作的节点
  const [modalType, setModalType] = useState<'add' | 'edit'>('add'); //模态框类型
  const [hoveredNode, setHoveredNode] = useState<number | null>(null); //当前悬停的节点
  const [searchValue, setSearchValue] = useState<string>(''); //搜索框值
  //传递所有目录层级给子元素
  const [allDirectoryPaths, setAllDirectoryPaths] = useState<string[]>([]);
  // 获取所有目录的层级路径
  const getAllDirectoryPaths = (tree: DirectoryTreeDataNode[]): string[] => {
    const paths: string[] = [];
  
    const traverseTree = (nodes: DirectoryTreeDataNode[], parentPath: string = '') => {
      for (const node of nodes) {
        // 构造当前节点的路径
        const currentPath = parentPath ? `${parentPath}\\${node.title}` : node.title;
        paths.push(currentPath);
      
        // 如果有子节点，递归遍历子节点
        if (node.children && node.children.length > 0) {
          traverseTree(node.children, currentPath);
        }
      }
    
      
    };
    traverseTree(tree);// 调用遍历函数
    setAllDirectoryPaths(paths);
    console.log('所有目录层级',allDirectoryPaths);
    
    return paths;
  };
  // 根据目录id获取目录路径
  const getDirectoryPath = (tree: DirectoryTreeDataNode[], directoryId: string) => {
    // 定义路径数组
    const path: string[] = [];
    // 定义递归函数，用于查找目录路径
    const findPath = (nodes: DirectoryTreeDataNode[], id: string) => {
      // 遍历节点数组
      for (const node of nodes) {
        // 如果节点id与目标id相等，则将节点title添加到路径数组中
        if (node.id === id) {
          path.unshift(node.title);
          return true;
        }
        // 如果节点有子节点，则递归调用findPath函数
        if (node.children && node.children.length > 0) {
          if (findPath(node.children, id)) {
            path.unshift(node.title);
            return true;
          }
        }
      }
      
      // 如果没有找到目标id，则返回false
      return false;
    };
    // 调用findPath函数，查找目录路径
    findPath(tree, directoryId);
    // 将路径数组转换为字符串，以'\'分隔
    return path.join('\\');
  };

// 加载数据标准信息
const loadDataStandard = async (record: any) => {
  try {
    console.log('加载数据标准信息', record.dataFieldList);
    // 根据需要设置状态
  } catch (error) {
    console.error('加载数据标准失败:', error);
  }
};

  // 定义表格列
  const columns = [
    {
      title: '数据资产表中文名称',
      dataIndex: 'chName',
      key: 'chName',
      render: (text: any, record: any) => (
        <span
          style={{ cursor: 'pointer', color: 'blue' }}
          // 在点击数据资产表中文名称时获取所有目录路径
          onClick={async () => {
            console.log('打开模态框详细数据',record);
            
            setDataAssetDetailVisible(true);
            setDataAssetDetail(record.dataFieldList);
            setChName(record.chName);
            setEnName(record.enName);
            setDescription(record.description);
            loadDataStandard(record)
            try {
              // 获取目录信息
              const res = await queryDirectoryListUsingGet({ name: record.id });
            
              // 检查res.data是否是一个数组
              if (!Array.isArray(res.data)) {
                message.error('目录数据格式错误');
                setDirectoryNameList([]);
                return;
              }
            
              // 收集所有目录路径
              const directoryPaths = [];
              for (let i = 0; i < res.data.length; i++) {
                const directoryId = res.data[i].id;
                const path = getDirectoryPath(treeData, directoryId);
                directoryPaths.push(path);
              }
            
              // 更新directoryNameList
              setDirectoryNameList(directoryPaths);
            } catch (error) {
              console.error('获取目录路径失败:', error);
              message.error('获取目录路径失败');
              setDirectoryNameList([]);
            }
          }}
        >
          {text}
        </span>
      )
    },
    {
      title: '数据资产表英文名称',
      dataIndex: 'enName',
      key: 'enName',
      render: (text: any, record: any) => (
        <span
          style={{ cursor: 'pointer', color: 'blue' }}
          onClick={async () => {
            setDataAssetDetailVisible(true);
            setDataAssetDetail(record.dataFieldList);
            setChName(record.chName);
            setEnName(record.enName);
            setDescription(record.description);
          
            try {
              // 获取目录信息
              const res = await queryDirectoryListUsingGet({ name: record.id });
            
              // 检查res.data是否是一个数组
              if (!Array.isArray(res.data)) {
                message.error('目录数据格式错误');
                setDirectoryNameList([]);
                return;
              }
            
              // 收集所有目录路径
              const directoryPaths = [];
              for (let i = 0; i < res.data.length; i++) {
                const directoryId = res.data[i].id;
                const path = getDirectoryPath(treeData, directoryId);
                directoryPaths.push(path);
              }
            
              // 更新directoryNameList
              setDirectoryNameList(directoryPaths);
            } catch (error) {
              console.error('获取目录路径失败:', error);
              message.error('获取目录路径失败');
              setDirectoryNameList([]);
            }
          }}
        >
          {text}
        </span>
      )
    },
    {
      title: '数据资产表描述',
      dataIndex: 'description',
      key: 'description',
      search: false,
    },
    {
      title: '发布状态',
      dataIndex: 'status',
      key: 'status',
      type: 'select',
      initialValue: '待发布',
      valueEnum: {
        待发布: { text: '待发布' },
        已发布: { text: '已发布' },
        已停用: { text: '已停用' },
      },
      search: {
        transform: (value: any) => ({ status: statusMap[value] })
      },
      render: (text: any, record: any) => (
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
                // onOk: async () => {
                //   try {
                  
                //     await updateCodeTableStatusUsingPut({
                //       codeTableIds: [record.id],
                //       status: 1,
                //     })

                //     actionRef.current?.reload();
                //     message.success('发布成功');
                //   } catch (error) {
                //     message.error('发布失败');
                //   }
                // },
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
                // onOk: async () => {
                //   try {
                //     await updateCodeTableStatusUsingPut({
                //       codeTableIds: [record.id],
                //       status: 2,
                //     })
                //     actionRef.current?.reload();
                //     message.success('停用成功');
                //   } catch (error) {
                //     message.error('停用失败');
                //   }
                // },
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
              // setCurrentRecord(record); // 设置当前操作的记录
              // setIsEdit(true); // 设置为编辑模式
              // setModalVisible(true);
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
                // onOk: async () => {
                //   try {
                //     const res = await deleteCodeTableUsingDelete({ id: record.id });
                //     console.log('res', res);
                //     actionRef.current?.reload();
                //     message.success('删除成功');
                //   } catch (error) {
                //     message.error('删除失败');
                //   }
                // },
              });
            }}
          >
            删除
          </a>
        ),
      ].filter(Boolean),
    },
  ];

  // 获取目录树数据
  const fetchTreeData = async () => {
    try {
      const res = await getTreeUsingGet();
      const convertTreeData = (data: any[]): DirectoryTreeDataNode[] => {
        return data.map(item => ({
          title: item.name,
          key: item.id.toString(),
          id: item.id,
          children: convertTreeData(item.child || []),
          isLeaf: item.child?.length === 0,
        }));
      };
      setTreeData(convertTreeData(res.data || []));
    } catch (error) {
      console.error('获取目录树失败:', error);
    }
  };

  useEffect(() => {
    fetchTreeData();
    getAllDirectoryPaths(treeData)
  }, []);

  // Tree节点操作
  const handleAddNode = async (parentId: number, name: string) => {
    try {
      await addUsingPost({ name, parentId });
      await fetchTreeData();
      message.success('添加成功');
    } catch (error) {
      message.error('添加失败');
    }
  };

  const handleDeleteNode = async (id: number) => {
    try {
      const hasChild = await hasChildUsingGet({ id });
      if (hasChild.data) {
        message.error('该目录存在子目录，无法删除');
        return;
      }
      Modal.confirm({
        title: '确认删除',
        content: '确定要删除该目录吗？',
        onOk: async () => {
          await deleteUsingDelete({ id });
          await fetchTreeData();
          message.success('删除成功');
        },
      });
    } catch (error) {
      message.error('删除失败');
    }
  };

  // Tree节点渲染
  const renderTreeTitle = (nodeData: DirectoryTreeDataNode) => {
    return (
      <div
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}
        onMouseEnter={() => setHoveredNode(nodeData.id)}
        onMouseLeave={() => setHoveredNode(null)}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <CarryOutOutlined />
          <span style={{ marginLeft: 8 }}>{nodeData.title}</span>
        </div>
        {hoveredNode === nodeData.id && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <PlusCircleOutlined
              onClick={(e) => {
                e.stopPropagation();
                setCurrentNode(nodeData);
                setModalType('add');
                setAddSubModalVisible(true);
              }}
            />
            <EditOutlined
              onClick={(e) => {
                e.stopPropagation();
                setCurrentNode(nodeData);
                setModalType('edit');
                setEditModalVisible(true);
              }}
            />
            <MinusCircleOutlined
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteNode(nodeData.id);
              }}
            />
          </div>
        )}
      </div>
    );
  };

  // 目录操作模态框
  const DirectoryModal = ({ visible, type, node, onCancel, onConfirm }) => {
    const [form] = Form.useForm();

    useEffect(() => {
      if (type === 'edit') {
        form.setFieldsValue({ name: node?.title });
      }
    }, [node]);

    return (
      <Modal
        title={type === 'add' ? '新增目录' : '编辑目录'}
        open={visible}
        onOk={() => {
          form.validateFields().then(values => {
            onConfirm(values.name);
            form.resetFields();
          });
        }}
        onCancel={onCancel}
      >
        <Form form={form}>
          <Form.Item
            label="目录名称"
            name="name"
            rules={[{ required: true, message: '请输入目录名称' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    );
  };



  return (
    <>
      <Button
        style={{ float: 'right' }}
        type="primary"
        onClick={() => setCreateModalVisible(true)}
      >
        新增资产表
      </Button>

      <Layout style={{ minHeight: '100vh' }}>
        <Sider theme="light" width={300} style={{ padding: '0 16px' }}>
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
            数据资产表目录
            <PlusCircleOutlined
              style={{ marginLeft: 10 }}
              onClick={() => {
                setCurrentNode(null);
                setModalType('add');
                setAddSubModalVisible(true);
              }}
            />
          </div>
          <Input.Search
            placeholder="搜索目录"
            style={{ marginBottom: 16, width: '100%' }}
            onSearch={async (value) => {
              setSearchValue(value);
              // 这里可以添加搜索逻辑，比如调用后端接口搜索
              const res = await searchByNameUsingGet({ name: value });
              console.log('搜索结果:', res);
              // 搜索后更新表格数据
              actionRef.current?.reload();
            }}
          />
          <Tree
            showLine
            switcherIcon={<DownOutlined />}
            defaultExpandAll={true}
            treeData={treeData}
            titleRender={renderTreeTitle}
            onSelect={(selectedKeys) => {
              setSelectedValue(selectedKeys as string[]);
              actionRef.current?.reload();
            }}
            selectedKeys={selectedValue}
          />
        </Sider>
        <Content>
          <ProTable
            columns={columns}
            pagination={{
              showTotal: (total) => `共${total}条`,
              showSizeChanger: true,
              showQuickJumper: true,
              pageSizeOptions: ['10', '20', '30', '40'],
            }}
            request={async (params = {}) => {
              try {
                const res = await queryDataAssetListUsingPost({
                  chName: params.chName,
                  currentPage: params.current || 0,
                  pageSize: params.pageSize || 20,
                  directoryName: selectedValue[0],
                  status: params.status,
                  searchValue: searchValue, // 传递搜索值
                });
                 console.log('res', res);
                return {
                  data: res.data.records,
                  success: true,
                  total: res.data.length,
                };
              } catch (error) {
                console.error('Validation failed:', error);
              }
            }}
            actionRef={actionRef}
            rowKey="id"
          />
        </Content>
      </Layout>

      {/* 详情模态框 */}
      <Modal
        width={900}
        title="企业基本信息表"
        open={DataAssetDetailVisible}
        footer={null}
        onCancel={() => {
          setDataAssetDetailVisible(false);
          // 重置状态
          setDataAssetDetail([]);
          setChName('');
          setEnName('');
          setDescription('');
          setDirectoryNameList([]);
        }}
      >
        <strong>基本信息</strong>
        <Form>
          <Form.Item label="中文名称" style={{ marginLeft: 40, marginTop: 20 }}>
            <span>{chName}</span>
          </Form.Item>
          <Form.Item label="英文名称" style={{ marginLeft: 40, marginTop: 20 }}>
            <span>{enName}</span>
          </Form.Item>
          <Form.Item label="数据资产描述" style={{ marginLeft: 20, marginTop: 20 }}>
            <span>{description}</span>
          </Form.Item>
          <Form.Item label="所属目录" style={{ marginLeft: 40, marginTop: 20 }}>
            <div>
              {directoryNameList.map((item: any, index: number) => (
                <span key={index} style={{ marginRight: 10, backgroundColor: '#f0f0f0', padding: '5px 10px', borderRadius: '5px' }}>{item}</span>
              ))}
            </div>
          </Form.Item>
        </Form>
        <strong>字段信息</strong>
      <Table
        pagination={false}
        dataSource={DataAssetDetail}
        columns={[
          {
            title: '字段英文名称',
            dataIndex: 'enName',
            key: 'enName',
          },
          {
            title: '字段中文名称',
            dataIndex: 'chName',
            key: 'chName',
          },
          {
            title: '字段说明',
            dataIndex: 'description',
            key: 'description',
            render: (text: any, record: any) => record.description || '-',
          },
          {
            title: '数据类型',
            dataIndex: 'dataStandardVO.type',
            key: 'type',
            render: (text: any, record: any) => record.dataStandardVO?.type || '-',
          },
          {
            title: '数据长度',
            dataIndex: 'dataStandardVO.length',
            key: 'length',
            render: (text: any, record: any) => record.dataStandardVO?.length || '-',
          },
          {
            title: '数据精度',
            dataIndex: 'dataStandardVO.accuracy',
            key: 'accuracy',
            render: (text: any, record: any) => record.dataStandardVO?.accuracy || '-',
          },
          {
            title: '默认值',
            dataIndex: 'dataStandardVO.dftValue',
            key: 'dftValue',
            render: (text: any, record: any) => record.dataStandardVO?.dftValue || '-',
          },
          {
            title: '取值范围',
            dataIndex: 'dataStandardVO.valueRange',
            key: 'valueRange',
            render: (text: any, record: any) => record.dataStandardVO?.valueRange || '-',
          },
          {
            title: '枚举范围',
            dataIndex: 'dataStandardVO.codeNum',
            key: 'codeNum',
            render: (text: any, record: any) => record.dataStandardVO?.codeNum || '-',
          }
        ]}
      />
      </Modal>

      {/* 创建表单的 Modal */}
      <DataAssetForm
        allDirectoryPaths={allDirectoryPaths}
        onCancel={() => setCreateModalVisible(false)}
        modalVisible={createModalVisible}
      />

      {/* 目录操作模态框 */}
      <DirectoryModal
        visible={addSubModalVisible || editModalVisible}
        type={modalType}
        node={currentNode}
        onCancel={() => {
          setAddSubModalVisible(false);
          setEditModalVisible(false);
          setCurrentNode(null);
        }}
        onConfirm={async (name: string) => {
          if (modalType === 'add') {
            await handleAddNode(currentNode?.id || 0, name);
          } else {
            await service.muluguanli.editUsingPut({
              id: currentNode!.id,
              name
            });
            await fetchTreeData();
          }
          setAddSubModalVisible(false);
          setEditModalVisible(false);
        }}
      />
    </>
  );
}