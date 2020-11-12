import React, { useRef, useState } from 'react';
import { ExtTable, utils, DataExport } from 'suid';
import moment from 'moment';
import { Button, Input } from 'antd';
import { recommendUrl } from '../../../../utils/commonUrl';
import Header from '../../../../components/Header';
import AdvancedForm from '../../../../components/AdvancedForm';
import AutoSizeLayout from '../../../../components/AutoSizeLayout';
import Upload from '../../compoent/Upload';
import {
    BUConfigNoFrostHighSearch,
    MaterialConfig,
    MaterialGroupConfig,
    ShareDistributionProps,
    ShareStatusProps,
    CorporationListConfig,
    StrategicPurchaseConfig,
} from '../../commonProps';
const { authAction } = utils;
const { Search } = Input;
const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString();

export default function () {
    const tableRef = useRef(null);
    const headerRef = useRef(null);
    const [data, setData] = useState({
        quickSearchValue: '',
        epTechnicalShareDemandSearchBo: {},
        selectedRowKeys: [],
        selectedRows: [],
    });
    // 高级查询配置
    const formItems = [
        { title: '物料代码', key: 'materialCode', type: 'list', props: MaterialConfig },
        { title: '物料组', key: 'materialGroupCode', type: 'list', props: MaterialGroupConfig },
        { title: '战略采购', key: 'strategicPurchaseCode', type: 'list', props: StrategicPurchaseConfig },
        { title: '业务单元', key: 'buCode', type: 'list', props: BUConfigNoFrostHighSearch },
        { title: '申请人', key: 'applyPeopleName', props: { placeholder: '输入申请人查询' } },
        { title: '分配供应商状态', key: 'allotSupplierState', type: 'list', props: ShareDistributionProps },
        { title: '状态', key: 'state', type: 'list', props: ShareStatusProps },
        { title: '文件类别', key: 'fileCategoryName', type: 'list', props: CorporationListConfig },
    ];

    const columns = [
        { title: '状态', dataIndex: 'state', width: 80 },
        { title: '分配供应商状态', dataIndex: 'allotSupplierState', width: 160 },
        { title: '来源', dataIndex: 'source', width: 70 },
        { title: '分享需求号', dataIndex: 'shareDemanNumber', ellipsis: true, width: 180 },
        { title: '分享需求行号', dataIndex: 'technicalLineNumber', ellipsis: true, width: 120 },
        { title: '物料代码', dataIndex: 'materialCode', ellipsis: true, render: (text, item) => item.source === 'SRM' ? text : '' },
        { title: '物料描述', dataIndex: 'materialName', ellipsis: true },
        { title: '物料组代码', dataIndex: 'materialGroupCode', ellipsis: true },
        { title: '物料组描述', dataIndex: 'materialGroupName', ellipsis: true },
        { title: '战略采购代码', dataIndex: 'strategicPurchaseCode', ellipsis: true },
        { title: '战略采购名称', dataIndex: 'strategicPurchaseName', ellipsis: true },
        { title: '业务单元代码', dataIndex: 'buCode', ellipsis: true },
        { title: '业务单元名称', dataIndex: 'buName', ellipsis: true },
        { title: '申请人', dataIndex: 'applyPeopleName', ellipsis: true },
        { title: '申请人联系方式', dataIndex: 'applyPeoplePhone', ellipsis: true },
        { title: '申请日期', dataIndex: 'applyDate', ellipsis: true, width: 160 },
        { title: '文件类别', dataIndex: 'fileCategoryName', width: 140 },
        { title: '文件版本', dataIndex: 'fileVersion', width: 140, ellipsis: true, },
        { title: '图纸状态', dataIndex: 'drawFlag', ellipsis: true, width: 140 },
        { title: '技术资料附件', dataIndex: 'technicalDataFileIdList', width: 140, ellipsis: true, render: (v) => <Upload type='show' entityId={v}>查看</Upload> },
        { title: '样品需求数量', dataIndex: 'sampleRequirementNum', ellipsis: true, width: 140 },
        { title: '计量单位', dataIndex: 'measureUnit', ellipsis: true, width: 140 },
        { title: '样品需求日期', dataIndex: 'sampleRequirementDate', width: 140, ellipsis: true, },
        { title: '样品收件人姓名', dataIndex: 'sampleReceiverName', ellipsis: true, width: 140 },
        { title: '样品收件人联系方式', dataIndex: 'sampleReceiverTel', ellipsis: true, width: 140 },
        { title: '备注', dataIndex: 'remark', ellipsis: true, width: 140 },
    ].map(item => ({ ...item, align: 'center' }));

    // 导出
    const explainResponse = res => {
        let arr = [];
        res.data.rows.map(item => {
            arr.push({
                '状态': item.state,
                '分配供应商状态': item.allotSupplierState,
                '来源': item.source,
                '分享需求号': item.shareDemanNumber,
                '分享需求行号': item.technicalLineNumber,
                '物料代码': item.materialCode,
                '物料描述': item.materialName,
                '物料组代码': item.materialGroupCode,
                '物料组描述': item.materialGroupName,
                '战略采购代码': item.strategicPurchaseCode,
                '战略采购名称': item.strategicPurchaseName,
                '业务单元代码': item.buCode,
                '业务单元名称': item.buName,
                '申请人': item.applyPeopleName,
                '申请人联系方式': item.applyPersonPhone,
                '申请日期': item.applyDate,
                '文件类别': item.fileCategoryName,
                '文件版本': item.fileVersion,
                '图纸状态': item.drawFlag,
                '样品需求数量': item.sampleRequirementNum,
                '计量单位': item.measureUnit,
                '样品需求日期': item.sampleRequirementDate,
                '样品收件人姓名': item.sampleReceiverName,
                '样品收件人联系方式': item.sampleReceiverTel,
                '备注': item.remark,
            });
        });
        if (res.success) {
            return arr;
        }
        return [];
    };
    // 获取导出的数据
    const requestParams = {
        url: `${recommendUrl}/api/epTechnicalShareDemandService/findTechnicalDataShareDetail`,
        data: {
            quickSearchValue: data.quickSearchValue,
            ...data.epTechnicalShareDemandSearchBo,
            pageInfo: { page: 1, rows: 100000 }
        },
        method: 'POST',
    };

    const headerLeft = <>
        {
            authAction(<DataExport.Button
                requestParams={requestParams}
                explainResponse={explainResponse}
                filenameFormat={'技术资料分享明细' + moment().format('YYYYMMDD')}
                key='TECHNICAL_DATA_SHARINGDETAIL_EXPORT'
                ignore={DEVELOPER_ENV}
            >导出</DataExport.Button>)
        }
    </>;
    const headerRight = <div style={{ display: 'flex', alignItems: 'center' }}>
        <Search
            placeholder='请输入物料、物料组或分享需求号查询'
            style={{ marginRight: '10px' }}
            onSearch={(v) => { handleQuickSearch(v) }}
            allowClear
        />
    </div>;
    // 快捷查询
    const handleQuickSearch = (value) => {
        setData(v => ({ ...v, quickSearchValue: value }));
        tableRef.current.manualSelectedRows();
        tableRef.current.remoteDataRefresh();
    };
    // 高级查询搜索
    const handleAdvancedSearch = (value) => {
        console.log(value)
        value.materialCode = value.materialCode_name;
        value.materialGroupCode = value.materialGroupCode_name;
        value.strategicPurchaseCode = value.strategicPurchaseCode_name;
        value.buCode = value.buCode_name;
        value.state = value.state_name;
        value.allotSupplierState = value.allotSupplierState_name;
        value.fileCategoryName = value.fileCategoryName_name
        delete value.materialCode_name;
        delete value.materialGroupCode_name;
        delete value.strategicPurchaseCode_name;
        delete value.buCode_name;
        delete value.state_name;
        delete value.allotSupplierState_name;
        delete value.fileCategoryName_name;
        setData(v => ({ ...v, epTechnicalShareDemandSearchBo: value }));
        headerRef.current.hide();
        tableRef.current.manualSelectedRows();
        tableRef.current.remoteDataRefresh();
    };
    return <>
        <Header
            left={headerLeft}
            right={headerRight}
            ref={headerRef}
            content={
                <AdvancedForm formItems={formItems} onOk={handleAdvancedSearch} />
            }
            advanced
        />
        <AutoSizeLayout>
            {
                (h) => <ExtTable
                    rowKey={(v) => (v.id + v.technicalLineNumber)}
                    height={h}
                    columns={columns}
                    store={{
                        params: {
                            quickSearchValue: data.quickSearchValue,
                            ...data.epTechnicalShareDemandSearchBo,
                        },
                        url: `${recommendUrl}/api/epTechnicalShareDemandService/findTechnicalDataShareDetail`,
                        type: 'POST',
                    }}
                    remotePaging={true}
                    checkbox={{
                        multiSelect: true,
                    }}
                    allowCancelSelect={true}
                    ref={tableRef}
                    showSearch={false}
                />
            }
        </AutoSizeLayout>
    </>
}