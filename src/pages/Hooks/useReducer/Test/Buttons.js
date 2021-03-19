/*
 * @Author       : LiCai
 * @connect      : 1981824361@qq.com
 * @Date         : 2021-03-19 14:51:22
 * @LastEditors  : LiCai
 * @LastEditTime : 2021-03-19 14:57:25
 * @Description  : TODO
 * @FilePath     : /Umi-WEB/src/pages/Hooks/useReducer/Test/Buttons.js
 */

import React,{useContext} from 'react'
import {ColorContext,UPDATE_COLOR} from './color'

function Buttons(){
  const {dispatch} = useContext(ColorContext)  // 第四步
  return (
  	<div>
    	<button onClick={()=>{dispatch({type:UPDATE_COLOR,color:"red"})}}>红色</button> 
    	<button onClick={()=>{dispatch({type:UPDATE_COLOR,color:"yellow"})}}>黄色</button>
    </div>
  )
}

export default Buttons;