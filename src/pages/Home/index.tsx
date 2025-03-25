import React from 'react'
import { PageContainer } from '@ant-design/pro-components';
import { Outlet } from '@umijs/max';

export default function index() {
  return (
    <PageContainer>
      <Outlet />
    </PageContainer>
  )
}
