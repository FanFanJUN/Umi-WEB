/*
 * @Author       : LiCai
 * @connect      : 1981824361@qq.com
 * @Date         : 2021-03-19 09:36:46
 * @LastEditors  : LiCai
 * @LastEditTime : 2021-03-19 13:37:13
 * @Description  : 
 * @FilePath     : /Umi-WEB/src/pages/Hooks/useEffect/index.js
 */
import { Button } from "antd";
// import React, { Fragment, useState } from "react";
// import { useEffect } from "react";

// const TestCount =() => {
//     const [count, setcount] = useState(0);

//     useEffect(() => {
//         console.log('222222');
//         setTimeout(() => {
//             setcount(x => x + 1);
//         }, 0);
//         // return () => {
//         //     cleanup
//         // }
//     }, [])

//     console.log('111111');
//     return (
//         <div style={{textAlign: 'center', padding: '14px'}}>
//             {count}
//         </div>
//     )
// }

// export default TestCount;

import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect( () => {
    // Update the document title using the browser API
    console.log('执行');
    document.title = `You clicked ${count} times`;
    return () => {
      console.log('离开卸载');
    }
  }, [count]);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}

export default Example;