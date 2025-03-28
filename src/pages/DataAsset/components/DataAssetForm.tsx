import React, { PropsWithChildren, useEffect, useState } from 'react';
import { Modal, Form, Input, Button, TreeSelect, message, Select } from 'antd';
import { ProForm, EditableProTable, ProColumns } from '@ant-design/pro-components';
import { PlusOutlined } from '@ant-design/icons';
import { addDataAssetUsingPost, queryDataAssetListUsingPost, queryDirectoryListUsingGet, updateStatusUsingPut, updateDataAssetUsingPut } from '@/services/DataAsset/zichanguanli';
import services from '@/services/Directory';
const { getTreeUsingGet, getDirectoryUsingGet, getResourcesByIdsUsingGet } = services.muluguanli;
import services1 from '@/services/Catalog'
const { queryDataStandardUsingPost } = services1.shujubiaozhunguanli;

interface CreateFormProps {
  isEdit: boolean;
  record?: any;
  modalVisible: boolean;
  onCancel: () => void;
}

interface DirectoryItem {
  id: number;
  path: string; // 用于存储目录路径
}

type FieldItem = {
  chName: string; // 字段中文名称
  dataStandardId: string; // 数据资产字段数据表准映射
  description: string; // 字段说明
  enName: string; // 字段英文名称
};

