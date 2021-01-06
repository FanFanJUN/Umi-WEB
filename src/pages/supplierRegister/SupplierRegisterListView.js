import React, { useState, useRef, useEffect } from 'react';
import { ExtTable, WorkFlow, ExtModal, utils, ComboList, ScrollBar } from 'suid';
import { Input, Button, message, Modal, Form } from 'antd';
import { openNewTab, getFrameElement } from '@/utils';
import { AutoSizeLayout, Header } from '@/components';
import styles from './index.less';
import { smBaseUrl } from '@/utils/commonUrl';
import { RecommendationList, stopApproveingOrder } from "@/services/supplierRegister"
import { oddcorporationSupplierConfig, corporationSupplierConfig } from '../../utils/commonProps'
const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString()
const { Search } = Input
const { authAction, storage } = utils;
const { FlowHistoryButton } = WorkFlow;
function SupplierConfigure() {
    const headerRef = useRef(null)
    const tableRef = useRef(null)
    const authorizations = storage.sessionStorage.get("Authorization");
    const currentUserId = authorizations?.userId;
    const [selectedRowKeys, setRowKeys] = useState([]);
    const [onlyMe, setOnlyMe] = useState(true);
    const [selectedRows, setRows] = useState([]);
    const [searchValue, setSearchValue] = useState({});
    const [visible, setVisible] = useState(false);
    const [recommen, setrecommen] = useState([]);
    const [loading, triggerLoading] = useState(false);
    const [attachId, setAttachId] = useState('');
    const [fixedHeader, setfixedHeader] = useState('');
    //const [dataSource, setData] = useState([]);
    const [singleRow = {}] = selectedRows;
    /** 按钮可用性判断变量集合 BEGIN*/
    const [signleRow = {}] = selectedRows;
    const { flowStatus: signleFlowStatus, id: flowId, creatorId, saveStatus: typeStatus } = signleRow;
    // 已提交审核状态
    const underWay = signleFlowStatus !== 'INIT';
    // 审核完成状态
    const completed = signleFlowStatus === 'COMPLETED';
    // 未选中数据的状态
    const empty = selectedRowKeys.length === 0;
    // 是不是自己的单据
    const isSelf = currentUserId === creatorId;
    // 提交审核
    const Toexamine = signleFlowStatus === 'INIT' && typeStatus === 1;
    const {
        state: rowState,
        approvalState: rowApprovalState,
        changeable: rowChangeable,
        flowId: businessId
    } = singleRow;

    const columns = [
        {
            title: '申请单号',
            dataIndex: 'docNumber',
            width: 120,
        },
        {
            title: '审批状态',
            dataIndex: 'flowStatus',
            width: 100,
            render: function (text, record, row) {
                if (text === 'INIT' && record.saveStatus === 0) {
                    return <div>草稿</div>;
                } else if (text === 'INIT' && record.saveStatus === 1) {
                    return <div>待提交审批</div>;
                } else if (text === 'INPROCESS') {
                    return <div>审批中</div>;
                } else if (text === 'COMPLETED') {
                    return <div>审批完成</div>;
                }
            },
        },
        {
            title: '供应商代码',
            dataIndex: 'supplier.code',
            width: 120,
        },
        {
            title: '供应商名称',
            dataIndex: 'supplier.name',
            width: 220,
        },
        {
            title: '账号',
            dataIndex: 'account',
            width: 160,
        },
        {
            title: '联系电话',
            dataIndex: 'mobile',
            width: 120,
        },
        {
            title: '申请人',
            dataIndex: 'creatorName',
            width: 180,
        },
        {
            title: '创建时间',
            dataIndex: 'createdDate',
            align: 'center',
            width: 150,
            // render:(text)=>{
            //     return text?text.substring(0,10):""
            // }
        },
        {
            title: '供应商分类',
            width: 200,
            dataIndex: 'supplier.supplierTypeRemark',
            render: (text, record, index) => {
                if (record.supplier) {
                    return <div>{record.supplier.supplierCategory.name} {record.supplier.supplierCategory.code}</div>;
                } else {
                    return <div></div>;
                }
                console.log(record.supplier.supplierCategory.code)

            },
        },
        {
            title: '推荐信息',
            width: 100,
            align: 'center',
            dataIndex: 'supplier.hasBeRecommend',
            render: (text, record, index) => {
                return <a onClick={() => showRecommend(record.supplierId)}>查看</a>;
            },
        },
        // {
        //     title: '供应商状态',
        //     width: 100,
        //     dataIndex: 'supplier.supplierStatusRemark',
        // },
    ].map(_ => ({ ..._, align: 'center' }))
    /**推荐信息弹窗表格 */
    const tableProps = {
        fixedHeader,
        columns: [
            {
                title: '推荐单号',
                dataIndex: 'code',
                width: 180,
                align: 'center',
            },
            {
                title: '准入公司',
                dataIndex: 'corporation.name',
                width: 260,
                align: 'center',
                align: 'center',
            },
            {
                title: '物料分类',
                dataIndex: 'materielCategory',
                width: 240,
                align: 'center',
            },
            {
                title: '推荐人',
                dataIndex: 'creatorName',
                width: 120,
                align: 'center',
            },
            {
                title: '推荐状态',
                dataIndex: 'flowStatus',
                width: 140,
                align: 'center',
                render: function (text, record, row) {
                    if (text === 'init') {
                        return <div>未提交审批</div>;
                    } else if (text === 'inProcess') {
                        return <div className="doingColor">审批中</div>;
                    } else {
                        return <div className="successColor">审批完成</div>;
                    }
                },
            },
        ]
    }
    /* 按钮禁用状态控制 */
    const FRAMEELEMENT = getFrameElement();
    //const empty = selectedRowKeys.length === 0;
    //const dataSource = []
    const dataSource = {
        store: {
            url: `${smBaseUrl}/api/supplierSelfService/findVoListByPage`,
            params: {
                ...searchValue,
                quickSearchProperties: ['companyName', 'supplierName'],
                sortOrders: [
                    {
                        property: 'createdDate',
                        direction: 'DESC'
                    }
                ]
            },
            type: 'POST'
        }
    }
    // 泛虹公司
    function cooperationChange(record) {
        // console.log(record)
        // setSearchValue({
        //     quickSearchValue: record.name
        // })
        // uploadTable();
        //let search = "";
        setSearchValue(record.name);
        //setSearchValue(searchValue)
        uploadTable();
    }
    // 清空泛虹公司
    function clearinput() {
        setSearchValue('')
        uploadTable();
    }

    useEffect(() => {
        window.parent.frames.addEventListener('message', listenerParentClose, false);
        return () => window.parent.frames.removeEventListener('message', listenerParentClose, false)
    }, []);

    function listenerParentClose(event) {
        const { data = {} } = event;
        if (data.tabAction === 'close') {
            tableRef.current.remoteDataRefresh()
        }
    }
    // 取消编辑或新增
    function handleCancel() {
        // const { resetFields } = commonFormRef.current.form;
        // resetFields()
        hideModal()
    }
    // 关闭弹窗
    function hideModal() {
        setVisible(false)
    }
    // 推荐信息
    async function showRecommend(supplierId) {
        setrecommen([])
        setVisible(true)
        triggerLoading(true)
        const { data, success, message: msg } = await RecommendationList({ supplierId });
        if (success) {
            triggerLoading(false)
            setrecommen(data)
            triggerLoading(false)
            return;
        }
        triggerLoading(false)
        message.error(msg)

    }
    // 记录列表选中
    function handleSelectedRows(rowKeys, rows) {
        setRowKeys(rowKeys);
        setRows(rows);
    }
    // 清除选中项
    function cleanSelectedRecord() {
        setRowKeys([])
    }

    function uploadTable() {
        cleanSelectedRecord()
        tableRef.current.remoteDataRefresh()
    }
    // 编辑
    function handleEditor() {
        // const [key] = selectedRowKeys;
        // const { id = '' } = FRAMEELEMENT;
        // const { pathname } = window.location
        let categoryid = selectedRows[0].supplier.supplierCategoryId;
        let id = selectedRows[0].supplierId;
        openNewTab(`supplier/supplierRegister/SupplierEdit/index?id=${id}&frameElementId=${categoryid}`, '编辑供应商注册信息', false)
        //openNewTab(`supplier/supplierRegister/SupplierEdit/index?id=${key}&frameElementId=${id}&Opertype=2`, '编辑供应商注册信息', false)
    }
    // 明细
    function handleCheckDetail() {
        const [key] = selectedRowKeys;
        let categoryid = selectedRows[0].supplier.supplierCategoryId;
        let id = selectedRows[0].supplierId;
        openNewTab(`supplier/supplierRegister/SupplierDetail/index?id=${id}&frameElementId=${categoryid}`, '供应商注册信息明细', false)
    }
    // 冻结
    function handleChange() {

    }
    // 输入框值
    function SerachValue(v) {
        setSearchValue(v.target.value)
        if (v.target.value === '') {
            setSearchValue('')
            uploadTable();
        }
    }
    // 查询
    function handleQuickSerach(value) {
        setSearchValue(v => ({ ...v, quickSearchValue: value.trim() }));
        uploadTable();
    }

    function uploadTable() {
        cleanSelectedRecord()
        tableRef.current.remoteDataRefresh()
    }
    // 提交审核完成更新列表
    function handleComplete() {
        uploadTable()
    }
    // 左侧
    const HeaderLeftButtons = (
        <div style={{ width: '50%', display: 'flex', height: '100%', alignItems: 'center' }}>
            {
                authAction(
                    <Button
                        ignore={DEVELOPER_ENV}
                        key='SRM-SM-SUPPLIER-REGISTER-DETAIL'
                        className={styles.btn}
                        onClick={handleCheckDetail}
                        disabled={empty}
                    >明细
                                </Button>
                )
            }
            {
                authAction(
                    <FlowHistoryButton
                        businessId={flowId}
                        flowMapUrl='flow-web/design/showLook'
                        ignore={DEVELOPER_ENV}
                        key='SRM-SM-SUPPLIER-REGISTER-HISTORY'
                    >
                        <Button className={styles.btn} disabled={empty || !underWay}>审核历史</Button>
                    </FlowHistoryButton>
                )
            }
        </div>
    )
    const searchbank = ['name'];
    // 右侧搜索
    const HeaderRightButtons = (
        <div style={{ display: 'flex' }}>
            <ComboList
                style={{ width: '260px' }}
                searchProperties={searchbank}
                {...corporationSupplierConfig}
                afterSelect={cooperationChange}
                rowKey="code"
                //showSearch={false}
                allowClear={true}
                afterClear={clearinput}
                reader={{
                    name: 'name',
                }}
                className={styles.btn}
            />
            <Search
                placeholder='请输入供应商名称查询'
                className={styles.btn}
                onSearch={handleQuickSerach}
                allowClear
                style={{ width: '240px' }}
            />
        </div>
    )
    return (
        <>
            <Header
                left={HeaderLeftButtons}
                right={HeaderRightButtons}
                ref={headerRef}
            />
            <AutoSizeLayout>
                {
                    (height) => <ExtTable
                        columns={columns}
                        showSearch={false}
                        ref={tableRef}
                        rowKey={(item) => item.id}
                        checkbox={{
                            multiSelect: false
                        }}
                        allowCancelSelect
                        size='small'
                        height={height}
                        remotePaging={true}
                        ellipsis={false}
                        onSelectRow={handleSelectedRows}
                        selectedRowKeys={selectedRowKeys}
                        //dataSource={dataSource}
                        {...dataSource}
                    />
                }
            </AutoSizeLayout>
            <ExtModal
                destroyOnClose
                onCancel={handleCancel}
                visible={visible}
                centered
                width={880}
                footer={null}
                bodyStyle={{ height: 380, padding: 0 }}
                title="推荐信息"
            >
                <ScrollBar>
                    <ExtTable
                        //loading={true}
                        showSearch={false}
                        dataSource={recommen}
                        {...tableProps}
                    />
                </ScrollBar>

            </ExtModal>

        </>
    )
}

export default SupplierConfigure
