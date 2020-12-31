/*
 * @Author       : LiCai
 * @connect      : 1981824361@qq.com
 * @Date         : 2020-12-28 10:31:36
 * @LastEditors  : LiCai
 * @LastEditTime : 2020-12-30 17:51:20
 * @Description  : 导出||下载出模板
 * @FilePath     : /srm-sm-web/src/pages/SupplierAudit/AnnualAuditPlan/BatchImport/ExportButtonRe.js
 */
import {Button, message} from 'antd';
import React, { useState } from 'react';
import { downloadBlobFile } from '../../../../utils';
import { downLoadTemp } from '../service';
// 导出excel
/**
 *
 * @param api 导出的接口
 * @param params 当前的查询条件
 * @param fileName 导出的文件名（和后端确认文件扩展名是xls还是xlsx）
 * @param method 请求方式（默认get方式）
 * @param object 指向对象（接收传的this对象）
 * @param disabled 是否禁用
 * @param restProps 其余参数
 */
const ExportButtonRe = ({api = '', params = {}, fileName = '未知文件名.xlsx', type = 'default', method = 'get', object, disabled = false, exportButtonLoading, ...restProps}) => {
    
    const [loading, setloading] = useState(false);
    const handleClick = async(api, params, fileName, method, object) => {
        if (method === 'get') {
        } else {
            setloading(true);
            try {
            const { success, data } = await downLoadTemp({ params, api });
            if (success) {
              downloadBlobFile(data, fileName);
            }
            setloading(false);
            } catch (error) {
                setloading(false);
                message.error(error);
            }
        }
    }

    return (
        <Button
            style={restProps.style || {marginLeft: 8}}
            type={type}
            loading={loading}
            onClick={() => {
                handleClick(api, params, fileName, method, object);
            }}
            disabled={disabled}
        >
            {restProps.btnName || '导出'}
        </Button>
    );
};

export default ExportButtonRe;
