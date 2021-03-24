import React, { Fragment, useEffect, useState } from "react";

/*
 * @Author       : LiCai
 * @connect      : 1981824361@qq.com
 * @Date         : 2021-03-23 09:52:47
 * @LastEditors  : LiCai
 * @LastEditTime : 2021-03-23 10:05:17
 * @Description  : TODO
 * @FilePath     : /Umi-WEB/src/pages/Hooks/useEffect/test2.js
 */
export default function Test2 () {
    const [count, setCount] = useState(0);
    const [show, setShow] = useState(false);

    // Uncaught Error: Too many re-renders. React limits the number of renders to prevent an infinite loop.

   /*  if(count === 1) {
        setShow(x => true);
    } */

    // react-dom.development.js:14980 Uncaught Error: Rendered more hooks than during the previous render.
    /* if(count === 1) {
        useEffect(() => {
            setShow(true);
        }, [])
    } */

    // 正常运行
    if(count === 1) {
        useEffect(() => {
            setShow(true);
        }, [])
    } else {
        useEffect(() => {
            setShow(false);
        }, [])
    }
    
    return (
        <Fragment>
            {count}
            <button onClick={()=> setCount(x=> x + 1)}>点击</button>
            {show && <h1>显示</h1>}
        </Fragment>
    )
}