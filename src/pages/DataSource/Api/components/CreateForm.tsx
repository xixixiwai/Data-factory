import { Button, Modal, Form, Popconfirm } from 'antd';
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



interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  treeData: any;
}

//新增数据
interface CreateFormState {
  /** 请求协议，如 HTTP、HTTPS 等,0是HTTP 1是HTTPS */
  agreement: number;
  /** 接口的详细说明 */
  description?: string;
  /** IP 端口 */
  ip: string;
  /** 请求方式，如 GET、POST 等 0是GET 1是POST */
  method: number;
  /** 接口的名称，用于识别接口 */
  name: string;
  /** Path */
  path: string;
  /** 输入 body，JSON 类型 */
  requestBodyList: Record<string, any>[];
  /** 输入参数，JSON 类型 */
  requestParamList: Record<string, any>[];
  /** 输出参数，JSON 类型 */
  responseList: Response[];
  /** 接口的来源,写死（数据服务、指标管理、决策引擎） */
  source: string;
  /** 判断新增的时候这个是否是草稿,3代表这个是草稿，不输入的话代表这个不是草稿 */
  status?: number;
  /** 超时时间，默认时间是30s */
  timeout: number;
  /** 接口分类目录编号，关联接口分类 */
  type: number;
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
  // 定义通用表格列
  const commonColumns1 = [
    {
      title: '参数名称',
      dataIndex: 'name',
      width: 130,
      formItemProps: {
        rules: [{ required: true, message: '请输入参数名称' }],
      },
    },
    {
      title: '参数位置',
      dataIndex: 'location',
      width: 130,
      valueType: 'select',
      valueEnum: {
        1: { text: 'query', status: '1' },
        2: { text: 'header', status: '2' },
        3: { text: 'body', status: '3' },
        4: { text: 'path', status: '4' },
      },
      formItemProps: {
        rules: [{ required: true, message: '请选择数据类型' }],
      },
    },
    {
      title: '数据类型',
      dataIndex: 'type',
      width: 130,
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
      width: 100,
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
      title: '默认值',
      dataIndex: 'defaultValue',
      width: 110,
    },
    {
      title: '参数描述',
      dataIndex: 'description',
      width: 180,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 250,
      render: (text, record, _, action) => [
        <Button
          key="editable"
          type="primary"
          onClick={() => {

            console.log('record0', record);

            action?.startEditable?.(record.id);
          }}
        >
          编辑
        </Button>,
        <Popconfirm
          key="delete"
          title="确定删除吗？"
          onConfirm={() => {
            setTableData(tableData.filter((item) => item.id !== record.id));
          }}
        >

          <Button type="primary" style={{ marginLeft: 8 }}>
            删除
          </Button>
        </Popconfirm>,


      ],
    },
  ];
  const commonColumns2 = [
    {
      title: '参数名称',
      dataIndex: 'name',
      width: 260,
      formItemProps: {
        rules: [{ required: true, message: '请输入参数名称' }],
      },
    },

    {
      title: '数据类型',
      dataIndex: 'type',
      width: 130,
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
      width: 100,
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
      title: '默认值',
      dataIndex: 'defaultValue',
      width: 110,
    },
    {
      title: '参数说明',
      dataIndex: 'description',
      width: 180,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 250,
      render: (text, record, _, action) => {
        // 检查 record 是否包含 children 字段
        const hasChildren = record.children && Array.isArray(record.children);

        return [
          <Button
            key="editable"
            type="primary"
            onClick={() => {
              console.log('record0', record);
              action?.startEditable?.(record.id);
            }}
          >
            编辑
          </Button>,
          <Popconfirm
            key="delete"
            title="确定删除吗？"
            onConfirm={() => {
              // 递归删除目标记录
              const deleteRecord = (data, id) => {
                // 遍历当前层级的数据
                return data.filter((item) => {
                  // 如果当前 item 的 id 与目标 id 匹配，则过滤掉
                  if (item.id === id) {
                    return false;
                  }
                  // 如果当前 item 包含 children，递归处理
                  if (item.children && Array.isArray(item.children)) {
                    item.children = deleteRecord(item.children, id);
                  }
                  return true;
                });
              };

              // 更新数据
              const updatedData = deleteRecord(requestBodyData, record.id);
              setRequestBodyData(updatedData);
            }}
          >
            <Button type="primary" style={{ marginLeft: 8 }}>

              删除
            </Button>
          </Popconfirm>,
          // 如果 record 包含 children 字段，则渲染“添加下级”按钮
          hasChildren && (
            // <Button
            //   key="add"
            //   type="primary"
            //   onClick={() => {
            //     // 生成新记录
            //     const newRecord = {
            //       id: Date.now().toString(), // 唯一 id
            //       name: '',
            //       type: 'String',
            //       required: false,
            //       description: '',
            //     };

            //     // 更新数据
            //     const updatedData = [...requestBodyData];
            //     const targetIndex = updatedData.findIndex((item) => item.id === record.id);
            //     const targetRow = { ...updatedData[targetIndex] };

            //     // 如果没有 children 字段，初始化为空数组
            //     if (!targetRow.children) {
            //       targetRow.children = [];
            //     }

            //     // 将新记录添加到 children 中
            //     targetRow.children.push(newRecord);

            //     // 更新数据
            //     updatedData[targetIndex] = targetRow;
            //     setRequestBodyData(updatedData);

            //     // 启动编辑状态
            //     // action?.startEditable?.(newRecord.id);
            //     // console.log('actionref2', actionRef2);

            //     // actionRef2.current?.addEditRecord(newRecord);
            //   }}
            //   style={{ marginLeft: 8 }}
            // >
            //   添加下级
            // </Button>
            <Button
              key="add"
              type="primary"
              onClick={() => {
                actionRef2.current?.addEditRecord?.({
                  id: Date.now().toString(),
                  name: '',
                  type: 'String',
                  required: false,
                  description: '',
                }, {
                  parentKey: record.id, // 关键：指定父节点
                  position: 'bottom'
                });
              }}
            >
              添加下级
            </Button>
          ),
        ].filter(Boolean); // 过滤掉 null 或 undefined 的元素
      },
    }
  ];
  const commonColumns3 = [
    {
      title: '参数名称',
      dataIndex: 'name',
      width: 260,
      formItemProps: {
        rules: [{ required: true, message: '请输入参数名称' }],
      },
    },

    {
      title: '数据类型',
      dataIndex: 'type',
      width: 130,
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
      title: '参数说明',
      dataIndex: 'description',
      width: 400,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 250,
      render: (text, record, _, action) => {
        // 检查 record 是否包含 children 字段
        const hasChildren = record.children && Array.isArray(record.children);

        return [
          <Button
            key="editable"
            type="primary"
            onClick={() => {
              console.log('record0', record);
              action?.startEditable?.(record.id);
            }}
          >
            编辑
          </Button>,
          <Popconfirm
            key="delete"
            title="确定删除吗？"
            onConfirm={() => {
              // 递归删除目标记录
              const deleteRecord = (data, id) => {
                // 遍历当前层级的数据
                return data.filter((item) => {
                  // 如果当前 item 的 id 与目标 id 匹配，则过滤掉
                  if (item.id === id) {
                    return false;
                  }
                  // 如果当前 item 包含 children，递归处理
                  if (item.children && Array.isArray(item.children)) {
                    item.children = deleteRecord(item.children, id);
                  }
                  return true;
                });
              };

              // 更新数据
              const updatedData = deleteRecord(responseData, record.id);
              setResponseData(updatedData);
            }}
          >
            <Button type="primary" style={{ marginLeft: 8 }}>
              删除
            </Button>
          </Popconfirm>,
          // 如果 record 包含 children 字段，则渲染“添加下级”按钮
          hasChildren && (
            <Button
              key="add"
              type="primary"
              onClick={() => {
                actionRef3.current?.addEditRecord?.({
                  id: Date.now().toString(),
                  name: '',
                  type: 'String',
                  required: false,
                  description: '',
                }, {
                  parentKey: record.id, // 关键：指定父节点
                  position: 'bottom'
                });
              }}
            >
              添加下级
            </Button>
          ),
        ].filter(Boolean); // 过滤掉 null 或 undefined 的元素
      },
    }
  ];

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
    actionRef: React.MutableRefObject<ActionType | null>;// 添加actionRef属性
  }) => {
    // 计算默认展开的行
    const getExpandedRowKeys = (data: any) => {
      const expandedKeys: any = [];
      const traverse = (items: any) => {
        items.forEach((item: any) => {
          if (item.children && Array.isArray(item.children)) {
            expandedKeys.push(item.id);
            traverse(item.children);
          }
        });
      };
      traverse(data);
      return expandedKeys;
    };

    const expandedRowKeys = getExpandedRowKeys(data);
    return (
      <ProCard
        title={title || '参数配置'}
        bordered
        headerBordered
        extra={
          <Button
            type="primary"
            onClick={() => {
              console.log('actionref', actionRef);
              actionRef.current?.addEditRecord?.({
                id: Date.now().toString(),
                name: '',
                type: 'String',
                required: false,
                description: '',
                children: [],
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
            actionRender: (row, config, defaultDoms) => {
              return [
                <>
                  <Button type="primary">
                    {defaultDoms.save}
                  </Button>
                  <Button type="primary">
                    {defaultDoms.cancel}
                  </Button>

                  <Button
                    key="code-definition"
                    type="primary"
                    onClick={() => {
                      console.log(row);
                    }}
                  >
                    码值定义
                  </Button>
                </>

              ]

            }
          }}
          scroll={{ x: 'max-content' }}
          style={{ overflow: 'visible' }}
          expandable={{//默认展开所有行
            defaultExpandedRowKeys: expandedRowKeys,
            rowExpandable: (record) => !!record.children,
          }}
        />
      </ProCard>
    )

  };

  // 递归函数，用于将树形结构转换为扁平化的选项列表
  const convertTreeToOptions = (tree: any[]): any[] => {
    return tree.flatMap((node) => [
      { label: node.title, value: node.id },
      ...(node.children?.length ? convertTreeToOptions(node.children) : []),
    ]);
  };

  // 转换 treeData 为 ProFormSelect 需要的格式
  const options = convertTreeToOptions(treeData);
  return (
    <Modal open={modalVisible} footer={null} onCancel={onCancel} width={1200}>
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
              // options={[
              //   {
              //     value: 0,
              //     label: '分类1',
              //   },
              //   {
              //     value: 1,
              //     label: '分类2',
              //   },
              // ]}
              options={options}
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
              columns={commonColumns1}
              data={tableData}
              onDataChange={setTableData}
              title="输入参数配置"
              actionRef={actionRef1}
            />

            <EnhancedEditableTable

              columns={commonColumns2}
              data={requestBodyData}
              onDataChange={setRequestBodyData}
              title="请求Body配置"
              actionRef={actionRef2}

            />

            <EnhancedEditableTable
              columns={commonColumns3}
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