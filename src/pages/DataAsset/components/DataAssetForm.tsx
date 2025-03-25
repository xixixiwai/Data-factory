import React, { PropsWithChildren, useEffect, useState } from 'react';
import { Modal, Form, Input, Button, TreeSelect, message } from 'antd';
import { ProForm, EditableProTable } from '@ant-design/pro-components';
import { PlusOutlined } from '@ant-design/icons';
import { addDataAssetUsingPost } from '@/services/DataAsset/zichanguanli';
import services from '@/services/Directory';
const { getTreeUsingGet } = services.muluguanli;

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
}

interface CreateFormState {
  chName: string; // 中文名称
  daFieldList: Array<{
    chName: string; // 字段中文名称
    codeTbld: string; // 数据资产字段数据表准映射
    description: string; // 字段说明
    enName: string; // 字段英文名称
  }>;
  description: string; // 数据资产表描述
  directoryIds: string; // 数据资产目录id
  enName: string; // 英文名称
}

type DirectoryItem = {
  id: string;
  directory?: string[];
  path?: string; // 用于存储目录路径
};

type FieldItem = {
  id: string;
  enName?: string;
  chName?: string;
  description?: string;
  standardMapping?: string;
};

const CreateForm: React.FC<PropsWithChildren<CreateFormProps>> = ({ modalVisible, onCancel }) => {
  const [form] = Form.useForm();
  const [treeData, setTreeData] = useState<any[]>([]); // 目录树数据
  const [directoryData, setDirectoryData] = useState<DirectoryItem[]>([]); // 所属目录数据
  const [fieldData, setFieldData] = useState<FieldItem[]>([]); // 字段列表

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
  }, []);

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

  // 根据选中的目录键值获取路径
  const getDirectoryPaths = (selectedKeys: string | string[]) => {
    const keys = Array.isArray(selectedKeys) ? selectedKeys : [selectedKeys];
    const paths = [];

    keys.forEach((key) => {
      const path = getFullPathByKey(treeData, key);
      if (path) {
        paths.push(path.join('\\'));
      }
    });

    return paths;
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

  const handleSubmit = async () => {
    let response;
    try {
      response = await addDataAssetUsingPost({
        chName: form.getFieldValue('chName'),
        daFieldList: fieldData,
        description: form.getFieldValue('description'),
        directoryIds: directoryData.map(item => item.id).join(','),
        enName: form.getFieldValue('enName'),
      });
      console.log('response', response);
      message.success('提交成功');
      onCancel();
    } catch (error) {
      message.error('提交失败');
      console.error(error);
    }
  };

  const directoryColumns: ProColumns<DirectoryItem>[] = [
    {
      title: '所属目录',
      dataIndex: 'directory',
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
          onChange={(value) => {
            const paths = getDirectoryPaths(value);
            const directories = value.map((key, index) => ({
              id: key,
              directory: paths[index],
            }));
            setDirectoryData(directories);
          }}
          treeNodeFilterProp="title"
          fieldNames={{ label: 'title', value: 'key', children: 'children' }}
        />
      ),
      render: (text, record) => record.path || '',
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
      dataIndex: 'standardMapping',
      formItemProps: {
        rules: [{ required: true, message: '请选择标准映射' }],
      },
      renderFormItem: () => (
        <Select
          placeholder="请选择标准映射"
          showSearch
          optionFilterProp="label"
          options={[
            { label: '标准1', value: '1' },
            { label: '标准2', value: '2' },
            { label: '标准3', value: '3' },
          ]}
        />
      ),
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

  return (
    <Modal
      open={modalVisible}
      onCancel={onCancel}
      title="新增资产表"
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          保存
        </Button>,
      ]}
      width={1000}
      destroyOnClose
    >
      <ProForm form={form} layout="vertical" submitter={false}>
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
          onChange={setDirectoryData}
          recordCreatorProps={{
            position: 'bottom',
            record: () => ({ id: Date.now().toString() }),
            creatorButtonText: '添加目录',
            icon: <PlusOutlined />,
          }}
          editable={{
            onSave: async (key, row) => {
              setDirectoryData(prev => prev.map(item => item.id === row.id ? row : item));
            },
            onDelete: async (key) => {
              setDirectoryData(prev => prev.filter(item => item.id !== key));
            },
          }}
        />

        <EditableProTable<FieldItem>
          headerTitle="数据资产表字段添加"
          name="daFieldList"
          rowKey="id"
          columns={daFieldListColumns}
          value={fieldData}
          onChange={setFieldData}
          recordCreatorProps={{
            position: 'bottom',
            record: () => ({ id: Date.now().toString() }),
            creatorButtonText: '新增字段',
            icon: <PlusOutlined />,
          }}
          editable={{
            onSave: async (key, row) => {
              setFieldData(prev => prev.map(item => item.id === row.id ? row : item));
            },
            onDelete: async (key) => {
              setFieldData(prev => prev.filter(item => item.id !== key));
            },
          }}
        />
      </ProForm>
    </Modal>
  );
};

export default CreateForm;