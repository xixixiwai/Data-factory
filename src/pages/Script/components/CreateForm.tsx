import { Modal, Form, Input, Button, Upload, message, Select, TreeSelect } from 'antd';
import React, { useRef, useState } from 'react';
import { PlusCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { EditableProTable, ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ProCard,
  ProFormField,
  ProFormRadio,
} from '@ant-design/pro-components';
interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
}

type scriptData = {
  id: React.Key;
  name?: string;
  pageNumber: number;
  pageSize: number;
  status?: number;
  description?: string;
  updateTime?: string;
  className?: string;
  funcName?: string;
  requestParams?: Record<string, any>[];
  responseParams?: Record<string, any>[];
}

type inputData = {
  id: React.Key;
  name?: string;
  type?: string;
  required?: boolean;
  description?: string;
}
type outputData = {
  id: React.Key;
  name?: string;
  type?: string;
  description?: string;
}
const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel } = props;
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const actionRef = useRef<ActionType>();
  const [inputDataSource, setInputDataSource] = useState<readonly inputData[]>([]);
  const [outputDataSource, setOutputDataSource] = useState<readonly outputData[]>([]);
  const [position, setPosition] = useState<'top' | 'bottom' | 'hidden'>(
    'bottom',
  );
  const [treeData, setTreeData] = useState<any[]>([]);
  const [form] = Form.useForm();

  const [fileList, setFileList] = useState<{ uid: string; name: string; status: string; url: string }[]>([]);



  const columns1: ProColumns<inputData>[] = [
    {
      title: '参数名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '数据类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '是否必填',
      dataIndex: 'required',
      key: 'required',
      valueType: 'select',
      valueEnum: {
        true: '是',
        false: '否',
      },
    },
    {
      title: '参数描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => {
            setInputDataSource(inputDataSource.filter((item) => item.id !== record.id));
          }}
        >
          删除
        </a>,
      ],
    },
  ]
  // 保存文件列表
  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };


  // 表单提交
  const handleFinish = (values) => {

  };

  return (
    <Modal
      title="创建脚本"
      visible={modalVisible}
      onCancel={onCancel}
      footer={null}
      width={1200}
    >
      <Form
        form={form}
        onFinish={handleFinish}
        layout='horizontal'
      >
        <Form.Item
          label="文件上传"
          name="file"
          rules={[
            { required: true, message: '请上传文件' },
          ]}
        >
          <Upload
            onChange={handleChange}
            fileList={fileList}
            accept=".py"
          >
            <Button icon={<UploadOutlined />}>上传文件</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          label="脚本名称"
          name="scriptName"
          rules={[
            { required: true, message: '请输入脚本名称' },
          ]}
        >
          <Input placeholder="请输入脚本名称" />
        </Form.Item>

        <Form.Item
          label="脚本分类"
          name="scriptCategory"
        >
          <TreeSelect
            treeData={treeData}
          />
        </Form.Item>

        <Form.Item
          label="脚本类型"
          name="scriptType"
        >
          <Select
            defaultValue="Python"
          >
            <Select.Option value="Python">Python</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="类名"
          name="className"
          rules={[
            { required: true, message: '请输入类名' },
          ]}
        >
          <Input placeholder="请输入类名" />
        </Form.Item>

        <Form.Item
          label="函数名"
          name="functionName"
          rules={[
            { required: true, message: '请输入函数名' },
          ]}
        >
          <Input placeholder="请输入函数名" />
        </Form.Item>

        <Form.Item
          label="描述"
          name="functionDescription"
        >
          <Input placeholder="请输入描述" type='textarea' />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            确定
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={onCancel}>
            取消
          </Button>
        </Form.Item>
      </Form>
      <EditableProTable<inputData>
        rowKey="id"
        headerTitle="输入参数"
        recordCreatorProps={
          {
            record: () => ({ id: (Math.random() * 1000000).toFixed(0) }),
          }
        }
        loading={false}
        toolBarRender={() => [
          <ProFormRadio.Group
            key="render"
            fieldProps={{
              value: position,
              onChange: (e) => setPosition(e.target.value),
            }}

          />,
        ]}
        columns={columns1}
        // request={async () => ({
        //   data: defaultData,
        //   total: 3,
        //   success: true,
        // })}
        value={inputDataSource}
        onChange={setInputDataSource}
        editable={{
          type: 'multiple',
          editableKeys,
          onSave: async (rowKey, data, row) => {
            console.log(rowKey, data, row);
          },
          onChange: setEditableRowKeys,
        }}
      />

      <EditableProTable<outputData>
        rowKey="id"
        headerTitle="输入参数"
        recordCreatorProps={
          {
            record: () => ({ id: (Math.random() * 1000000).toFixed(0) }),
          }
        }
        loading={false}
        toolBarRender={() => [
          <ProFormRadio.Group
            key="render"
            fieldProps={{
              value: position,
              onChange: (e) => setPosition(e.target.value),
            }}

          />,
        ]}
        columns={[{
          title: '参数名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '数据类型',
          dataIndex: 'type',
          key: 'type',
        },
        {
          title: '参数描述',
          dataIndex: 'description',
          key: 'description',
        },
        {
          title: '操作',
          valueType: 'option',
          render: (text, record, _, action) => [
            <a
              key="editable"
              onClick={() => {
                action?.startEditable?.(record.id);
              }}
            >
              编辑
            </a>,
            <a
              key="delete"
              onClick={() => {
                setOutputDataSource(outputDataSource.filter((item) => item.id !== record.id));
              }}
            >
              删除
            </a>,
          ],
        },
        ]}
        // request={async () => ({
        //   data: defaultData,
        //   total: 3,
        //   success: true,
        // })}
        value={outputDataSource}
        onChange={setOutputDataSource}
        editable={{
          type: 'multiple',
          editableKeys,
          onSave: async (rowKey, data, row) => {
            console.log(rowKey, data, row);
          },
          onChange: setEditableRowKeys,
        }}

      />


    </Modal>
  );
};

export default CreateForm;