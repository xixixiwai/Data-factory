import { Modal, Form, Input, Button, Upload, message, Select, TreeSelect, TreeDataNode } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import { PlusCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { EditableProTable, ActionType, ProColumns } from '@ant-design/pro-components';
import { searchListAndChildUsingGet, getDirectoryUsingGet } from '@/services/Directory/muluguanli'
import {
  ProCard,
  ProFormField,
  ProFormRadio,
} from '@ant-design/pro-components';
import services from '@/services/Script'
const { uploadFileUsingPost, addScriptInfoUsingPost, batchUpdatePythonScriptStatusUsingPut, classifyPythonScriptUsingPut, deletePythonScriptUsingDelete, queryPythonScriptUsingPost, testPythonScriptUsingPost, updatePythoScriptUsingPut } = services.pythonScriptController
import { UploadFile } from 'antd/lib/upload/interface';

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  isEdit: boolean;
  record?: scriptData;
  onSuccess?: () => void;
}
type DirectoryTreeDataNode = TreeDataNode & {
  id: number;
  children?: DirectoryTreeDataNode[];
};
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
  const { modalVisible, onCancel, isEdit, record, onSuccess } = props;
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const actionRef = useRef<ActionType>();
  const [inputDataSource, setInputDataSource] = useState<readonly inputData[]>([]);
  const [outputDataSource, setOutputDataSource] = useState<readonly outputData[]>([]);
  const [position, setPosition] = useState<'top' | 'bottom' | 'hidden'>(
    'bottom',
  );
  const [treeData, setTreeData] = useState<any[]>([]);
  const [form] = Form.useForm();

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // 获取TreeSelect 的数据// 获取目录树数据
  const fetchTreeData = async () => {
    try {
      const res = await searchListAndChildUsingGet({ name: 'Python脚本' });

      // 将后端返回的目录树数据转换为 TreeSelect 需要的格式
      const convertTreeData = (data: any[]): any[] => {
        return data.map((item) => {
          return {
            title: item.name,
            key: item.id.toString(),
            value: item.id.toString(),
            children: item.children ? convertTreeData(item.children) : [],
          };
        });
      };
      console.log('目录树数据:', convertTreeData(res));
      setTreeData(convertTreeData(res || []));
    } catch (error) {
      console.error('获取目录树失败:', error);
    }
  };
  const columns1: ProColumns<inputData>[] = [
    {
      title: '参数名称',
      dataIndex: 'paramInName',
      key: 'paramInName',
    },
    {
      title: '数据类型',
      dataIndex: 'dataInType',
      key: 'dataInType',
      valueType: 'select',
      valueEnum: {
        //字符串-1，整数-2，浮点数-3，布尔值-4，列表-5，字典-6，文件-7
        1: { text: 'Int' },
        2: { text: 'String' },
        3: { text: 'Float' },
      }
    },
    {
      title: '是否必填',
      dataIndex: 'isRequired',
      key: 'isRequired',
      valueType: 'select',
      valueEnum: {
        //是-1，否
        1: { text: '是' },
        0: { text: '否' },

      },
    },
    {
      title: '参数描述',
      dataIndex: 'paramIndescription',
      key: 'paramIndescription',
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
  // 表单提交
  const handleFinish = async (values: any) => {

    console.log('提交values', values);
    try {
      const params = {
        ...values,
        requestParams: values.requestParams?.map(item => ({
          paramInName: item.paramInName,
          dataInType: item.dataInType,
          isRequired: item.isRequired,
          paramIndescription: item.paramIndescription,
          dataInValue: "1",
        })),
        status: 0
      }
      console.log('params', params);

      const res = await addScriptInfoUsingPost(params)
      if (res.code === 100200) {
        message.success('提交成功');
        actionRef.current?.reload();
        onSuccess();
      }
      onCancel()


    } catch (e) {
      console.log('提交失败', e);

    }
  };

  useEffect(() => {
    fetchTreeData();
    // 编辑状态
    if (isEdit && record) {
      console.log('record编辑', record);

      form.setFieldsValue({

        name: record?.name,
        classified: record?.classified,
        style: record?.style,
        file: record?.file,
        className: record?.className,
        funcName: record?.funcName,
        requestParams: Array.isArray(record?.requestParams)
          ? record?.requestParams?.map(item => ({
            paramInName: item.paramInName,
            dataInType: item.dataInType,
            isRequired: item.isRequired,
            paramIndescription: item.paramIndescription,
          }))
          : record?.requestParams
            ? [{
              paramInName: record?.requestParams?.paramInName,
              dataInType: record?.requestParams?.dataInType,
              isRequired: record?.requestParams?.isRequired,
              paramIndescription: record?.requestParams?.paramIndescription,
            }]
            : [],
        responseParams: Array.isArray(record?.responseParams)
          ? record?.responseParams?.map(item => ({
            paramOutName: item.paramOutName,
            dataOutType: item.dataOutType,
            isRequired: item.isRequired,
            dataOutValue: item.dataOutValue,
            paramOutdescription: item.paramOutdescription,
          })) : record?.responseParams
            ? [{
              paramOutName: record?.responseParams?.paramOutName,
              dataOutType: record?.responseParams?.dataOutType,
              isRequired: record?.responseParams?.isRequired,
              dataOutValue: record?.responseParams?.dataOutValue,
              paramOutdescription: record?.responseParams?.paramOutdescription,
            }] : [],
      });
    } else {
      form.resetFields();
    }
  }, [record, isEdit])
  return (
    <Modal
      title={isEdit ? '编辑脚本' : '创建脚本'}
      open={modalVisible}
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
            key="files"
            accept=".py"
            name='file'
            beforeUpload={async (file) => {
              try {
                const response = await uploadFileUsingPost({}, file);
                console.log('response', response);

                // 更新fileList
                setFileList([{ uid: file.uid, name: file.name, status: 'done', url: response.data }]);
                return false;
              } catch (error) {
                message.error('上传失败');
                return false;
              }
            }}
            fileList={fileList}
          >
            <Button icon={<UploadOutlined />}>
              上传文件
            </Button>
          </Upload>
        </Form.Item>

        <Form.Item
          label="脚本名称"
          name="name"
          rules={[
            { required: true, message: '请输入脚本名称' },
          ]}
        >
          <Input placeholder="请输入脚本名称" />
        </Form.Item>

        <Form.Item
          label="脚本分类"
          name="classified"
        >
          <TreeSelect
            treeData={treeData}
            placeholder="请选择脚本分类"
            showCheckedStrategy={TreeSelect.SHOW_PARENT}
            treeDefaultExpandAll
            onChange={(value, label, extra) => {
              console.log('onChange', value, label, extra);
            }}
          />
        </Form.Item>
        <Form.Item
          label="脚本类型"
          name="style"
        >
          <Select
            defaultValue="Python"
            style={{ width: '100%' }}

          >
            <Select.Option value="Python">Python</Select.Option>
            <Select.Option value="Shell">Shell</Select.Option>
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
          name="funcName"
          rules={[
            { required: true, message: '请输入函数名' },
          ]}
        >
          <Input placeholder="请输入函数名" />
        </Form.Item>

        <Form.Item
          label="描述"
          name="description"
        >
          <Input placeholder="请输入描述" type='textarea' />
        </Form.Item>

        <EditableProTable<inputData>
          rowKey="id"
          headerTitle="输入参数"
          name="requestParams"
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
          headerTitle="输出参数"
          name="responseParams"
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
            dataIndex: 'paramOutName',
            key: 'paramOutName',
          },
          {
            title: '数据类型',
            dataIndex: 'dataOutType',
            key: 'dataOutType',
            valueType: 'select',
            valueEnum: {
              //字符串-1，整数-2，浮点数-3，布尔值-4，列表-5，字典-6，文件-7
              1: { text: 'Int' },
              2: { text: 'String' },
              3: { text: 'Float' },
            }
          },
          {
            title: '参数描述',
            dataIndex: 'paramOutdescription',
            key: 'paramOutdescription',
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
        <Form.Item>
          <Button type="primary" htmlType="submit">
            确定
          </Button>
          <Button style={{ marginLeft: 10 }} onClick={onCancel}>
            取消
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateForm;