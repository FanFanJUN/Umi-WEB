/*
 * @Author       : LiCai
 * @connect      : 1981824361@qq.com
 * @Date         : 2021-03-19 13:40:30
 * @LastEditors  : LiCai
 * @LastEditTime : 2021-03-19 14:02:15
 * @Description  : TODO
 * @FilePath     : /Umi-WEB/src/pages/Hooks/useEffect/test1.js
 */
import React, { useEffect, Fragment, useState } from "react";


const Input = (props) => {
    const { value }= props;

    // shouldComponentUpdate 浅比较
    useEffect(() => {
        console.log(`value change: ${value}`);
    }, [value])

    return <input/>;
}
function Test1 () {

    const [value, setvalue] = useState(0);

    useEffect(() => {
        console.log('componentDidMount');
        return () => {
            console.log('componentWillUnmount 资源回收 卸载');
        }
    }, [])

    return(
        <Fragment>
            <Input value={value}/>
            <button onClick={()=> setvalue(Math.random())}>点击</button>
        </Fragment>
    )
}

export default Test1;