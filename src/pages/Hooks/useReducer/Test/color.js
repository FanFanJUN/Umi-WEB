/*
 * @Author       : LiCai
 * @connect      : 1981824361@qq.com
 * @Date         : 2021-03-19 14:41:12
 * @LastEditors  : LiCai
 * @LastEditTime : 2021-03-19 14:57:40
 * @Description  : TODO
 * @FilePath     : /Umi-WEB/src/pages/Hooks/useReducer/Test/color.js
 */
import React, { createContext,useReducer } from 'react';

export const ColorContext = createContext({})

export const UPDATE_COLOR = "UPDATE_COLOR" // 声明一个常量，关于color的配置都写里面

const reducer = (state,action)=>{
	switch(action.type){
    case UPDATE_COLOR:
      return action.color
    default:
      return state
  }
}

export const Color = props=>{
  const [color,dispatch] = useReducer(reducer,'blue') // 第一步
  
	return (
         // 第二步
  	<ColorContext.Provider value={{color,dispatch}}> 
    	{props.children}
    </ColorContext.Provider>
  )
}