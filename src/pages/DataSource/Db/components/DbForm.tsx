import React, { useState, useEffect } from 'react';
import { ProForm, ProFormText, ProFormSelect } from '@ant-design/pro-components';
import { message, Modal, Button } from 'antd';
import service from '@/services/Db';
const {addDataBaseUsingPost,updateDataBaseUsingPut,testConnectionUsingPost}=service.shujukubiaoguanli
interface DbFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onCreate: (values: any) => void;
  onSuccess: () => void;
  record?: any; // 用于编辑时传递记录
  isEdit: boolean; // 是否是编辑模式
  selectedDbType: string;// 新增属性，用于传递选中的数据库类型
}


const DbForm: React.FC<DbFormProps> = ({ record,isEdit,modalVisible, onCancel, onCreate,onSuccess, selectedDbType }) => {
  const [form] = ProForm.useForm();
  useEffect(() => {
    // 当 selectedDbType 发生变化时，更新表单的值
    form.setFieldsValue({ type: selectedDbType });
  }, [selectedDbType, form]);
  useEffect(()=>{
    if(isEdit&&record){
      form.setFieldsValue(record);
    }else{
      form.resetFields();
      
    }
  },[isEdit,record])
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();// 获取表单数据
      console.log('values', values)
      onCreate(values);// 调用父组件的onCreate方法
      form.resetFields();// 重置表单
      onCancel();// 关闭模态框
      let response;
      if(isEdit){
        //编辑
        console.log('编辑',record);
        
        response=await updateDataBaseUsingPut({
          status: values.status === '待发布' ? 0 : values.status === '已发布' ? 1 : values.status === '已停用' ? 2 : null,
          ...values,
          id:record.id,

        })
        console.log('res',response)
        
      }else{
        //新增
        response=await addDataBaseUsingPost(values)
        console.log('res',response)
        
      }
      if (response.code === 100200) {
            message.success(isEdit ? '编辑成功' : '新增成功');
            onCancel();
            onSuccess();
          } else {
            message.error(response.msg || '操作失败');
          }
    } catch (error) {
      console.log('验证失败', error);
      message.error('表单验证失败，请检查输入');
    }
  };

  const handleTestConnection = async () => {// 测试连接
    const values = await form.validateFields();
    console.log('values', values);
    
    try {
      const res=await testConnectionUsingPost({
        id:values.id,
        password:values.password,
        url:values.url,
        username:values.username,
      })
      if (res.code === 100200) {
        message.success('连通测试成功');
      }else{
        message.error('连通测试失败');
      }
    } catch (error) {
      console.log('验证失败', error);
      message.error('表单验证失败，请检查输入');
    }
  };

  return (
    <Modal
      open={modalVisible}
      title="新增数据源"
      onCancel={onCancel}
      footer={null} // 去掉模态框自带的按钮
      width={700}
    >
      <ProForm
        submitter={false}
        form={form}
        layout="vertical"
        initialValues={{ type: selectedDbType }} // 初始化表单数据
      >
        <ProFormText
          name="type"
          label="数据库类型"
          initialValue={selectedDbType}
          required
          disabled
        />
        <ProFormText
          name="name"
          label="数据源名称"
          rules={[{ required: true, message: '请输入数据源名称' }]}
        />
        <ProFormText
          name="description"
          label="数据源描述"
        />
        <ProFormText
          name="url"
          label="url"
          rules={[{ required: true, message: '请输入url' }]}
        />
        <ProFormText
          name="username"
          label="用户名"
        />
        <ProFormText.Password
          name="password"
          label="密码"
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <Button type="primary" onClick={handleTestConnection} style={{ marginLeft: '10px' }}>
            连通测试
          </Button>
          
          <Button type="primary" onClick={handleSubmit}>
            确定
          </Button>
          <Button onClick={onCancel}>
            取消
          </Button>     
        </div>
      </ProForm>
    </Modal>
  );
};

export default DbForm;