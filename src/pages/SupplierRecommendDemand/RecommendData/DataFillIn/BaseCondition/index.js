/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-08 15:52:52
 * @LastEditTime: 2020-09-08 17:47:16
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/DataFillIn/BaseCondition/index.js
 * @Description: 基本情况 Tab
 * @Connect: 1981824361@qq.com
 */
import React, { useState } from 'react';
import { Form, message } from 'antd';




const BaseCondition =(props)=> {

    const [test, setTest] = useState('初始化');

    function showThing () {
        message.info('成功');
        setTest(()=>'构造');
    }
    return(
        <a onClick={()=>showThing()}>BaseCondition 基本情况{props.params}</a>
    )
};

export default Form.create()(BaseCondition);