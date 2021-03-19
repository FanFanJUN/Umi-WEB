/*
 * @Author       : LiCai
 * @connect      : 1981824361@qq.com
 * @Date         : 2021-03-19 14:29:49
 * @LastEditors  : LiCai
 * @LastEditTime : 2021-03-19 14:32:45
 * @Description  : TODO
 * @FilePath     : /Umi-WEB/src/pages/Hooks/useReducer/index.js
 */
import React,{ useReducer } from 'react';

function ReducerDemo(){
  // useReducer第一个是Reducer函数，第二个是state的默认值
  const [count, dispatch] = useReducer((state,action)=>{
  	switch(action){
    case 'add':
      return state+1
    case 'sub':
      return state-1
    default:
      return state
    }
  },0) 
  
  return (
    <div>
    	<h2>现在的分数是{ count }</h2>
			<button onClick={()=>{dispatch('add')}}>Increment</button>
			<button onClick={()=>{dispatch('sub')}}>Decrement</button>
    </div>)
}

export default ReducerDemo;