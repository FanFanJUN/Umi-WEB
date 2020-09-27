/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-09 13:47:57
 * @LastEditTime: 2020-09-21 11:03:38
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/DataFillIn/BaseCondition/MproCertification.js
 * @Description: 管理体系及产品认证
 * @Connect: 1981824361@qq.com
 */
import { useEffect, useState, useRef, Fragment } from 'react';
import { ExtTable, ComboList, ExtModal, utils, ToolBar, ScrollBar } from 'suid';
import { Button, Divider } from 'antd';
import moment from 'moment';
import EditableFormTable from '../CommonUtil/EditTable';

const MproCertification = ({ type, data, setTableData }) => {

    const [proData, setProData] = useState(data.productCertifications);
    const [otherData, setOtherData] = useState(data.productCertifications);

    const tableRef = useRef(null);

    const columnsForMan = [
        { title: '管理体系', dataIndex: 'certificateName', ellipsis: true, },
        { title: '认证类型', dataIndex: 'certificateInfoType', ellipsis: true, editable: true },
        { title: '执行标准', dataIndex: 'executiveStandard', ellipsis: true, },
        { title: '证照编号', dataIndex: 'certificateNumber', ellipsis: true, },
        { title: '发证机构', dataIndex: 'certifyingAuthority', ellipsis: true, },
        {
            title: '首次获证时间', dataIndex: 'firstObtainTime', ellipsis: true, render: (text) => {
                return text && moment(text).format('YYYY-MM-DD');
            }
        },
        { title: '有效期间', dataIndex: 'validDate', ellipsis: true, },
        { title: '附件', dataIndex: 'attachmentIds', ellipsis: true, },
        {
            title: '计划取得时间', dataIndex: 'planObtainTime', ellipsis: true, render: (text) => {
                return text && moment(text).format('YYYY-MM-DD');
            }
        },
    ].map(item => ({ ...item, align: 'center' }));

    const columnsForPro = [
        { title: '产品', dataIndex: 'productName', ellipsis: true, editable: true },
        {
            title: '认证类型', dataIndex: 'certificateInfoType', ellipsis: true,
            editable: true, inputDisabled: true, inputDefaultValue: 'PRODUCT_CERTIFICATION',
            inputType: 'Select',
            selectOptions: [
                {name: '管理体系', value: 'MANAGEMENT_SYSTEM'},
                {name: '产品认证', value: 'PRODUCT_CERTIFICATION'},
                {name: '其他认证', value: 'OTHER_CERTIFICATION'},
            ]
        },
        { title: '执行标准', dataIndex: 'executiveStandard', ellipsis: true, editable: true },
        { title: '证照编号', dataIndex: 'certificateNumber', ellipsis: true, editable: true },
        { title: '发证机构', dataIndex: 'certifyingAuthority', ellipsis: true, editable: true },
        {
            title: '首次获证时间', dataIndex: 'firstObtainTime', ellipsis: true, render: (text) => {
                return text && moment(text).format('YYYY-MM-DD');
            }, inputType: 'DatePicker', editable: true
        },
        { title: '最新年审', dataIndex: 'newestAnnualReview', ellipsis: true, editable: true },
        { title: '附件', dataIndex: 'attachmentIds', ellipsis: true, editable: true, inputType: 'UploadFile' },
        {
            title: '计划取得时间', dataIndex: 'planObtainTime', ellipsis: true, render: (text) => {
                return text && moment(text).format('YYYY-MM-DD');
            }, inputType: 'DatePicker', editable: true
        },
    ].map(item => ({ ...item, align: 'center' }));

    const columnsForOther = [
        { title: '产品', dataIndex: 'productName', ellipsis: true, editable: true },
        {
            title: '认证类型', dataIndex: 'certificateInfoType', ellipsis: true,
            editable: true, inputDisabled: true, inputDefaultValue: 'OTHER_CERTIFICATION',
            inputType: 'Select',
            selectOptions: [
                {name: '管理体系', value: 'MANAGEMENT_SYSTEM'},
                {name: '产品认证', value: 'PRODUCT_CERTIFICATION'},
                {name: '其他认证', value: 'OTHER_CERTIFICATION'},
            ]
        },
        { title: '执行标准', dataIndex: 'executiveStandard', ellipsis: true, editable: true },
        { title: '证照编号', dataIndex: 'certificateNumber', ellipsis: true, editable: true },
        { title: '发证机构', dataIndex: 'certifyingAuthority', ellipsis: true, editable: true },
        {
            title: '首次获证时间', dataIndex: 'firstObtainTime', ellipsis: true, render: (text) => {
                return text && moment(text).format('YYYY-MM-DD');
            }, inputType: 'DatePicker', editable: true
        },
        { title: '最新年审', dataIndex: 'newestAnnualReview', ellipsis: true, editable: true },
        { title: '附件', dataIndex: 'attachmentIds', ellipsis: true, editable: true, inputType: 'UploadFile' },
        {
            title: '计划取得时间', dataIndex: 'planObtainTime', ellipsis: true, render: (text) => {
                return text && moment(text).format('YYYY-MM-DD');
            }, inputType: 'DatePicker', editable: true
        },
    ].map(item => ({ ...item, align: 'center' }));

    function setProNewData(newData) {
        setProData(newData);
        setTableData(newData, 'pro');
    }

    function setOtherNewData(newData) {
        setOtherData(newData);
        setTableData(newData, 'other');
    }
    
    return <Fragment>
        <div>
            <Divider>管理体系</Divider>
            <EditableFormTable
                columns={columnsForMan}
                bordered
                allowCancelSelect
                showSearch={false}
                remotePaging
                rowKey={(item) => item.id}
                size='small'
            />
            <Divider>产品认证</Divider>
            <EditableFormTable
                columns={columnsForPro}
                bordered
                allowCancelSelect
                showSearch={false}
                remotePaging
                rowKey='id'
                size='small'
                isEditTable
                isToolBar={type === 'add'}
                setNewData={setProNewData}
                dataSource={proData || []}
            />
            <Divider>其他认证</Divider>
            <EditableFormTable
                columns={columnsForOther}
                bordered
                allowCancelSelect
                showSearch={false}
                remotePaging
                rowKey='id'
                size='small'
                isEditTable
                isToolBar={type === 'add'}
                dataSource={otherData || []}
                setNewData={setOtherNewData}
            />
        </div>
    </Fragment>
}

export default MproCertification;