/*
 * @Author       : LiCai
 * @connect      : 1981824361@qq.com
 * @Date         : 2021-03-24 09:44:02
 * @LastEditors  : LiCai
 * @LastEditTime : 2021-03-24 11:29:06
 * @Description  : 虚表
 * @FilePath     : /Umi-WEB/src/pages/TestComps/test1.js
 */
import React, { Fragment } from "react";
import VirtualTable from "../comps/VirtualTable";
import './index.less';

const dataSource = new Array(1000)
  .join(',')
  .split(',')
  .map((_, inx) => ({
    key: inx,
    name: 'John BrownJohn BrownJohn BrownJohn',
    name1: 'John',
    name2: 'Brown',
    name3: 'John',
  }));


  const columns = [
    {
      title: 'Full Name0',
      width: 202,
      dataIndex: 'name',
      fixed: 'left',
    },
    {
      title: 'Full Name3',
      width: 202,
      dataIndex: 'name3',
    },
    {
      title: 'Full Name2',
      width: 202,
      dataIndex: 'name2',
    },
    {
      title: 'Full Name1',
      dataIndex: 'name1',
    },
  ];


export default function Test1 () {
    return (
        <Fragment>
        <h1 className='color'>ces</h1>
        <VirtualTable columns ={columns}  data = {dataSource}/>
        </Fragment> 
    )
}