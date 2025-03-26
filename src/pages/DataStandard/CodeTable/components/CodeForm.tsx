import React, { PropsWithChildren, useState, useEffect } from 'react';
import { message, Modal } from 'antd';
import { Divider } from 'antd';
import type { ProColumns } from '@ant-design/pro-components';
import { ProForm, ProFormText, ProFormTextArea, EditableProTable, ProFormSelect } from '@ant-design/pro-components';
import services from '@/services/CodeTable';
const { addCodeTableUsingPost, updateCodeTableUsingPut, deleteCodeMsgUsingDelete } = services.mabiaoguanli;

interface CodeTable {
  id?: string;
  name: string;
  description: string;
  status?: number;
  updateTime?: string;
  codeMsgPList?: Array<{
    id?: number;
    codeTbId?: string;
    name: string;
    value: string;
    mean: string;
  }>;
}

interface FormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  record?: CodeTable; // 用于编辑时传递记录
  isEdit: boolean; // 是否是编辑模式
}

const CodeForm: React.FC<PropsWithChildren<FormProps>> = (props) => {
  const { modalVisible, onCancel, onSuccess, record, isEdit } = props;
  const [dataSource, setDataSource] = useState<Record<string, any>[]>([]);// 用于存储码值列表
  const [form] = ProForm.useForm(); // 使用 ProForm 的 useForm 方法
  const [formKey, setFormKey] = useState(0); // 用于强制重新渲染表单

  // 验证表格数据
  const validateTableData = (dataSource: Record<string, any>[]) => {
    for (const record of dataSource) {
      if (!record.value) {
        message.error('码值取值不能为空');
        return false;
      }
      if (!record.name) {
        message.error('码值名称不能为空');
        return false;
      }
    }
    return true;
  };

  const columns = [
    {
      title: '码值取值',
      dataIndex: 'value',
      rules: [{ required: true, message: '请输入码值取值' }],
      editable: true,
    },
    {
      title: '码值名称',
      dataIndex: 'name',
      rules: [{ required: true, message: '请输入名称' }],
      editable: true,
    },
    {
      title: '码值含义',
      dataIndex: 'mean',
      editable: true,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);//编辑行
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => {
            console.log('record.id', record.id);
            console.log('dataSource', dataSource);                        
            setDataSource(dataSource.filter((item) => item.id !== record.id));//删除行
            message.info('删除成功');
            
          }}
        >
          删除
        </a>,
      ],
    },
  ] as ProColumns<Record<string, any>, "text">[];

  const handleFormFinish = async (values: any) => {
    console.log('DataSource:', dataSource); // 调试：检查 dataSource 是否正确
    //手动触发表单验证
    try{
      await form.validateFields();
    }catch (error) {
      message.error('请填写必填项');
      return;
    }
    const isValid = validateTableData(dataSource);
    if (!isValid) return false;
    //类型检查
    if(typeof values.status !== 'number') {
      message.error('状态必须为数字');
      return false;
    }
    try {
      let res;
      let payload;
      if (isEdit) {
        // 编辑模式
        payload = {
          codeMsgPList: dataSource.map(item => ({
            id: item.id,
            codeTbId: record?.id,
            name: item.name,
            value: item.value,
            mean: item.mean,
          })),
          codeTb: {
            id: record?.id,
            name: values.name,
            description: values.description,
            status: values.status,
          },
        };
        console.log('payload', payload);
        
        res=await updateCodeTableUsingPut(payload);
      } else {
        // 新增模式
        payload = {
          codeMsgList: dataSource.map(item => ({
            mean: item.mean || '',
            name: item.name,
            value: item.value,
          })),
          addCodeTBDTO: {
            description: values.description,
            name: values.name,
          },
        };
        res=await addCodeTableUsingPost(payload);
      }
      if(res.code===200){
        message.success(isEdit ? '编辑成功' : '新增成功');
      }else{
        message.error(res.msg);
      }

      // 清空数据
      setDataSource([]);
      setFormKey(formKey + 1); // 强制重新渲染表单

      onCancel();
      onSuccess();
      return true;
    } catch (error) {
      console.log('error', error);
      message.error('提交失败，请重试');
      return false;
    }
  };

  // 使用 useEffect 监听 record 和 isEdit 的变化，设置初始值
    // 修改 useEffect 初始化逻辑
  useEffect(() => {
    if (isEdit && record) {
      // 确保状态值转换为数字
      const initialStatus = Number(record.status);
      
      form.setFieldsValue({
        name: record.name,
        description: record.description,
        status: record.status, // 直接使用数字类型
        codeMsgPList: record.codeMsgPList?.map(item => ({
          ...item,
          id: item.id || `temp_${Math.random().toString(36).substr(2, 9)}`
        })) || []
      });
      
      // 调试日志
      console.log('初始化状态值:', {
        source: record.status,
        converted: initialStatus,
        type: typeof initialStatus
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ 
        status: 0, // 设置默认值
        codeMsgPList: [] 
      });
    }
  }, [isEdit, record]);

  return (
    <Modal
      width={900}
      title={isEdit ? "编辑码表" : "新增码表"}
      open={modalVisible}
      footer={null}
      onCancel={onCancel}
    >
      <ProForm
        
        form={form} // 绑定 form
        key={formKey} // 强制重新渲染表单
        onFinish={handleFormFinish}
        initialValues={isEdit ? record : undefined}
      >
        <ProFormText
          name="name"
          label="码表名称"
          placeholder="请输入标准中文数名称"
          rules={[{ required: true, message: '请输入标准中文数名称' }]}
        />
        <ProFormTextArea
          name="description"
          label="码表说明"
          placeholder="请输入标准说明"
        />
        <ProFormSelect
          name="status"
          label="码表状态"
          options={[
            { label: '待发布', value: 0 },
            { label: '已发布', value: 1 },
            { label: '已停用', value: 2 },
          ]}
          fieldProps={{
            // 添加类型转换
            onChange: (value) => {
              console.log('选择的值:', value, '类型:', typeof value);
              return String(value);
            }
          }}
          rules={[
            { 
              required: true, 
              message: '请选择码表状态',
            
            }
          ]}
          transform={(value) => Number(value)} // 提交时转换
        />
        <Divider />
        <EditableProTable
          headerTitle="编码配置"
          name="codeMsgPList" // 保持与后端字段一致          headerTitle="编码配置"
          rowKey="id"
          columns={columns}
          value={dataSource} // 绑定到 dataSource
          editable={{
            type: 'multiple',
            onSave: async (key, row) => {
              console.log('保存', key, row);
            },
            onDelete: async (key, row) => {
              try {
                const res = await deleteCodeMsgUsingDelete({ id: row.id });
                console.log('res', res, 'key', key, 'row', row);
                setDataSource(dataSource.filter(item => item.id !== row.id));
              } catch (error) {
                console.error('删除失败', error);
              }
            },
            onCancel: async (key, row) => {
              console.log('取消', key, row);
            }
          }}
          onChange={(value) => {
            console.log('Table value changed:', value); // 调试：检查 value 是否正确
            setDataSource([...value]);
          }}
          recordCreatorProps={{
            position: 'bottom',
            record: { id: (Math.random() * 1000000).toFixed(0) },
          }}
        />
      </ProForm>
    </Modal>
  );
};

export default CodeForm;