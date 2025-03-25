import { Modal, Form, Input, Button, message,Space,Select } from 'antd';
import React, { useState } from 'react';

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel } = props;
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(1); // 当前步骤

  // 表单提交
  const handleFinish = (values) => {
    // 这里可以添加保存逻辑，比如调用API
    console.log('Task Data:', values);
    message.success('保存成功');
    onCancel();
  };

  // 校验任务名称是否重复
  const validateTaskName = async (_, value) => {
    if (!value) {
      return Promise.reject('请输入任务名称');
    }
    // 模拟检查任务名称是否重复
    const isDuplicate = value === 'existing_task_name';
    if (isDuplicate) {
      return Promise.reject('任务名称已存在');
    }
    return Promise.resolve();
  };

  return (
    <Modal
      title="创建任务"
      visible={modalVisible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >
        {/* 基本信息 */}
        {currentStep === 1 && (
          <>
            <Form.Item
              label="任务名称"
              name="taskName"
              rules={[
                { required: true, message: '请输入任务名称' },
                { validator: validateTaskName },
              ]}
            >
              <Input placeholder="请输入任务名称" />
            </Form.Item>

            <Form.Item
              label="任务描述"
              name="taskDescription"
            >
              <Input.TextArea placeholder="请输入任务描述" />
            </Form.Item>

            <Form.Item
              label="任务分类"
              name="taskCategory"
              rules={[{ required: true, message: '请选择任务分类' }]}
            >
              <Select placeholder="请选择任务分类">
                <Select.Option value="category1">分类1</Select.Option>
                <Select.Option value="category2">分类2</Select.Option>
                <Select.Option value="category3">分类3</Select.Option>
              </Select>
            </Form.Item>
          </>
        )}

        {/* 任务配置 */}
        {currentStep === 2 && (
          <>
            <Form.Item
              label="配置项1"
              name="config1"
              rules={[{ required: true, message: '请输入配置项1' }]}
            >
              <Input placeholder="请输入配置项1" />
            </Form.Item>

            <Form.Item
              label="配置项2"
              name="config2"
            >
              <Input placeholder="请输入配置项2" />
            </Form.Item>
          </>
        )}

        {/* 任务触发设置 */}
        {currentStep === 3 && (
          <>
            <Form.Item
              label="触发方式"
              name="triggerType"
              rules={[{ required: true, message: '请选择触发方式' }]}
            >
              <Select placeholder="请选择触发方式">
                <Select.Option value="manual">手动触发</Select.Option>
                <Select.Option value="schedule">定时触发</Select.Option>
              </Select>
            </Form.Item>

            {form.getFieldValue('triggerType') === 'schedule' && (
              <Form.Item
                label="定时设置"
                name="scheduleSettings"
              >
                <Input placeholder="请输入定时设置" />
              </Form.Item>
            )}
          </>
        )}

        {/* 操作按钮 */}
        <Form.Item>
          <Space>
            {currentStep > 1 && (
              <Button onClick={() => setCurrentStep(prev => prev - 1)}>
                上一步
              </Button>
            )}
            {currentStep < 3 ? (
              <Button type="primary" onClick={() => setCurrentStep(prev => prev + 1)}>
                下一步
              </Button>
            ) : (
              <Button type="primary" htmlType="submit">
                完成
              </Button>
            )}
            <Button onClick={onCancel}>取消</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateForm;