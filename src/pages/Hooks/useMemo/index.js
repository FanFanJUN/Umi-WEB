/*
 * @Author       : LiCai
 * @connect      : 1981824361@qq.com
 * @Date         : 2021-03-19 15:02:45
 * @LastEditors  : LiCai
 * @LastEditTime : 2021-03-19 15:07:04
 * @Description  : TODO
 * @FilePath     : /Umi-WEB/src/pages/Hooks/useMemo/index.js
 */

import React ,{useMemo, useState} from 'react'
import { Fragment } from 'react'
//子组件接收一个count，那么只有在count发生变化才会触发这个函数，否则就跳过
const Dom=({count})=> {
   let cc =  useMemo(()=>{
       return count *2
   },[count])
  return <div>
      <h1>Dom {count}------{cc}</h1>
  </div>
}

function Parent() {
    const [count, setcount] = useState(0);
    return (
      <Fragment>
        <Dom count={count} />
        <a onClick={() => setcount(Math.random())}>Parent: 点击</a>
      </Fragment>
    );
}

export default Parent;