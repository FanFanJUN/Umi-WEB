/*
 * @Author       : LiCai
 * @connect      : 1981824361@qq.com
 * @Date         : 2021-03-19 14:17:39
 * @LastEditors  : LiCai
 * @LastEditTime : 2021-03-19 14:18:18
 * @Description  : TODO
 * @FilePath     : /Umi-WEB/src/pages/Hooks/useContext/index.js
 */
import React,{ useState,createContext,useContext } from 'react'

const CountContext = createContext();  // 1.构建Context

//3.声明子组件
function Counter(){
	let count = useContext(CountContext) // 4.使用useContext接收被共享出去的CountContext
  return (<h2>{count}</h2>)
}

function Example(){
  const [ count,setCount ] = useState(0) 
  
  return (
    <div>
    	<p>You clicked {count} times</p>
			<button onClick={()=>{setCount(count+1)}}>Click me</button> 
			{/* 2.将数据在Provider中共享，count这个数已经被共享出去了 */}
			<CountContext.Provider value={count}>  
        <Counter />
      </CountContext.Provider>
		</div>
	)
}
export default Example;
