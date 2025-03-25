import React, { PropsWithChildren } from 'react';
import services from '@/services/CodeTable';
import { Modal, Form, Input, Select, message, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { updateCodeTableUsingPut } = services.mabiaoguanli;

interface CodeTable {
  id: string;
  name: string;
  description: string;
  status: number;
  updateTime: string;
  codeMsgPList: Array<{
    id: number;
    codeTbId: string;
    name: string;
    value: string;
    mean: string;
  }>;
}

interface EditFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  record: CodeTable;
  onSuccess: () => void;
}

const EditForm: React.FC<PropsWithChildren<EditFormProps>> = (props) => {
  const { modalVisible, onCancel, record, onSuccess } = props;
  const [form] = Form.useForm();

  const handleEdit = async () => {
    try {
      const values = await form.validateFields();

      // 构造请求体
      const payload = {
        codeMsgPList: values.codeMsgPList.map((item: { id: number; codeTbId: string; name: string; value: string; mean: string; }) => ({
          id: item.id,
          codeTbId: item.codeTbId,
          name: item.name,
          value: item.value,
          mean: item.mean,
        })),
        codeTb: {
          id: values.codeTb.id,
          name: values.codeTb.name,
          description: values.codeTb.description,
          status: values.codeTb.status,
        },
      };

      // 调用编辑接口
      const res = await updateCodeTableUsingPut(payload);
      console.log('编辑成功', res);

      message.success('编辑成功');
      onCancel();
      onSuccess();
    } catch (error) {
      console.log('Validate Failed:', error);
      message.error('编辑失败，请检查输入');
    }
  };

  return (
    <Modal
      title="编辑码表"
      open={modalVisible}
      onOk={handleEdit}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={handleEdit}>
          提交
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          codeTb: {
            id: record.id,
            name: record.name,
            description: record.description,
            status: record.status,
          },
          codeMsgPList: record.codeMsgPList,
        }}
      >
        <Form.Item
          name={['codeTb', 'id']}
          label="码表编号"
          rules={[{ required: true, message: '请输入码表编号!' }]}
        >
          <Input disabled />
        </Form.Item>

        <Form.Item
          name={['codeTb', 'name']}
          label="码表名称"
          rules={[{ required: true, message: '请输入码表名称!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name={['codeTb', 'description']}
          label="码表说明"
          rules={[{ required: true, message: '请输入码表说明!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name={['codeTb', 'status']}
          label="码表状态"
          rules={[{ required: true, message: '请选择码表状态!' }]}
        >
          <Select>
            <Select.Option value={0}>待发布</Select.Option>
            <Select.Option value={1}>已发布</Select.Option>
            <Select.Option value={2}>已停用</Select.Option>
          </Select>
        </Form.Item>

        <Form.List name="codeMsgPList">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field) => (
                <div key={field.key} style={{ marginBottom: 8 }}>
                  <Form.Item
                    {...field}
                    name={[field.name, 'value']}
                    label="码值取值"
                    rules={[{ required: true, message: '请输入码值取值!' }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    {...field}
                    name={[field.name, 'name']}
                    label="码值名称"
                    rules={[{ required: true, message: '请输入码值名称!' }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    {...field}
                    name={[field.name, 'mean']}
                    label="码值含义"
                  >
                    <Input />
                  </Form.Item>

                  <Button type="link" onClick={() => remove(field.name)}>
                    删除
                  </Button>
                </div>
              ))}

              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                添加码值
              </Button>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default EditForm;