const CreateForm: React.FC<PropsWithChildren<CreateFormProps>> = ({ modalVisible, onCancel, isEdit, record }) => {
  const [form] = Form.useForm();
  const [treeData, setTreeData] = useState<any[]>([]); // 目录树数据
  const [directoryData, setDirectoryData] = useState<DirectoryItem[]>([]); // 所属目录数据
  const [standardMappingOptions, setStandardMappingOptions] = useState<any[]>([]); // 标准映射选项
  const [dataSource, setDataSource] = useState<FieldItem[]>([]); // 字段数据源

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
    const keys = Array.isArray(selectedKeys) ? selectedKeys : [selectedKeys];
    const paths = [];

    keys.forEach((key) => {
      const path = getFullPathByKey(treeData, key);
      console.log('选择目录path', path);

      if (path) {
        paths.push(path.join('\\'));
      }
    });

    return paths;
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      // 获取表单值
      const chName = form.getFieldValue('chName');
      const enName = form.getFieldValue('enName');
      const description = form.getFieldValue('description');
      console.log('提交directoryData', directoryData.map(item => item.path));

      const directoryIds = directoryData.map(item => item.path).join(',');
      console.log('提交directoryIds', directoryIds);

      const daFieldList = dataSource.map((field) => ({
        chName: field.chName,
        enName: field.enName,
        description: field.description,
        // dataStandardId: field.dataStandardId,
        dataStandardId: field.dataStandardId,
      }));

      // 准备请求参数
      const params1 = {
        chName,
        enName,
        description,
        directoryIds,
        daFieldList,
      };
      const params2 = {
        chName,
        enName,
        description,
        directoryIds,
        updateDaFieldLists: daFieldList,
      };

      //新增？编辑
      if (isEdit) {
        // 编辑
        console.log('编辑', record, params2);

        const response = await updateDataAssetUsingPut({ id: record.id, ...params2 });
        console.log('response', response);
        if (response.code === 100200) {
          message.success('修改成功');
          onCancel();
        } else {
          message.error('修改失败');
        }

      } else {
        // 发起请求
        const response = await addDataAssetUsingPost(params1);

        if (response.code === 100200) {
          message.success('提交成功');
          onCancel();
        } else {
          message.error('提交失败');
        }
      }


    } catch (error) {
      message.error('提交失败');
      console.error('error', error);
    }
  };

  // 目录表格列配置
  const directoryColumns: ProColumns[] = [
    {
      title: '所属目录',
      dataIndex: 'path',
      valueType: 'text',
      formItemProps: {
        rules: [{ required: true, message: '请选择所属目录' }],
      },
      renderFormItem: (_, { record }) => (
        <TreeSelect
          treeData={treeData}
          placeholder="请选择所属目录"
          style={{ width: '100%' }}
          treeDefaultExpandAll
          showSearch
          treeNodeFilterProp="title"
          fieldNames={{ label: 'title', value: 'key', children: 'children' }}
          onChange={(value) => {
            // const path = getFullPathByKey(treeData, value)?.join('\\') || '';
            // console.log('record', record);

            // setDirectoryData(prev =>
            //   prev.map(item =>
            //     item.id === record.id ? { ...item, id: value, path } : item
            //   )
            // );
            // console.log('pathh', path);
            // console.log('setDirectoryData', [directoryData]);


          }}
        />
      ),
      // render: (text, record) => record.path || '',
      render: (text, record) => {
        console.log('Rendering directory path:', directoryData, record, text);
        // return getDirectoryPaths(record.path[0]) || '';
        // if (isEdit && record.path) {// 如果是编辑模式并且record.path存在
        //   return getDirectoryPaths(record.path[0]) || '';
        // } else 
        //如果存在record.index这个字段,index为0也是存在
        // if (record.index || record.index === 0) {
        console.log('record.path[0]', record.path);

        return getDirectoryPaths(record.path) || '';
        // } else {
        //   return record.path || '';
        // }
      },
    },
    {
      title: '操作',
      valueType: 'option',
      render: (text, record, _, action) => [
        <a key="delete" onClick={() => {
          setDirectoryData(prev => prev.filter(item => item.id !== record.id));
        }}>
          删除
        </a>,

        <a key="editable" onClick={() => action?.startEditable?.(record.id)}>
          编辑
        </a>,
      ],
    },
  ];

  // 字段表格列配置
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
      render: (text, record) => {
        const option = standardMappingOptions.find(option => option.value === record.dataStandardId);
        return option ? option.label : '';
      },
    },
    {
      title: '操作',
      valueType: 'option',
      render: (text, record, _, action) => [
        <a key="delete" onClick={() => {
          setDataSource(prev => prev.filter(item => item.id !== record.id));
        }}>
          删除
        </a>,
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
          console.log('res.data', res.data);

          const convertedTreeData = convertTreeData(res.data);
          console.log('convertedTreeData', convertedTreeData);

          setTreeData(convertedTreeData);
        }
      } catch (error) {
        console.error('获取目录树失败:', error);
      }
    };

    fetchTreeData();

    // 获取标准映射选项
    const fetchStandardMappingOptions = async () => {
      try {
        const res = await queryDataStandardUsingPost({
          currentPage: 1,
          pageSize: 1000,
        });
        const options = res.data.records.map((item: any) => ({
          label: `${item.id} ${item.chName} ${item.enName}`,
          value: item.id,
        }));
        setStandardMappingOptions(options);
      } catch (e) {
        console.log(e);
      }
    };

    fetchStandardMappingOptions();

    // 初始化编辑状态
    if (isEdit && record) {
      form.setFieldsValue({
        chName: record.chName,
        enName: record.enName,
        description: record.description,
      });

      // 初始化目录数据
      const directoryIds = record.directoryId.split(',');
      const paths = getDirectoryPaths(directoryIds);
      // const directories = directoryIds.map((id, index) => ({
      //   id,
      //   path: paths[index] || '',
      // }));
      console.log('directoryIds', directoryIds);

      const directories = directoryIds.map((id, index) => ({
        id: Date.now().toString(), // 生成一个唯一的ID
        path: id,
      }));
      console.log('编辑', directories);

      setDirectoryData(directories);

      // 初始化字段数据
      setDataSource(record.dataFieldList || []);
    } else {
      // 新增

      form.resetFields();
      setDirectoryData([]);
      setDataSource([]);

    }
  }, [isEdit, record]);

  return (
    <Modal
      open={modalVisible}
      onCancel={onCancel}
      title={isEdit ? "编辑资产表" : "新增资产表"}
      onOk={handleSubmit}
      width={1000}
      destroyOnClose
    >
      <ProForm form={form} layout="vertical" submitter={false} initialValues={isEdit ? record : null}>
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
          rowKey="id"
          columns={directoryColumns}
          value={directoryData}
          onChange={(value) => { setDirectoryData([...value]) }}
          recordCreatorProps={{
            position: 'bottom',
            record: () => ({
              id: Date.now(), // 临时ID
              path: ''
            }),
            creatorButtonText: '添加目录',
            icon: <PlusOutlined />,
          }}
          editable={{
            onSave: (key, row) => {
              setDirectoryData(prev => prev.map(item => item.id === key ? row : item));
            },
            onDelete: (key) => {
              setDirectoryData(prev => prev.filter(item => item.id !== key));
            },

          }}
        />

        <EditableProTable<FieldItem>
          headerTitle="数据资产表字段添加"
          rowKey="id"
          columns={daFieldListColumns}
          value={dataSource}
          onChange={setDataSource}
          recordCreatorProps={{
            position: 'bottom',
            record: () => ({
              id: Date.now(),
              chName: '',
              enName: '',
              description: '',
              dataStandardId: '',
            }),
            creatorButtonText: '新增字段',
            icon: <PlusOutlined />,
          }}
          editable={{
            onSave: (key, row) => {
              setDataSource(prev => prev.map(item => item.id === key ? row : item));
            },
            onDelete: (key) => {
              setDataSource(prev => prev.filter(item => item.id !== key));
            },
          }}
        />
      </ProForm>
    </Modal>
  );
};

export default CreateForm;