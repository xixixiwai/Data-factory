import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Button, message,Switch } from 'antd';
import services from '@/services/Catalog';
const {updateDataStandardUsingPut, addDataStandardUsingPost} = services.shujubiaozhunguanli;
interface FormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  record?: any; // 用于编辑时传递记录
  isEdit: boolean; // 是否是编辑模式
  agencyOptions: Record<string, string>; // 来源机构选项
  enumRange: Record<string, string>; // 枚举范围选项
}

const { TextArea } = Input;
const { Option } = Select;

const CataForm: React.FC<FormProps> = (props) => {
  const { modalVisible, onCancel, onSuccess, record, isEdit, agencyOptions,enumRange } = props;
  const [form] = Form.useForm();
  const [dataType, setDataType] = useState<string>('String'); // 默认数据类型
  // 校验标准合法性
  const validateStandard = (values: any) => {
    // 1. 中文名称、英文名称、来源机构、数据类型不能为空
    if (!values.chName?.trim()) {
      message.error('中文名称不能为空');
      return false;
    }
    if (!values.enName?.trim()) {
      message.error('英文名称不能为空');
      return false;
    }
    if (!values.agency?.trim()) {
      message.error('来源机构不能为空');
      return false;
    }
    if (!values.type?.trim()) {
      message.error('数据类型不能为空');
      return false;
    }

    // 2. 中文名称只支持中文及英文大小写
    const chineseNameRegex = /^[\u4e00-\u9fa5A-Za-z]+$/;
    if (!chineseNameRegex.test(values.chName)) {
      message.error('中文名称只支持中文及英文大小写');
      return false;
    }

    // 3. 英文名称只支持英文大小写、数字及下划线且只能英文开头
    const englishNameRegex = /^[A-Za-z][A-Za-z0-9_]*$/;
    if (!englishNameRegex.test(values.enName)) {
      message.error('英文名称只支持英文大小写、数字及下划线且只能英文开头');
      return false;
    }

    // 4. 数据类型只支持 String、Int、Float、Enum
    const validTypes = ['String', 'Int', 'Float', 'Enum'];
    if (!validTypes.includes(values.type)) {
      message.error('数据类型只支持 String、Int、Float、Enum');
      return false;
    }

    // 5. 根据数据类型校验其他字段
    // if (values.type === 'String') {
    //   if (!values.length || !/^\d+$/.test(values.length)) {
    //     message.error('数据长度必须为正整数');
    //     return false;
    //   }
    //   if (values.precision || values.minVal || values.maxVal || values.codeNum) {
    //     message.error('数据类型为 String 时，数据精度、取值范围最小值、取值范围最大值、枚举范围必须为空');
    //     return false;
    //   }
    // } else if (values.type === 'Int') {
    //   if (!values.minVal || !values.maxVal || !/^-?\d+$/.test(values.minVal) || !/^-?\d+$/.test(values.maxVal)) {
    //     message.error('取值范围最小值和最大值必须为整数');
    //     return false;
    //   }
    //   if (values.length || values.precision || values.codeNum) {
    //     message.error('数据类型为 Int 时，数据长度、数据精度、枚举范围必须为空');
    //     return false;
    //   }
    // } else if (values.type === 'Float') {
    //   if (!values.precision || !/^\d+$/.test(values.precision)) {
    //     message.error('数据精度必须为非负整数');
    //     return false;
    //   }
    //   if (!values.minVal || !values.maxVal || !/^-?\d+(\.\d+)?$/.test(values.minVal) || !/^-?\d+(\.\d+)?$/.test(values.maxVal)) {
    //     message.error('取值范围最小值和最大值必须为整数或实数');
    //     return false;
    //   }
    //   if (values.length || values.codeNum) {
    //     message.error('数据类型为 Float 时，数据长度、枚举范围必须为空');
    //     return false;
    //   }
    // } else if (values.type === 'Enum') {
    //   if (!values.codeNum?.trim()) {
    //     message.error('枚举范围不能为空');
    //     return false;
    //   }
    //   if (values.length || values.precision || values.minVal || values.maxVal) {
    //     message.error('数据类型为 Enum 时，数据长度、数据精度、取值范围最小值、取值范围最大值必须为空');
    //     return false;
    //   }
    // }

    return true;
  };

  const handleFinish = async (values: any) => {
  try {
    // 将 isEmpty 转换为数字类型
    values.isEmpty = values.isEmpty ? 1 : 0;

    // 根据数据类型清理字段值
    let payload: any = {
      chName: values.chName,
      enName: values.enName,
      description: values.description || '',
      agency: values.agency,
      type: values.type,
      isEmpty: values.isEmpty,
      status: values.status || 0,
      dftValue: values.dftValue || '',
      valueRange: values.valueRange || '',
    };

    // 定义每种数据类型允许的字段
    const typeConfig = {
      String: ['length'],
      Int: ['minVal', 'maxVal'],
      Float: ['precision', 'minVal', 'maxVal','accuracy'],
      Enum: ['codeNum'],
    };

    // 根据数据类型保留允许的字段
    const allowedFields = typeConfig[values.type] || [];
    allowedFields.forEach(field => {
      if (values[field] !== undefined) {
        payload[field] = values[field];
      }
    });

    // 移除空值字段
    const cleanedPayload = Object.fromEntries(
      Object.entries(payload).filter(([_, value]) => value !== undefined)
    );

    let response;
    if (isEdit) {
      // 编辑模式
      response = await updateDataStandardUsingPut({
        ...cleanedPayload,
        id: record?.id,
      });
      console.log('response编辑', response);
      console.log('record',cleanedPayload);
      
    } else {
      // 新增模式
      response = await addDataStandardUsingPost(cleanedPayload);
      console.log('response新增', response);
      
      
    }

    if (response.code === 100200) {
      message.success(isEdit ? '编辑成功' : '新增成功');
      onCancel();
      onSuccess();
    } else {
      message.error(response.msg || '操作失败');
    }
  } catch (error) {
    console.log('error', error);
    message.error('提交失败，请重试');
  }
};

  // 使用 useEffect 监听 record 和 isEdit 的变化，设置初始值
  useEffect(() => {
    if (isEdit && record) {
      form.setFieldsValue(record);
      setDataType(record.type || 'String');
    } else {
      form.resetFields();
      form.setFieldsValue({
        status: 0, // 设置默认值
        type: 'String', // 设置默认数据类型
      });
      setDataType('String');
    }
  }, [isEdit, record]);

  // 动态显示/隐藏字段
  const renderDynamicFields = () => {
    switch (dataType) {
      case 'String':
        return (
          <>
            <Form.Item
              name="length"
              label="数据长度"
              rules={[{ required: true, message: '请输入数据长度' }, { pattern: /^\d+$/, message: '数据长度必须为正整数' }]}
            >
              <Input placeholder="请输入数据长度" />
            </Form.Item>
          </>
        );
      case 'Int':
        return (
          <>
            <Form.Item
              name="minVal"
              label="取值范围最小值"
              rules={[{ required: true, message: '请输入取值范围最小值' }, { pattern: /^-?\d+$/, message: '取值范围最小值必须为整数' }]}
            >
              <Input placeholder="请输入取值范围最小值" />
            </Form.Item>
            <Form.Item
              name="maxVal"
              label="取值范围最大值"
              rules={[{ required: true, message: '请输入取值范围最大值' }, { pattern: /^-?\d+$/, message: '取值范围最大值必须为整数' }]}
            >
              <Input placeholder="请输入取值范围最大值" />
            </Form.Item>
          </>
        );
      case 'Float':
        return (
          <>
            <Form.Item
              name="precision"
              label="数据精度"
              rules={[{ required: true, message: '请输入数据精度' }, { pattern: /^\d+$/, message: '数据精度必须为非负整数' }]}
            >
              <Input placeholder="请输入数据精度" />
            </Form.Item>
            <Form.Item
              name="minVal"
              label="取值范围最小值"
              rules={[{ required: true, message: '请输入取值范围最小值' }, { pattern: /^-?\d+(\.\d+)?$/, message: '取值范围最小值必须为整数或实数' }]}
            >
              <Input placeholder="请输入取值范围最小值" />
            </Form.Item>
            <Form.Item
              name="maxVal"
              label="取值范围最大值"
              rules={[{ required: true, message: '请输入取值范围最大值' }, { pattern: /^-?\d+(\.\d+)?$/, message: '取值范围最大值必须为整数或实数' }]}
            >
              <Input placeholder="请输入取值范围最大值" />
            </Form.Item>
          </>
        );
      case 'Enum':
        return (
          <Form.Item
            name="codeNum"
            label="枚举范围"
            rules={[{ required: true, message: '请选择枚举范围' }]}
          >
            <Select placeholder="请选择枚举范围">
              {Object.entries(enumRange).map(([value, label]) =>(
                <Option key={value} value={value}>{label}</Option>
              ))}
            </Select>
          </Form.Item>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      title={isEdit ? "编辑码表" : "新增码表"}
      open={modalVisible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Form.Item
          name="chName"
          label="中文名称"
          rules={[{ required: true, message: '请输入中文名称' }, { pattern: /^[\u4e00-\u9fa5A-Za-z]+$/, message: '中文名称只支持中文及英文大小写' }]}
        >
          <Input placeholder="请输入中文名称" />
        </Form.Item>

        <Form.Item
          name="enName"
          label="英文名称"
          rules={[{ required: true, message: '请输入英文名称' }, { pattern: /^[A-Za-z][A-Za-z0-9_]*$/, message: '英文名称只支持英文大小写、数字及下划线且只能英文开头' }]}
        >
          <Input placeholder="请输入英文名称" />
        </Form.Item>

        <Form.Item
          name="description"
          label="标准说明"
        >
          <TextArea placeholder="请输入标准说明" rows={4} />
        </Form.Item>
        <Form.Item
          name="isEmpty"
          label="是否允许为空"
        >
          <Switch/>
        </Form.Item>
        <Form.Item
          name="agency"
          label="来源机构"
          rules={[{ required: true, message: '请选择来源机构' }]}
        >
          <Select placeholder="请选择来源机构">
            {Object.entries(agencyOptions).map(([value, label]) => (
              <Option key={value} value={value}>{label}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="type"
          label="数据类型"
          rules={[{ required: true, message: '请选择数据类型' }]}
        >
          <Select
            placeholder="请选择数据类型"
            onChange={(value) => {
              setDataType(value);
              // 重置无关字段
              form.resetFields(['length', 'precision', 'minVal', 'maxVal', 'codeNum']);
            }}
          >
            <Option value="String">String</Option>
            <Option value="Int">Int</Option>
            <Option value="Float">Float</Option>
            <Option value="Enum">Enum</Option>
          </Select>
        </Form.Item>

        {renderDynamicFields()}

        <Form.Item
          name="dftValue"
          label="默认值"
        >
          <Input placeholder="请输入默认值" />
        </Form.Item>

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

export default CataForm;