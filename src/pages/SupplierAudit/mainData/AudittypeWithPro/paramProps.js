/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Connect: 1981824361@qq.com
 * @Date: 2020-10-27 16:37:48
 * @LastEditTime: 2020-10-27 16:44:39
 * @Description: 请求参数 props
 * @FilePath: /srm-sm-web/src/pages/SupplierAudit/mainData/AudittypeWithPro/paramProps.js
 */
import { baseUrl } from "../../../../utils/commonUrl";

// 评价体系 tree
export const supplierEvlSystemTree = {
    store: {
        url: `${baseUrl}/supplierEvlSystem/findTreeByBusinessUnitId`,
        params: { showCommon: false }
    },
    rowKey: 'id',
    reader: {
        name: 'name',
        field: ['id', 'code', 'parentId'],
        description: 'code'
    },
    placeholder: '请选择评价体系',
    style: {
        width: '100%'
    },
}
// 评价指标
export const getSupplierEvlSysRule = (param) => {
    return {
        store: {
            url: `${baseUrl}/supplierEvlSysRule/listRulesBySysId`,
        },
        columns: [
            {
                title: '指标代码',
                width: 80,
                dataIndex: 'supplierEvlRule',
                key: 'code',
                render: (text, record) => {
                    return text && text.code;
                }
            },
            {
                title: '指标名称',
                width: 200,
                dataIndex: 'supplierEvlRule',
                key: 'name',
                render: (text, record) => {
                    return text && text.name;
                }
            },
        ],
        reader: {
            name: item => item.supplierEvlRule.name,
            field: ['id', 'supplierEvlRule.code'],
            description: 'code'
        },
        rowKey: 'id',
        placeholder: '请先选择评价体系',
        style: {
            width: '100%'
        },
    }
}
// 审核类型 reviewType
export const reviewTypes = {
    store: {
        url: `${baseUrl}/reviewType/findBySearchPage`,
        type: 'POST'
    },
    remotePaging: true,
    columns: [
        {
            title: '审核类型代码',
            width: 80,
            dataIndex: 'code',
        },
        {
            title: '审核类型名称',
            width: 200,
            dataIndex: 'name',
        },
    ],
    reader: {
        name: 'name',
        field: ['id', 'code'],
    },
    rowKey: 'id',
    placeholder: '请选择审核类型',
    style: {
        width: '100%'
    },
};