import { useState } from 'react';
import { Button, Modal, Table } from 'antd';

type CodeTableDetailProps = {
  visible: boolean;
  onCancel: () => void;
  codeTableDetail: Array<{
    mean: string;
    name: string;
    value: string;
    codeTbId: string;
  }>;
};

export default function CodeTableDetail({ visible, onCancel, codeTableDetail }: CodeTableDetailProps) {
  return (
    <Modal
      title="码表详情"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="close" onClick={onCancel}>
          关闭
        </Button>,
      ]}
    >
      <Table
        columns={[
          {
            title: '码值取值',
            dataIndex: 'value',
            key: 'value',
          },
          {
            title: '码值名称',
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: '码值含义',
            dataIndex: 'mean',
            key: 'mean',
          },
        ]}
        dataSource={codeTableDetail}
        pagination={false}
      />
    </Modal>
  );
}