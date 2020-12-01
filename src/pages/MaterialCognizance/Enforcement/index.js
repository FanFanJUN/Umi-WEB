import React, { useState, useRef, useEffect } from 'react';
import { ExtTable, WorkFlow, ExtModal, utils, ComboList } from 'suid';
import { Input, Button, message, Modal, Checkbox } from 'antd';
import { openNewTab, getFrameElement, isEmpty } from '@/utils';
import { StartFlow } from 'seid';
import { AutoSizeLayout, Header, AdvancedForm } from '@/components';
import styles from './index.less';
import { recommendUrl } from '@/utils/commonUrl';
import classnames from 'classnames';
import {
    OrganizationList,
    Jurisdictionjurisdiction,
    Materieljurisdiction,
    MakerList,
    Earlywarninglist
} from '../commonProps'
const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString()
const { Search } = Input
const { authAction, storage } = utils;
const { FlowHistoryButton } = WorkFlow;
function MissionExecution() {
    const getModelRef = useRef(null)
    const tableRef = useRef(null)
    const headerRef = useRef(null)
    const authorizations = storage.sessionStorage.get("Authorization");
    const currentUserId = authorizations?.userId;
    const [selectedRowKeys, setRowKeys] = useState([]);
    const [selectedRows, setRows] = useState([]);
    const [searchValue, setSearchValue] = useState({});
    const [jurisdiction, setJurisdiction] = useState(1);
    const [onlyMe, setOnlyMe] = useState(true);
    const [early, setEarly] = useState('');
    const [seniorSearchvalue, setSeniorsearchvalue] = useState('');
    /** 按钮可用性判断变量集合 BEGIN*/
    const [signleRow = {}] = selectedRows;
    const { taskStatus: signleFlowStatus, id: flowId, creatorId } = signleRow;
    // 执行中
    const underWay = signleFlowStatus === 0;
    // 未选中数据的状态
    const empty = selectedRowKeys.length === 0;

    useEffect(() => {
        window.parent.frames.addEventListener('message', listenerParentClose, false);
        return () => window.parent.frames.removeEventListener('message', listenerParentClose, false);
    }, []);
    const columns = [
        {
            title: '预警',
            dataIndex: 'earlyWarning',
            key: 'earlyWarning',
            width: 100,
            render: function (text, record, row) {
                if (record.taskStatus === 0) {
                    return <div className={classnames({
                        [styles.circle]: true,
                        [styles.red]: (text === 1),
                        [styles.yellow]: (text === 0),
                    })} ></div>;
                }
            },
        },
        {
            title: '任务状态',
            dataIndex: 'taskStatus',
            key: 'taskStatus',
            width: 100,
            render: function (text, record, row) {
                if (text === 0) {
                    return <div>执行中</div>;
                } else if (text === 1) {
                    return <div>已执行</div>;
                } else if (text === 2) {
                    return <div>已提交</div>;
                } else {
                    return <div>已终止</div>;
                }
            },
        },
        {
            title: '是否通过',
            width: 100,
            dataIndex: 'passStatus',
            render: function (text, record, row) {
                if (text === 0) {
                    return <div>不通过</div>;
                } else if (text === 1) {
                    return <div className="successColor">通过</div>;
                } else {
                    return ''
                }
            },
        },
        {
            title: '认定计划号',
            width: 140,
            dataIndex: 'identificationPlanNo',
        },
        {
            title: '计划说明',
            width: 160,
            dataIndex: 'planDescription',
        },
        {
            title: '认定阶段',
            width: 160,
            dataIndex: 'identificationStageName',
        },
        {
            title: '认定任务',
            width: 160,
            dataIndex: 'identificationTaskName',
        },
        {
            title: '计划时间',
            width: 160,
            dataIndex: 'planTime',
        },
        {
            title: '公司名称',
            width: 220,
            dataIndex: 'companyName',
        },
        {
            title: '采购组织',
            width: 220,
            dataIndex: 'purchaseName',
        },
        {
            title: '供应商名称',
            width: 220,
            dataIndex: 'supplierName',
        },
        {
            title: '原厂',
            width: 220,
            dataIndex: 'originalFactoryName',
        },
        {
            title: '物料分类',
            width: 220,
            dataIndex: 'materielTypeName',
        },
        {
            title: '制定计划部门',
            width: 240,
            dataIndex: 'departmentName',
        },
        {
            title: '制定人',
            width: 220,
            dataIndex: 'drafterName',
        },
        {
            title: '执行人',
            width: 180,
            dataIndex: 'executorName',
        }
    ].map(_ => ({ ..._, align: 'center' }))

    const dataSource = {
        store: {
            url: `${recommendUrl}/api/samIdentifyPlanImplementationService/findBySearch?onlyMe=` + jurisdiction + '&early=' + early,
            params: {
                ...searchValue,
                quickSearchProperties: ['identificationPlanNo'],
                sortOrders: [
                    {
                        property: 'createdDate',
                        direction: 'DESC'
                    }
                ],
                filters: seniorSearchvalue
            },
            type: 'POST'
        }
    }


    function listenerParentClose(event) {
        const { data = {} } = event;
        if (data.tabAction === 'close') {
            uploadTable()
        }
    }
    function cooperationChange(val) {
        let search = []
        search.push({
            fieldName: 'smDocunmentStatus',
            value: val.code,
            operator: 'EQ'
        })
        setSeniorsearchvalue(search)
        uploadTable();
    }
    // 记录列表选中
    function handleSelectedRows(rowKeys, rows) {
        setRowKeys(rowKeys);
        setRows(rows);
    }
    // 清除选中项
    function uploadTable() {
        tableRef.current.manualSelectedRows([])
        tableRef.current.remoteDataRefresh()
    }
    // 新增
    function AddModel() {
        let id = selectedRows[0].id;
        openNewTab(`material/Enforcement/Edit/index?id=${id}`, '实物认定任务执行', false)
    }
    // 明细
    function handleCheckDetail() {
        let id = selectedRows[0].id;
        openNewTab(`material/Enforcement/Details/index?id=${id}&alone=true`, '实物认定任务执行明细', false)
    }
    // 快速查询
    function handleQuickSerach(value) {
        setSearchValue(v => ({ ...v, quickSearchValue: value }));
        uploadTable();
    }
    // 处理高级搜索
    function handleAdvnacedSearch(value) {
        setEarly(value.earlyWarning)
        value.departmentName = value.departmentName_name;
        value.drafterName = value.drafterName_name;
        value.executorName = value.executorName_name;
        value.materielTypeId = value.materielTypeId_name;
        value.companyName = value.companyName_name;
        value.supplierName = value.supplierName;
        delete value.earlyWarning_name;
        delete value.createDepartmentId_name;
        delete value.drafterName_name;
        delete value.executorName_name;
        delete value.materielTypeId_name;
        delete value.companyName_name;
        let searchvalue = [];
        searchvalue.push(value);
        let newdata = [];
        searchvalue.map(item => {
            newdata.push(
                {
                    fieldName: 'departmentName',
                    value: item.departmentName,
                    operator: 'EQ'
                },
                {
                    fieldName: 'drafterName',
                    value: item.drafterName,
                    operator: 'EQ'
                },
                {
                    fieldName: 'executorName',
                    value: item.executorName,
                    operator: 'EQ'
                },
                {
                    fieldName: 'materielTypeName',
                    value: item.materielTypeId,
                    operator: 'EQ'
                },
                {
                    fieldName: 'companyName',
                    value: item.companyName,
                    operator: 'EQ'
                },
                {
                    fieldName: 'supplierName',
                    value: item.supplierName,
                    operator: 'LK'
                }

            )
        })
        setSeniorsearchvalue(newdata)
        headerRef.current.hide();
        uploadTable();
    }
    // 仅我的
    function handleOnlyMeChange(e) {
        setOnlyMe(e.target.checked)
        e.target.checked === true ? setJurisdiction(1) : setJurisdiction(0)
        uploadTable();
    }
    // 左侧
    const HeaderLeftButtons = (
        <div style={{ width: '50%', display: 'flex', height: '100%', alignItems: 'center' }}>
            {
                authAction(
                    <Button
                        ignore={DEVELOPER_ENV}
                        key='SRM-SM-IMPLEMENT-SUPPLIER-TASK'
                        className={styles.btn}
                        onClick={AddModel}
                        disabled={empty || !underWay}
                    >执行任务
                    </Button>
                )
            }
            {
                authAction(
                    <Button
                        ignore={DEVELOPER_ENV}
                        key='SRM-SM-IMPLEMENT-SUPPLIER-DETAIL'
                        className={styles.btn}
                        onClick={handleCheckDetail}
                        disabled={empty}
                    >明细
                    </Button>
                )
            }
        </div>
    )
    const searchbank = ['name'];
    // 右侧搜索
    const HeaderRightButtons = (
        <div style={{ display: 'flex' }}>
            <Checkbox className={styles.btn} onChange={handleOnlyMeChange} checked={onlyMe}
                style={{ width: '80px' }}>仅我的</Checkbox>
            <Search
                placeholder='请输入认定计划号'
                className={styles.btn}
                onSearch={handleQuickSerach}
                allowClear
                style={{ width: '240px' }}
            />
        </div>
    )
    // 高级查询配置
    const formItems = [
        { title: '预警', key: 'earlyWarning', type: 'list', props: Earlywarninglist },
        { title: '制定计划部门', key: 'departmentName', type: 'tree', props: OrganizationList },
        { title: '制定人', key: 'drafterName', type: 'list', props: MakerList },
        { title: '执行人', key: 'executorName', type: 'list', props: MakerList },
        { title: '物料分类', key: 'materielTypeId', type: 'tree', props: Materieljurisdiction },
        { title: '公司名称', key: 'companyName', type: 'list', props: Jurisdictionjurisdiction },
        { title: '供应商名称', key: 'supplierName', props: { placeholder: '输入供应商名称' } },
    ];
    return (
        <>
            <Header
                left={HeaderLeftButtons}
                right={HeaderRightButtons}
                advanced
                ref={headerRef}
                content={
                    <AdvancedForm formItems={formItems} onOk={handleAdvnacedSearch} />
                }
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
        </>
    )
}

export default MissionExecution
