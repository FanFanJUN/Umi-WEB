/*
 * @Author       : LiCai
 * @connect      : 1981824361@qq.com
 * @Date         : 2021-03-17 11:05:52
 * @LastEditors  : LiCai
 * @LastEditTime : 2021-03-17 13:35:28
 * @Description  : React Hooks ---- useState
 * @FilePath     : /Umi-WEB/src/pages/Hooks/useState/index.js
 */

import { Button } from "antd";
import React, { Fragment, useState } from "react";

export default function TestCount () {
    const [count, setcount] = useState(0);
    return (
        <div style={{textAlign: 'center', padding: '14px'}}>
            {count}
            <Button onClick={()=> setcount(x => x + 1)}>点击+1</Button>
        </div>
    )
}
