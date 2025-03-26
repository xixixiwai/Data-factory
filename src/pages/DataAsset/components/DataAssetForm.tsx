import React, { PropsWithChildren, useEffect, useState } from 'react';
import { Modal, Form, Input, Button, TreeSelect, message,Select } from 'antd';
import { ProForm, EditableProTable,ProColumns } from '@ant-design/pro-components';
import { PlusOutlined } from '@ant-design/icons';
import { addDataAssetUsingPost,queryDataAssetListUsingPost, queryDirectoryListUsingGet,updateStatusUsingPut } from '@/services/DataAsset/zichanguanli';
import services from '@/services/Directory';
const { getTreeUsingGet } = services.muluguanli;
import services1 from '@/services/Catalog'
const { queryDataStandardUsingPost } = services1.shujubiaozhunguanli

interface CreateFormProps {
  isEdit: boolean;
  record?: any;
  modalVisible: boolean;
  onCancel: () => void;
}

interface CreateFormState {
  chName: string; // 中文名称
  daFieldList: Array<{
    chName: string; // 字段中文名称
    dataStandardId: string; // 数据资产字段数据表准映射
    description: string; // 字段说明
    enName: string; // 字段英文名称
  }>;
  description: string; // 数据资产表描述
  id: string; // 数据资产目录id
  enName: string; // 英文名称
}

type DirectoryItem = {
  id: string;
  path?: string; // 用于存储目录路径
};

type FieldItem = {
  chName: string,//字段中文名称
  dataStandardId: string,//数据资产字段数据表准映射
  description:string,
  enName:string
};

