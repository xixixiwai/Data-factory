import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { message, Button } from 'antd';
import { useModel, history } from '@umijs/max';
import { getAwardCountUsingPost } from '@/services/Login/kaishigongneng';

export default function LoginPage() {
  const { setInitialState } = useModel('@@initialState');

  const handleSubmit = async (values: any) => {
    try {
      const response = await getAwardCountUsingPost({
        email: values.email,
        password: values.password,
      });

      if (response.code === 100200 && response.data) {
        // 存储 token 到 localStorage
        localStorage.setItem('access_token', response.data);

        // 更新全局状态
        setInitialState({
          currentUser: { name: values.email },
        });

        // 跳转到首页
        history.push('/home');
        message.success('登录成功！');
      } else {
        message.error('登录失败，请检查邮箱和密码');
      }
    } catch (error) {
      message.error('登录失败，请检查网络或联系管理员');
      console.error('Login error:', error);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      background: 'linear-gradient(135deg, #e6f7ff 0%, #b3d8ff 100%)' 
    }}>
      <div style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
        padding: '20px', 
        borderRadius: '10px', 
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '550px',
        backdropFilter: 'blur(10px)', // 毛玻璃效果
        WebkitBackdropFilter: 'blur(10px)', // 用于 Safari 浏览器
      }}>
        <LoginForm
          title="登录"
          onFinish={handleSubmit}
        >
          <ProFormText
            name="email"
            fieldProps={{
              prefix: <UserOutlined />,
            }}
            placeholder="请输入邮箱"
            rules={[{ required: true, message: '邮箱不能为空' }]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              prefix: <LockOutlined />,
            }}
            placeholder="请输入密码"
            rules={[{ required: true, message: '密码不能为空' }]}
          />
          
        </LoginForm>
        <Button>注册</Button>
      </div>
    </div>
  );
}