/*
 * @Author       : LiCai
 * @connect      : 1981824361@qq.com
 * @Date         : 2021-03-19 14:49:27
 * @LastEditors  : LiCai
 * @LastEditTime : 2021-03-19 14:51:03
 * @Description  : TODO
 * @FilePath     : /Umi-WEB/src/pages/Hooks/useReducer/Test/showArea.js
 */
import React,{useContext} from 'react';
import {ColorContext} from './color'

function ShowArea(){
  const {color} = useContext(ColorContext)  // 第四步 
  return (<div style={{color:color}}>字体颜色为{color}</div>)  //第四步
}

export default ShowArea;