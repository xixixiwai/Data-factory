import { Button, Modal, Form } from 'antd';
import React, { PropsWithChildren, useEffect, useState, useRef } from 'react';
import type { ProFormInstance } from '@ant-design/pro-components';
import {
  ProCard,
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm,
  EditableProTable,
  ActionType,
} from '@ant-design/pro-components';
import { message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

// 数据来源
const dataSource1 = [
  {
    value: 0,
    label: '数据服务',
  },
  {
    value: 1,
    label: '指标管理',
  },
  {
    value: 2,
    label: '决策引擎',
  },
];

// 定义通用表格列
const commonColumns = [
  {
    title: '参数名称',
    dataIndex: 'name',
    width: 200,
    formItemProps: {
      rules: [{ required: true, message: '此项为必填项' }],
    },
  },
  {
    title: '数据类型',
    dataIndex: 'type',
    width: 150,
    valueType: 'select',
    valueEnum: {
      String: 'String',
      Int: 'Int',
      Float: 'Float',
      Object: 'Object',
      Array: 'Array',
    },
    formItemProps: {
      rules: [{ required: true, message: '请选择数据类型' }],
    },
  },
  {
    title: '是否必填',
    dataIndex: 'required',
    width: 120,
    valueType: 'select',
    valueEnum: {
      true: { text: '是', status: 'Success' },
      false: { text: '否', status: 'Error' },
    },
    formItemProps: {
      rules: [{ required: true, message: '请选择是否必填' }],
    },
  },
  {
    title: '参数描述',
    dataIndex: 'description',
    width: 200,
    formItemProps: {
      rules: [{ required: true, message: '请输入参数描述' }],
    },
  },
  {
    title: '操作',
    valueType: 'option',
    width: 250,
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id);
        }}
      >
        编辑
      </a>,
    ],
  },
];

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  treeData: any;
}

