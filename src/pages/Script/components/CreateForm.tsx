import { Modal, Form, Input, Button, Upload, message, Select, Checkbox } from 'antd';
import React, { useState } from 'react';
import { PlusCircleOutlined, UploadOutlined } from '@ant-design/icons';

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel } = props;
  const [form] = Form.useForm();
  const [inputParams, setInputParams] = useState<{ id: number; name: string; type: string; required: boolean }[]>([
    { id: Date.now(), name: '', type: 'String', required: false },
  ]);
  const [outputParams, setOutputParams] = useState<{ id: number; name: string; type: string }[]>([
    { id: Date.now(), name: '', type: 'String' },
  ]);
  const [fileList, setFileList] = useState<{ uid: string; name: string; status: string; url: string }[]>([]);

  // 校验函数
  const validateScriptName = (_, value) => {
    const regex = /^[a-zA-Z][a-zA-Z0-9_]*$/;
    if (!regex.test(value)) {
      return Promise.reject('脚本名称只支持英文大小写、数字及下划线且只能英文开头');
    }
    return Promise.resolve();
  };

  const validateClassName = (_, value) => {
    const regex = /^[a-zA-Z][a-zA-Z0-9_]*$/;
    if (!regex.test(value)) {
      return Promise.reject('类名只支持英文大小写、数字及下划线且只能英文开头');
    }
    return Promise.resolve();
  };

  const validateFunctionName = (_, value) => {
    const regex = /^[a-zA-Z][a-zA-Z0-9_]*$/;
    if (!regex.test(value)) {
      return Promise.reject('函数名只支持英文大小写、数字及下划线且只能英文开头');
    }
    return Promise.resolve();
  };

  const validateInputParamName = (_, value) => {
    const regex = /^[a-zA-Z][a-zA-Z0-9_]*$/;
    if (!regex.test(value)) {
      return Promise.reject('参数名称只支持英文大小写、数字及下划线且只能英文开头');
    }
    return Promise.resolve();
  };

  const validateOutputParamName = (_, value) => {
    const regex = /^[a-zA-Z][a-zA-Z0-9_]*$/;
    if (!regex.test(value)) {
      return Promise.reject('参数名称只支持英文大小写、数字及下划线且只能英文开头');
    }
    return Promise.resolve();
  };



  // 保存文件列表
  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  // 添加输入参数
  const addInputParam = () => {
    setInputParams([...inputParams, { id: Date.now(), name: '', type: 'String', required: false }]);
  };

  // 删除输入参数
  const deleteInputParam = (id: number) => {
    setInputParams(inputParams.filter(param => param.id !== id));
  };

  // 添加输出参数
  const addOutputParam = () => {
    setOutputParams([...outputParams, { id: Date.now(), name: '', type: 'String' }]);
  };

  // 删除输出参数
  const deleteOutputParam = (id: number) => {
    setOutputParams(outputParams.filter(param => param.id !== id));
  };

  // 表单提交
  const handleFinish = (values) => {
    // 校验必填项
    if (!values.scriptName || !values.className || !values.functionName || fileList.length === 0) {
      message.error('信息填写不完整，无法保存');
      return;
    }

    // 校验文件类型
    if (fileList[0].type !== 'text/python') {
      message.error('文件类型错误，无法保存');
      return;
    }

    // 组装参数
    const scriptData = {
      ...values,
      inputParams: inputParams.filter(param => param.name).map(p => ({
        name: p.name,
        type: p.type,
        required: p.required,
      })),
      outputParams: outputParams.filter(param => param.name).map(p => ({
        name: p.name,
        type: p.type,
      })),
      file: fileList[0],
    };

    // 这里可以添加保存逻辑，比如调用API
    console.log('Script Data:', scriptData);
    message.success('保存成功');
    onCancel();
  };

  return (
    <Modal
      title="创建脚本"
      visible={modalVisible}
      onCancel={onCancel}
      footer={null}
      width={800}
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
            // beforeUpload={beforeUpload}//
            onChange={handleChange}
            fileList={fileList}// 保存文件列表
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
            { validator: validateScriptName },
          ]}
        >
          <Input placeholder="请输入脚本名称" />
        </Form.Item>

        <Form.Item
          label="脚本分类"
          name="scriptCategory"
        >
          <Input placeholder="请输入脚本分类" />
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
            { validator: validateClassName },
          ]}
        >
          <Input placeholder="请输入类名" />
        </Form.Item>

        <Form.Item
          label="函数名"
          name="functionName"
          rules={[
            { required: true, message: '请输入函数名' },
            { validator: validateFunctionName },
          ]}
        >
          <Input placeholder="请输入函数名" />
        </Form.Item>


        <div style={{ margin: '16px 0' }}>
          <h3>输入参数</h3>
          {inputParams.map((param, index) => (
            <div key={param.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <Form.Item
                name={`inputParamName${index}`}
                rules={[
                  { validator: validateInputParamName },
                ]}
                style={{ flex: 1, marginRight: 8 }}
              >
                <Input
                  placeholder="参数名称"
                  value={param.name}
                  onChange={(e) => {
                    const newParams = [...inputParams];
                    newParams[index].name = e.target.value;
                    setInputParams(newParams);
                  }}
                />
              </Form.Item>

              <Form.Item
                name={`inputParamType${index}`}
                initialValue="String"
                style={{ flex: 1, marginRight: 8 }}
              >
                <Select
                  onChange={(value) => {
                    const newParams = [...inputParams];
                    newParams[index].type = value;
                    setInputParams(newParams);
                  }}
                >
                  <Select.Option value="String">String</Select.Option>
                  <Select.Option value="Int">Int</Select.Option>
                  <Select.Option value="Float">Float</Select.Option>
                  <Select.Option value="Bool">Bool</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name={`inputParamRequired${index}`}
                valuePropName="checked"
                initialValue={param.required}
                style={{ marginRight: 8 }}
              >
                <Checkbox
                  onChange={(e) => {
                    const newParams = [...inputParams];
                    newParams[index].required = e.target.checked;
                    setInputParams(newParams);
                  }}
                >
                  必填
                </Checkbox>
              </Form.Item>

              <Button
                type="text"
                danger
                onClick={() => deleteInputParam(param.id)}
                disabled={inputParams.length === 1}
              >
                删除
              </Button>
            </div>
          ))}
          <Button type="dashed" onClick={addInputParam} style={{ width: '100%' }}>
            添加输入参数
          </Button>
        </div>

        <div style={{ margin: '16px 0' }}>
          <h3>输出参数</h3>
          {outputParams.map((param, index) => (
            <div key={param.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <Form.Item
                name={`outputParamName${index}`}
                rules={[
                  { validator: validateOutputParamName },
                ]}
                style={{ flex: 1, marginRight: 8 }}
              >
                <Input
                  placeholder="参数名称"
                  value={param.name}
                  onChange={(e) => {
                    const newParams = [...outputParams];
                    newParams[index].name = e.target.value;
                    setOutputParams(newParams);
                  }}
                />
              </Form.Item>

              <Form.Item
                name={`outputParamType${index}`}
                initialValue="String"
                style={{ flex: 1, marginRight: 8 }}
              >
                <Select
                  onChange={(value) => {
                    const newParams = [...outputParams];
                    newParams[index].type = value;
                    setOutputParams(newParams);
                  }}
                >
                  <Select.Option value="String">String</Select.Option>
                  <Select.Option value="Int">Int</Select.Option>
                  <Select.Option value="Float">Float</Select.Option>
                  <Select.Option value="Bool">Bool</Select.Option>
                </Select>
              </Form.Item>

              <Button
                type="text"
                danger
                onClick={() => deleteOutputParam(param.id)}
                disabled={outputParams.length === 1}
              >
                删除
              </Button>
            </div>
          ))}
          <Button type="dashed" onClick={addOutputParam} style={{ width: '100%' }}>
            添加输出参数
          </Button>
        </div>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            确定
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={onCancel}>
            取消
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateForm;