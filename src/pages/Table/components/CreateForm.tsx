import { Modal } from 'antd';
import React, { PropsWithChildren } from 'react';

import type { ProFormInstance } from '@ant-design/pro-components';
import {
  ProCard,
  ProForm,
  ProFormCheckbox,
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm,
} from '@ant-design/pro-components';
import { message } from 'antd';
import { useRef } from 'react';
interface CreateFormProps {// 新建表单的props
  modalVisible: boolean;// 新建表单是否可见
  onCancel: () => void;// 取消新建表单
}
const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const types = [
  {
    label: '接口分类1',
    value: '1'
  },
  {
    label: '接口分类2',
    value: '2'
  }
]

const sources = [
  {
    label: '接口来源1',
    value: '1'
  },
  {
    label: '接口来源2',
    value: '2'
  }
]

const CreateForm: React.FC<PropsWithChildren<CreateFormProps>> = (props) => {// 新建表单
  const { modalVisible, onCancel } = props;
  const formRef = useRef<ProFormInstance>();// 新建表单的ref
  return (
    <Modal
      open={modalVisible}
      footer={null}
      onCancel={onCancel}
      width={700}

    >
      <ProCard >
        <StepsForm<{
          name: string;
        }>
          formRef={formRef}
          onFinish={async () => {
            await waitTime(1000);
            message.success('提交成功');
          }}
          formProps={{
            layout: 'horizontal',// 设置表单布局为水平布局
            labelCol: { span: 6 }, // 设置 label 的宽度
            wrapperCol: { span: 18 }, // 设置输入框的宽度
            validateMessages: {
              required: '此项为必填项',
            },
          }}
        >
          <StepsForm.StepForm<{
            name: string;
          }>
            name="base"
            title="基本信息"
            stepProps={{
            }}
            onFinish={async () => {
              console.log(formRef.current?.getFieldsValue());// 获取表单的值
              await waitTime(2000);
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
              options={types}
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
              options={sources}
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
              name="protocol"
              width="md"
              placeholder="请选择协议"
              rules={[{ required: true }]}
              options={['http', 'https', 'ftp', 'sftp', 'ssh', 'telnet']}
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
              options={['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS']}
            />
            <ProFormText
              label="超时时间"
              name="timeout"
              width="md"

              placeholder="请输入超时时间"
              rules={[{ required: true }]}

            />
          </StepsForm.StepForm>

          <StepsForm.StepForm
            title="参数配置"
            name='params'
            stepProps={{
            }}
          >
            <ProFormCheckbox.Group
              name="checkbox"
              label="部署单元"
              rules={[
                {
                  required: true,
                },
              ]}
              options={['部署单元1', '部署单元2', '部署单元3']}
            />
            <ProFormSelect
              label="部署分组策略"
              name="remark"
              rules={[
                {
                  required: true,
                },
              ]}
              initialValue="1"
              options={[
                {
                  value: '1',
                  label: '策略一',
                },
                { value: '2', label: '策略二' },
              ]}
            />
            <ProFormSelect
              label="Pod 调度策略"
              name="remark2"
              initialValue="2"
              options={[
                {
                  value: '1',
                  label: '策略一',
                },
                { value: '2', label: '策略二' },
              ]}
            />
          </StepsForm.StepForm>
        </StepsForm>
      </ProCard>
    </Modal>
  );
};

export default CreateForm;
