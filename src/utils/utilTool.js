/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Connect: 1981824361@qq.com
 * @Date: 2020-10-21 17:58:33
 * @LastEditTime: 2020-10-23 14:42:23
 * @Description: 工具集
 * @FilePath: /srm-sm-web/src/utils/utilTool.js
 */
import React from 'react';
import { Form, Input } from 'antd';


const FormItem = Form.Item;
/**
  * @description 表单 map 对象 搜索去掉空字符串 undefined null值 保留有效参数值F
  * @author LC@1981824361
  * @date 2020-05-30
  * @export
  * @param {*} filedsValue
  * @returns serchObj
  */
export function filterEmptyFileds(filedsValue) {
    if (!filedsValue) {
        throw new Error('请传入表单数据！');
    } else {
        const serchObj = {};
        Object.keys(filedsValue).forEach(key => {
            if (key && filedsValue[key]) {
                serchObj[key] = filedsValue[key];
            } else if (filedsValue[key] === false) {
                serchObj[key] = filedsValue[key];
            }
        });
        return serchObj;
    }
}
/**
* @description 空值判断
* @author LC@1981824361
* @date 2019-06-11
* @export
* @param {*} value
* @returns
*/
export function checkNull(value) {
    if (!value || value == null || typeof value === 'undefined' || value === '') {
        return true;
    }
    return false;
}
/**
* @description 空数组[]判断
* @author LC@1981824361
* @date 2020-06-11
* @export
* @param {*} array
* @returns {boolean}
*/
export function isEmptyArray(array) {
    if (checkNull(array)) {
        return true;
    }
    // Object.prototype.toString.call(o) === '[object Array]'
    if (Object.prototype.toString.call(array).slice(8, -1) === 'Array' && array.length === 0) {
        return true;
    }
    return false;
}

/**
* @description 空对象{}判断
* @author LC@1981824361
* @date 2019-05-22
* @export
* @param {*} object
* @returns {boolean}
*/
export function isEmptyObject(object) {
    if (checkNull(object)) {
        return true;
    }
    // Object.prototype.toString.call(o) === '[object Object]'
    if (Object.prototype.toString.call(object).slice(8, -1) === 'Object' && Object.keys(object).length === 0) {
        return true;
    }
    return false;
}

/**
 * @description 随机 uuid
 * @author LC@1981824361
 * @date 2020-10-22
 * @export
 * @returns 
 */
export function guid() {
    return 'xxxx-xxxx-xxxx-xxxx-xxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

//避免数字为0而出现的bug
export const numberInitialValue = (value) => {
    return checkNull(value) ? '' : value.toString()
};

/**
 * @description:  隐藏表单  不占位
 * @param {type} 
 * @return {type} 
 */
export const hideFormItem = (getFieldDecorator) => {
    return (name, initialValue) =>
        <div style={{ display: 'none' }}>
            <FormItem>
                {
                    getFieldDecorator(name, {
                        initialValue: numberInitialValue(initialValue),
                    })(
                        <Input type={"hidden"} />
                    )
                }
            </FormItem>
        </div>
};  