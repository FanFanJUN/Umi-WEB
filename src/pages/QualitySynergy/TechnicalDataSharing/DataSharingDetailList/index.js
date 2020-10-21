import React, { useRef, useState } from 'react';
import { ExtTable, utils } from 'suid';
import { Button, Checkbox, Input, message, Modal } from 'antd';
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
        { title: '文件类别', key: 'fileCategoryCode', type: 'list', props: CorporationListConfig },
    ];

    const columns = [
        { title: '状态', dataIndex: 'state', width: 80 },
        { title: '分配供应商状态', dataIndex: 'allotSupplierState', width: 160 },
        { title: '来源', dataIndex: 'source', width: 70 },
        { title: '分享需求号', dataIndex: 'shareDemanNumber', ellipsis: true, width: 180 },
        { title: '分享需求行号', dataIndex: 'shareDemanLineNumber', ellipsis: true, width: 180 },
        { title: '物料代码', dataIndex: 'materialCode', ellipsis: true },
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
        { title: '图纸状态', dataIndex: 'drawFlag', ellipsis: true, width: 140},
        { title: '技术资料附件', dataIndex: 'technicalDataFileIdList', width: 140, ellipsis: true,render: (v) => <Upload type='show' entityId={v}>查看</Upload> },
        { title: '样品需求数量', dataIndex: 'sampleRequirementNum', ellipsis: true, width: 140},
        { title: '计量单位', dataIndex: 'measureUnit', ellipsis: true, width: 140},
        { title: '样品需求日期', dataIndex: 'sampleRequirementDate', width: 140, ellipsis: true,},
        { title: '样品收件人姓名', dataIndex: 'sampleReceiverName', ellipsis: true, width: 140},
        { title: '样品收件人联系方式', dataIndex: 'sampleReceiverTel', ellipsis: true, width: 140},
        { title: '备注', dataIndex: 'remark', ellipsis: true, width: 140},
    ].map(item => ({ ...item, align: 'center' }));
    const headerLeft = <>
        {
            authAction(<Button
                type='primary'
                onClick={() => { console.log('导出') }}
                ignore={DEVELOPER_ENV}
                key='TECHNICAL_DATA_SHARING_ADD'
            >导出</Button>)
        }
    </>;
    const headerRight = <div style={{ display: 'flex', alignItems: 'center' }}>
        <Search
            placeholder='请输入物料、物料组或分享需求号查询'
            style={{marginLeft: '10px'}}
            onSearch={handleQuickSearch}
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
        setData(v => ({ ...v, epTechnicalShareDemandSearchBo: value }));
        tableRef.current.manualSelectedRows();
        tableRef.current.remoteDataRefresh();
    };
    return <>
        <Header
            left={headerLeft}
            right={headerRight}
            content={
                <AdvancedForm formItems={formItems} onOk={handleAdvancedSearch} />
            }
            advanced
        />
        <AutoSizeLayout>
            {
                (h) => <ExtTable
                    rowKey={(v) => v.id}
                    height={h}
                    columns={columns}
                    store={{
                        params: {
                            quickSearchValue: data.quickSearchValue,
                            ...data.epTechnicalShareDemandSearchBo,
                        },
                        url: `${recommendUrl}/api/epTechnicalShareDemandService/findByPage`,
                        type: 'POST',
                    }}
                    remotePaging={true}
                    checkbox={false}
                    ref={tableRef}
                    showSearch={false}
                />
            }
        </AutoSizeLayout>
    </>
}