const CreateForm: React.FC<PropsWithChildren<CreateFormProps>> = (props) => {
  const { modalVisible, onCancel, treeData } = props;
  const actionRef1 = useRef<ActionType>(null);
  const actionRef2 = useRef<ActionType>(null);
  const actionRef3 = useRef<ActionType>(null);
  const [tableData, setTableData] = useState<any[]>([
    {
      id: Date.now(),
      name: 'id',
      type: 'Float',
      required: true,
      description: '参数描述',
    },
  ]);
  const [requestBodyData, setRequestBodyData] = useState<any[]>([
    {
      id: Date.now(),
      name: 'data1',
      type: 'Object',
      required: true,
      description: '请求Body参数',
      children: [
        {
          id: Date.now() + 1,
          name: 'name',
          type: 'String',
          required: true,
          description: '名称',
        },
        {
          id: Date.now() + 2,
          name: 'sex',
          type: 'Int',
          required: false,
          description: '性别',
        },
      ],
    },
  ]);
  const [responseData, setResponseData] = useState<any[]>([
    {
      id: Date.now(),
      name: 'data1',
      type: 'Object',
      description: '返回参数',
      children: [
        {
          id: Date.now() + 1,
          name: 'name',
          type: 'String',
          description: '名称',
        },
        {
          id: Date.now() + 2,
          name: 'sex',
          type: 'Int',
          description: '性别',
        },
      ],
    },
  ]);

  // 增强型EditableTable组件
  const EnhancedEditableTable = ({
    columns,
    data,
    onDataChange,
    title,
    actionRef,
  }: {
    columns: any[];
    data: any[];
    onDataChange: (data: any[]) => void;
    title?: string;
    actionRef: React.MutableRefObject<ActionType | null>;
  }) => (
    <ProCard
      title={title || '参数配置'}
      bordered
      headerBordered
      extra={
        <Button
          type="primary"
          onClick={() => {
            actionRef.current?.addEditRecord?.({
              id: (Math.random() * 1000000).toFixed(0),
              name: '',
              type: 'String',
              required: false,
              description: '',
            });
          }}
          icon={<PlusOutlined />}
        >
          新增
        </Button>
      }
      style={{ marginBottom: 24 }}
    >
      <EditableProTable
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        value={data}
        onChange={onDataChange}
        bordered
        size="middle"
        recordCreatorProps={false}
        editable={{
          type: 'multiple',
          actionRender: (row, config, defaultDoms) => [defaultDoms.save, defaultDoms.cancel],
        }}
        scroll={{ x: 'max-content' }}
        style={{ overflow: 'visible' }}
      />
    </ProCard>
  );

  return (
    <Modal open={modalVisible} footer={null} onCancel={onCancel} width={1000}>
      <ProCard>
        <StepsForm
          onFinish={async () => {
            // await waitTime(1000);
            message.success('提交成功');
          }}
          formProps={{
            layout: 'horizontal',
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
            validateMessages: {
              required: '此项为必填项',
            },
          }}
        >
          <StepsForm.StepForm
            name="base"
            title="基本信息"
            onFinish={async () => {
              // await waitTime(2000);
              return true;
            }}
          >
            <br />
            <strong>基本信息</strong>
            <br />
            <ProFormSelect
              label="接口分类"
              name="type"
              width="md"
              placeholder="请选择接口分类"
              options={[
                {
                  value: 0,
                  label: '分类1',
                },
                {
                  value: 1,
                  label: '分类2',
                },
              ]}
              rules={[{ required: true }]}
            />

            <ProFormText
              name="name"
              label="接口名称"
              width="md"
              tooltip="最长为 24 位，用于标定的唯一 id"
              placeholder="请输入名称"
              rules={[{ required: true }]}
            />

            <ProFormSelect
              label="接口来源"
              name="source"
              width="md"
              placeholder="请选择接口来源"
              rules={[{ required: true }]}
              options={dataSource1}
            />

            <ProFormTextArea
              label="接口描述"
              name="desc"
              width="md"
              placeholder="请输入备注"
            />
            <br />
            <strong>API参数</strong>
            <br />
            <ProFormSelect
              label="协议"
              name="agreement"
              width="md"
              placeholder="请选择协议"
              rules={[{ required: true }]}
              options={[
                {
                  value: 0,
                  label: 'HTTP',
                },
                {
                  value: 1,
                  label: 'HTTPS',
                },
              ]}
            />
            <ProFormText
              label="IP端口"
              name="ipport"
              width="md"
              placeholder="请输入IP端口"
              rules={[{ required: true }]}
            />
            <ProFormText
              label="Path"
              name="path"
              width="md"
              placeholder="请输入Path"
              rules={[{ required: true }]}
            />
            <ProFormSelect
              label="请求方式"
              name="method"
              width="md"
              placeholder="请选择请求方式"
              rules={[{ required: true }]}
              options={[
                {
                  value: 0,
                  label: 'GET',
                },
                {
                  value: 1,
                  label: 'POST',
                },
              ]}
            />
            <ProFormText
              label="超时时间"
              name="timeout"
              width="md"
              placeholder="请输入超时时间"
              rules={[{ required: true }]}
            />
          </StepsForm.StepForm>

          <StepsForm.StepForm title="参数配置" name="params">
            <EnhancedEditableTable
              columns={commonColumns}
              data={tableData}
              onDataChange={setTableData}
              title="输入参数配置"
              actionRef={actionRef1}
            />

            <EnhancedEditableTable
              columns={commonColumns}
              data={requestBodyData}
              onDataChange={setRequestBodyData}
              title="请求Body配置"
              actionRef={actionRef2}
            />

            <EnhancedEditableTable
              columns={commonColumns.filter((c) => c.dataIndex !== 'required')}
              data={responseData}
              onDataChange={setResponseData}
              title="返回参数配置"
              actionRef={actionRef3}
            />
          </StepsForm.StepForm>
        </StepsForm>
      </ProCard>
    </Modal>
  );
};

export default CreateForm;