const CreateForm: React.FC<PropsWithChildren<CreateFormProps>> = ({ modalVisible, onCancel,isEdit,record }) => {
  const [form] = Form.useForm();
  const [treeData, setTreeData] = useState<any[]>([]); // 目录树数据
  const [directoryData, setDirectoryData] = useState<DirectoryItem[]>([]); // 所属目录数据
  const [standardMappingOptions, setStandardMappingOptions] = useState<string[]>([]);// 用于存储标准映射选项
  //数据资产表数据对象
  const [dataSource, setDataSource] = useState<FieldItem[]>([]);



  // 将后端返回的目录树数据转换为 TreeSelect 需要的格式
  const convertTreeData = (data: any[]): any[] => {
    return data.map((item) => {
      return {
        title: item.name,
        key: item.id.toString(),
        value: item.id.toString(),
        children: item.child ? convertTreeData(item.child) : [],
      };
    });
  };

 

  // 递归查找键值对应的完整路径
  const getFullPathByKey = (tree: any[], key: string): string[] | null => {
    for (const node of tree) {
      if (node.key === key) {
        return [node.title];
      }
      if (node.children) {
        const result = getFullPathByKey(node.children, key);
        if (result) {
          return [node.title, ...result];
        }
      }
    }
    return null;
  };
 // 根据选中的目录键值获取路径
  const getDirectoryPaths = (selectedKeys: string | string[]) => {
    const keys = Array.isArray(selectedKeys) ? selectedKeys : [selectedKeys];// 将单个键值转换为数组
    const paths = [];// 用于存储目录路径

    keys.forEach((key) => {
      const path = getFullPathByKey(treeData, key);
      if (path) {
        paths.push(path.join('\\'));
      }
    });

    return paths;
  };
  const handleSubmit = async () => {
    try {
      // 获取表单值
      const chName = form.getFieldValue('chName');
      const enName = form.getFieldValue('enName');
      const description = form.getFieldValue('description');
      //directoryData
      console.log('新增',directoryData.map(item => item).join(','));
      console.log('新增datasource',dataSource);
      //目录id列表
      const directoryIds = directoryData.map(item => item).join(',');
      //字段列表
      const daFieldList = dataSource.map((field)=>({
          chName:field.chName,
          enName:field.enName,
          description:field.description,
          dataStandardId:field.dataStandardId,
      }))
      console.log('daFieldList',daFieldList);
      
      // 准备请求参数
      const params = {
        chName,
        enName,
        description,
        directoryIds: directoryIds,
        daFieldList: daFieldList,
      };
      console.log('提交数据',params);
      // 发起请求
      const response = await addDataAssetUsingPost(params);
      if (response.code === 100200) {
        message.success('提交成功');
        onCancel();
      } else {
        message.error('提交失败');
      }
    } catch (error) {
      message.error('提交失败');
      console.error('error',error);
    }
  };

   const directoryColumns: ProColumns<DirectoryItem>[] = [
    {
      title: '所属目录',
      dataIndex: 'path',
      valueType: 'text',
      formItemProps: {
        rules: [{ required: true, message: '请选择所属目录' }],
      },
      renderFormItem: () => (
        <TreeSelect
          treeData={treeData}
          placeholder="请选择所属目录"
          style={{ width: '100%' }}
          treeDefaultExpandAll
          showSearch
          treeCheckable
          multiple
          maxCount={1}
          onChange={(value) => {
            console.log('Selected directory keys:', value);
            const paths = getDirectoryPaths(value);
            console.log('Fetched directory paths:', paths);
            
            const directories = value.map((key, index) => ({
              id: key,
              path: paths[0],
            }));
            console.log('Directories to set:', directories);
            setDirectoryData(directories.map(item => item.path));
            console.log('paths', paths);
            
            console.log('directoryData:', directoryData);
            
          }}
          treeNodeFilterProp="title"
          fieldNames={{ label: 'title', value: 'key', children: 'children' }}
        />
      ),
      render: (text, record) => {
        console.log('Rendering directory path:', directoryData,record,text);
        return getDirectoryPaths(record.path[0]) || '';
      },
    },
    {
      title: '操作',
      valueType: 'option',
      render: (text, record, _, action) => [
        <a key="editable" onClick={() => action?.startEditable?.(record.id)}>
          编辑
        </a>,
      ],
    },
  ];

  const daFieldListColumns: ProColumns<FieldItem>[] = [
    {
      title: '字段英文名称',
      dataIndex: 'enName',
      formItemProps: {
        rules: [{ required: true, message: '请输入字段英文名称' }],
      },
      renderFormItem: () => <Input placeholder="请输入字段英文名称" />,
    },
    {
      title: '字段中文名称',
      dataIndex: 'chName',
      formItemProps: {
        rules: [{ required: true, message: '请输入字段中文名称' }],
      },
      renderFormItem: () => <Input placeholder="请输入字段中文名称" />,
    },
    {
      title: '字段说明',
      dataIndex: 'description',
      formItemProps: {
        rules: [{ required: true, message: '请输入字段说明' }],
      },
      renderFormItem: () => <Input placeholder="请输入字段说明" />,
    },
    {
      title: '标准映射',
      dataIndex: 'dataStandardId',
      formItemProps: {
        rules: [{ required: true, message: '请选择标准映射' }],
      },
      renderFormItem: () => (
        <Select
          placeholder="请选择标准映射"
          showSearch
          optionFilterProp="label"
          options={standardMappingOptions}
        />
      ),
      render: (text, record) => (record.dataStandardId ? standardMappingOptions.find(option => option.value === record.dataStandardId)?.label : ''),
      
    },
    {
      title: '操作',
      valueType: 'option',
      render: (text, record, _, action) => [
        <a key="editable" onClick={() => action?.startEditable?.(record.id)}>
          编辑
        </a>,
      ],
    },
  ];
  useEffect(() => {
  // 获取目录树数据
  const fetchTreeData = async () => {
    try {
      const res = await getTreeUsingGet();
      if (res.data) {
        const convertedTreeData = convertTreeData(res.data);
        setTreeData(convertedTreeData);
      }
    } catch (error) {
      console.error('获取目录树失败:', error);
    }
  };

  fetchTreeData();

  // 获取映射标准
  const fetchStandardMappingOptions = async () => {
    try {
      const res = await queryDataStandardUsingPost({// 查询标准映射
        currentPage: 1,
        pageSize: 1000,
      });
      const options = res.data.records.map((item: any) => ({//
        label: `${item.id} ${item.chName} ${item.enName}`,
        value: item.id,
      }));
      console.log();
      
      setStandardMappingOptions(options);
    } catch (e) {
      console.log(e);
    }
  };

  fetchStandardMappingOptions();

    if (isEdit && record) {
    // 初始化表单数据
    form.setFieldsValue({
      chName: record.chName,
      enName: record.enName,
      description: record.description,
    });

    // 调用后端接口获取目录信息
    const fetchDirectoryInfo = async () => {
      try {
        // 假设通过 record.id 查询目录信息
        const res = await queryDirectoryListUsingGet({ name: record.id });
        if (res.data && res.data.length > 0) {
          const directoryId = res.data[0].id;
          console.log('directoryId',directoryId);
          //把directoryId转换为['']形式
          const directoryIdArray = [directoryId];
          console.log('directoryIdArray', directoryIdArray);
          
          const paths = getDirectoryPaths(directoryIdArray);//明天记得把这个地方试一下['4']这种形式的行不行
          console.log('paths', paths);
          
          if (paths) {
            // 设置目录数据
            setDirectoryData([
              {
                id: directoryId,
                path: paths.join('\\'),
              },
            ]);
          }
        }
      } catch (error) {
        console.error('获取目录信息失败:', error);
      }
    };

    fetchDirectoryInfo();

    // 初始化字段数据
    if (record.dataFieldList) {
      const initialDataSource = record.dataFieldList.map((field: any) => ({
        chName: field.chName,
        dataStandardId: field.dataStandardId,
        description: field.description,
        enName: field.enName,
      }));
      setDataSource(initialDataSource);
    }
  } else {
    form.resetFields();
  }
}, [isEdit, record]);
  return (
    <Modal
      open={modalVisible}
      onCancel={
        onCancel
        
      }
      title={isEdit ? "编辑资产表" : "新增资产表"}
      // footer={[
      //   <Button key="cancel" onClick={onCancel}>
      //     取消
      //   </Button>,
      //   <Button key="submit" type="primary" onClick={handleSubmit(params)}>
      //     保存
      //   </Button>,
      // ]}
      onOk={handleSubmit}
      width={1000}
      destroyOnClose
    >
      <ProForm form={form} layout="vertical" submitter={false} initialValues={isEdit?record:null} 
      
      >
        <ProForm.Item
          label="中文名称"
          name="chName"
          rules={[{ required: true, message: '请输入数据资产表名称' }]}
        >
          <Input placeholder="请输入数据资产表名称" />
        </ProForm.Item>

        <ProForm.Item
          label="英文名称"
          name="enName"
          rules={[{ required: true, message: '请输入数据资产表英文名称' }]}
        >
          <Input placeholder="请输入数据资产表英文名称" />
        </ProForm.Item>

        <ProForm.Item
          label="数据资产表描述"
          name="description"
          rules={[{ required: true, message: '请输入数据资产表描述' }]}
        >
          <Input.TextArea placeholder="请输入数据资产表描述" rows={4} />
        </ProForm.Item>

        <EditableProTable<DirectoryItem>
          headerTitle="所属目录"
          name="directory"
          rowKey="id"
          columns={directoryColumns}
          value={directoryData}
          onChange={(value)=>{
           console.log('所属目录value',value.map(item => item.path));
           setDirectoryData(value.map(item => item.path))
            console.log(directoryData);
            
          }
          }
          recordCreatorProps={{
            position: 'bottom',
            record: () => ({ id: Date.now().toString() }),
            creatorButtonText: '添加目录',
            icon: <PlusOutlined />,
          }}
          // editable={{
          //   onSave: async (key, row) => {
          //     setDirectoryData(prev => prev.map(item => item.id === row.id ? row : item));
          //   },
          //   onDelete: async (key) => {
          //     setDirectoryData(prev => prev.filter(item => item.id !== key));
          //   },
          // }}
        />

        <EditableProTable<FieldItem>
          headerTitle="数据资产表字段添加"
          name="dataFieldList"
          rowKey="id"
          columns={daFieldListColumns}
          value={dataSource}
          onChange={(value)=>{
            console.log('字段value',value);
            
            setDataSource([...value])
          }}
          recordCreatorProps={{
            position: 'bottom',
            record: () => ({ id: Date.now().toString() }),
            creatorButtonText: '新增字段',
            icon: <PlusOutlined />,
          }}
          editable={{
            onSave: async (key, row) => {
              setDataSource(prev => prev.map(item => item.id === row.id ? row : item));
            },
            onDelete: async (key) => {
              setDataSource(prev => prev.filter(item => item.id !== key));
            },
          }}
        />
      </ProForm>
    </Modal>
  );
};

export default CreateForm;