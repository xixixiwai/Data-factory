import { Access, useAccess } from '@umijs/max';
import { Button } from 'antd';
import {useRef, useState} from 'react'

const AccessPage: React.FC = () => {
  const access = useAccess();
  const [inputValue,setInputValue]=useState<string>('');
    const [orderList,setOrderList]=useState<string[]>([]);
    const inputRef=useRef<any>(null);
    // 处理输入框的输入变化
    const handleInputChange=(e:any):void=>{
      
      // 将输入框的值赋给inputValue
      setInputValue(e.target.value);
    }
    const handleAdd=():void=>{
      console.dir(inputRef.current?.value)
      // orderList.push(inputValue);
      setOrderList([...orderList,inputValue]);//将inputValue添加到orderList中，并更新orderList的值
      // setInputValue('');
    }
  return (
    < >
   
      <Access accessible={access.canSeeAdmin}>
        <Button>只有 Admin 可以看到这个按钮</Button>
      </Access>
    <input value={inputValue} onChange={handleInputChange} type="text" style={{ width: '200px' }} />
    <button type='button' onClick={handleAdd} style={{ width: '200px' }}>添加</button>
    {orderList?.map((item,index)=>{
      return <div key={item}>{item}</div>
    })}
     {/* 第二种input方式  非受控组件*/}
    <input ref={inputRef} type='text' style={{ width: '200px' }}/>
    </>
    
  );
};

export default AccessPage;
