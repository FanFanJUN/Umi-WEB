/*
 * @Author       : LiCai
 * @connect      : 1981824361@qq.com
 * @Date         : 2021-03-19 14:39:08
 * @LastEditors  : LiCai
 * @LastEditTime : 2021-03-19 15:11:24
 * @Description  : 复杂结合实例
 * @FilePath     : /Umi-WEB/src/pages/Hooks/useReducer/Test/index.js
 */
/* 在color.js中使用useReducer并解构出color和dispatch。
在color.js中使用createContext给子组件传递color和dispatch。
在Example.js中将ShowArea和Buttons作为Color的子组件写上，那么2中的子组件就是ShowArea和Buttons了。
在Buttons.js中使用useContext拿到dispatch，在showArea.js中使用useContext拿到color并展示 */


// 使用useContext、useReducer封装一个类似于redux仓库
import React from 'react';
import ShowArea from './showArea';
import Buttons from './buttons';
import {Color} from './color'

function Example(){
  return (
    <div>
      <Color>
        <ShowArea />
        <Buttons />
      </Color>
    </div>
  )
}

export default Example