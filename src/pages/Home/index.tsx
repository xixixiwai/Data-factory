import React from 'react'
import { PageContainer } from '@ant-design/pro-components';
import { Outlet, useLocation } from '@umijs/max';// 引入路由组件
import EChartsReact from 'echarts-for-react';
// import { useLocation } from 'react-router-dom';
import DataVisualization from './echarts';
export default function index() {
  const location = useLocation(); // 获取当前路由信息
  const isParentRoute = location.pathname === '/home'; // 判断是否是父路由（根据实际路径调整）
  return (

    <>
      <PageContainer>
        <Outlet />

      </PageContainer>
      {isParentRoute && (
        <DataVisualization />
      )}

    </>
  )
}
