import React, { useState, useRef, useEffect } from 'react';
import { ExtTable, WorkFlow, ExtModal, utils, ComboList } from 'suid';
import { Input, Button, message, Modal, Checkbox } from 'antd';
import { openNewTab, getFrameElement, isEmpty } from '@/utils';
import { StartFlow } from 'seid';
import { AutoSizeLayout, Header, AdvancedForm } from '@/components';
import styles from './index.less';
import { recommendUrl } from '@/utils/commonUrl';
import RecommendModle from '../Cognizance/commons/recommendModle'
import InfluenceMaterielModal from '../Cognizance/commons/InfluenceMaterielModal'
import {
    MaterialObjectDelete,
    MaterialRelease,
    CognizanceRelease,
    ConfirmBilltype
} from '../../../services/MaterialService'
import {
    OrganizationList,
    JurisdictionjurisdictionCode,
    PlantypeList,
    Identificationresults,
    BilltypeList,
    MakerList,
    MaterieljurisdictionCode
} from '../commonProps'
const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString()
const { Search } = Input
const confirm = Modal.confirm;
const { authAction, storage } = utils;
const { FlowHistoryButton } = WorkFlow;
function SupplierConfigure() {
    const getModelRef = useRef(null)
    const tableRef = useRef(null)
    const headerRef = useRef(null)
    const getecommendRef = useRef(null)
    const authorizations = storage.sessionStorage.get("Authorization");
    const currentUserId = authorizations?.userId;
    const [selectedRowKeys, setRowKeys] = useState([]);
    const [selectedRows, setRows] = useState([]);
    const [searchValue, setSearchValue] = useState({});
    const [visible, setvisible] = useState(false);
    const [tasktype, setTasktype] = useState('');
    const [seniorSearchvalue, setSeniorsearchvalue] = useState('');
    /** 按钮可用性判断变量集合 BEGIN*/
    const [signleRow = {}] = selectedRows;
    const { planningStatus: signleFlowStatus, id: flowId, creatorId } = signleRow;
    // 草稿-取消发布
    const underWay = signleFlowStatus === 0 || signleFlowStatus === 2;
    // 删除草稿
    const iddraft = signleFlowStatus === 0
    // 已提交
    const completed = signleFlowStatus === 1;
    // 未选中数据的状态
    const empty = selectedRowKeys.length === 0;
    // 是不是自己的单据
    const isSelf = currentUserId === creatorId;
    // 认定结果
    const iscogn = signleFlowStatus === 1
    // 取消发布
    const iscancel = signleFlowStatus === 2
    useEffect(() => {
        window.parent.frames.addEventListener('message', listenerParentClose, false);
        return () => window.parent.frames.removeEventListener('message', listenerParentClose, false);
    }, [listenerParentClose]);
    const columns = [
        {
            title: '单据类型',
            dataIndex: 'documentType',
            key: 'documentType',
            width: 140,
            render: function (text, record, row) {
                if (text === 0) {
                    return <div>手工单</div>;
                } else {
                    return <div className="successColor">准入单</div>;
                }
            },
        },
        {
            title: '计划状态',
            dataIndex: 'planningStatus',
            key: 'planningStatus',
            width: 140,
            render: function (text, record, row) {
                if (text === 0) {
                    return <div>草稿</div>;
                } else if (text === 1) {
                    return <div className="successColor">已发布</div>;
                } else if (text === 2) {
                    return <div className="successColor">取消发布</div>;
                } else if (text === 3) {
                    return <div className="successColor">已终止</div>;
                } else {
                    return <div className="successColor">已完成</div>;
                }
            },
        },
        {
            title: '认定结果',
            width: 140,
            dataIndex: 'identificationStatus',
            render: function (text, record, row) {
                if (text === 0) {
                    return <div>不合格</div>;
                } else if (text === 1) {
                    return <div className="successColor">合格</div>;
                } else {
                    return <div></div>;
                }
            },
        },
        {
            title: '认定计划号',
            width: 140,
            dataIndex: 'planNo',
        },
        {
            title: '物料分类',
            width: 140,
            dataIndex: 'materielTypeName',
        },
        {
            title: '供应商代码',
            width: 140,
            dataIndex: 'supplierCode',
        },
        {
            title: '供应商名称',
            width: 200,
            dataIndex: 'supplierName',
        },
        {
            title: '原厂代码',
            width: 140,
            dataIndex: 'originalFactoryCode',
        },
        {
            title: '原厂名称',
            width: 180,
            dataIndex: 'originalFactoryName',
        },
        {
            title: '公司',
            width: 220,
            dataIndex: 'companyName',
        },
        {
            title: '采购组织',
            width: 180,
            dataIndex: 'purchaseName',
        },
        {
            title: '计划说明',
            width: 220,
            dataIndex: 'planDesc',
        },
        {
            title: '制定计划部门',
            width: 220,
            dataIndex: 'createDepartmentName',
        },
        {
            title: '制定人',
            width: 180,
            dataIndex: 'creatorName',
        },
        // {
        //     title: '联系电话',
        //     width: 220,
        //     dataIndex: 'phone',
        // },
        {
            title: '创建时间',
            width: 180,
            dataIndex: 'createdDate',
        }
    ].map(_ => ({ ..._, align: 'center' }))

    const dataSource = {
        store: {
            url: `${recommendUrl}/api/samSupplierIdentificationPlanService/findByPage`,
            params: {
                ...searchValue,
                quickSearchProperties: ['planNo', 'planDesc'],
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
    // 准入新增
    function AddModel() {
        getecommendRef.current.handleModalVisible(true);
    }
    // 准入选择
    function selectanalysis(record) {
        sessionStorage.removeItem('Admitdata');
        sessionStorage.setItem('Admitdata', JSON.stringify(record));
        openNewTab(`material/Cognizance/AdmitAdd/index?admitype=1`, '准入单认定计划新增', false)
    }
    function selectmanual(record) {
        sessionStorage.removeItem('Manualdata');
        sessionStorage.setItem('Manualdata', JSON.stringify(record));
        openNewTab(`material/Cognizance/ManualAdd/index?admitype=0`, '准入单认定计划新增', false)
    }
    // 手工新增
    function ManualEditAddModel() {
        getModelRef.current.handleModalVisible(true);
        //openNewTab(`material/Cognizance/ManualAdd/index?admitype=0`, '手工物料认定计划新增', false)
    }
    // 编辑
    function handleCheckEdit() {
        let id = selectedRows[0].id;
        let cancel = selectedRows[0].planningStatus;
        let admitype = selectedRows[0].documentType
        if (admitype === 0) {
            openNewTab(`material/Cognizance/ManualEdit/index?id=${id}&cancel=${cancel}&admitype=${admitype}`, '实物认定计划变更', false)
        } else {
            openNewTab(`material/Cognizance/AdmitEdit/index?id=${id}&cancel=${cancel}&admitype=${admitype}`, '实物认定计划变更', false)
        }

    }
    // 删除
    async function handleDelete() {
        confirm({
            title: '是否确认删除',
            onOk: async () => {
                let params = selectedRows[0].id;
                const { success, message: msg } = await MaterialObjectDelete({ planId: params });
                if (success) {
                    message.success('删除成功！');
                    uploadTable();
                } else {
                    message.error(msg);
                }
            },
            onCancel() {
            },
        });
    }
    // 明细
    function handleCheckDetail() {
        let id = selectedRows[0].id;
        let admitype = selectedRows[0].documentType
        openNewTab(`material/Cognizance/ManualDetail/index?id=${id}&alone=true&admitype=${admitype}`, '实物认定计划明细', false)
    }
    // 发布
    async function handleRelease() {
        let status = selectedRows[0].planningStatus;
        let id = selectedRows[0].id;
        let statustype = false;
        if (status === 0 || status === 2) {
            status = 1
            statustype = true
        } else {
            status = 0
            statustype = false
        }
        const { success, message: msg } = await MaterialRelease({ planId: id, planningStatus: status });
        if (success) {
            message.success(`${statustype ? '发布' : '取消'}成功！`);
            uploadTable();
        } else {
            message.error(msg);
        }
    }
    // 确认认定结果
    async function handleConfirm() {
        let id = selectedRows[0].id;
        const { success, data, message: msg } = await ConfirmBilltype({ planId: id });
        if (success) {
            if (data.executeStatus === 0) {
                setTasktype('认定不合格')
            }
            if (data.executeStatus === 1 && data.taskStatus === 0) {
                setTasktype('认定不合格')
            }
            if (data.executeStatus === 1 && data.taskStatus === 1) {
                setTasktype('认定合格')
            }
            setvisible(true)
        } else {
            message.error(msg);
        }
    }
    // 
    async function handleOk() {
        let id = selectedRows[0].id;
        const { success, message: msg } = await CognizanceRelease({ planId: id });
        if (success) {
            message.success(`确认认定结果成功！`);
            uploadTable();
        } else {
            message.error(msg);
        }
        setvisible(false)
    }
    // 关闭确认结果
    async function handleCancel() {
        setvisible(false)
    }
    // 快速查询
    function handleQuickSerach(value) {
        setSearchValue(v => ({ ...v, quickSearchValue: value.trim() }));
        uploadTable();
    }
    // 处理高级搜索
    function handleAdvnacedSearch(v) {
        const keys = Object.keys(v);
        const filters = keys.map((item) => {
            const [_, operator, fieldName, isName] = item.split('_');
            return {
                fieldName,
                operator,
                value: !!isName ? undefined : v[item]
            }
        }).filter(item => !!item.value)
        setSeniorsearchvalue(filters)
        headerRef.current.hide();
        uploadTable();
    }
    // 清空泛虹公司
    function clearinput() {
        setSearchValue('')
        setSeniorsearchvalue('')
        uploadTable();
    }
    // 左侧
    const HeaderLeftButtons = (
        <div style={{ width: '50%', display: 'flex', height: '100%', alignItems: 'center' }}>
            {
                authAction(
                    <Button type='primary'
                        ignore={DEVELOPER_ENV}
                        key='SRM-SM-LDENTPLAN-SUPPLIER-INTOADD'
                        className={styles.btn}
                        onClick={AddModel}
                    //disabled={empty}
                    >从准入单创建
                    </Button>
                )
            }
            {
                authAction(
                    <Button type='primary'
                        ignore={DEVELOPER_ENV}
                        key='SRM-SM-LDENTPLAN-SUPPLIER-MANADD'
                        className={styles.btn}
                        onClick={ManualEditAddModel}
                    //disabled={empty}
                    >手工创建
                    </Button>
                )
            }
            {
                authAction(
                    <Button
                        ignore={DEVELOPER_ENV}
                        key='SRM-SM-LDENTPLAN-SUPPLIER-EDIT'
                        className={styles.btn}
                        onClick={handleCheckEdit}
                        disabled={empty || !underWay || !isSelf}
                    >编辑
                    </Button>
                )
            }
            {
                authAction(
                    <Button
                        ignore={DEVELOPER_ENV}
                        key='SRM-SM-LDENTPLAN-SUPPLIER-DELETE'
                        className={styles.btn}
                        onClick={handleDelete}
                        disabled={empty || !iddraft || !isSelf}
                    >删除
                    </Button>
                )
            }
            {
                authAction(
                    <Button
                        ignore={DEVELOPER_ENV}
                        key='SRM-SM-LDENTPLAN-SUPPLIER-DETAIL'
                        className={styles.btn}
                        onClick={handleCheckDetail}
                        disabled={empty}
                    >明细
                    </Button>
                )
            }
            {
                authAction(
                    <Button
                        ignore={DEVELOPER_ENV}
                        key='SRM-SM-LDENTPLAN-SUPPLIER-RELEASE'
                        className={styles.btn}
                        onClick={handleRelease}
                        disabled={empty || !underWay || !isSelf}
                    >发布
                    </Button>
                )
            }
            {
                authAction(
                    <Button
                        ignore={DEVELOPER_ENV}
                        key='SRM-SM-LDENTPLAN-SUPPLIER-CANCEL'
                        className={styles.btn}
                        onClick={handleRelease}
                        disabled={empty || !completed || !isSelf}
                    >取消发布
                    </Button>
                )
            }
            {
                authAction(
                    <Button
                        ignore={DEVELOPER_ENV}
                        key='SRM-SM-LDENTPLAN-SUPPLIER-RESULT'
                        className={styles.btn}
                        onClick={handleConfirm}
                        disabled={empty || !isSelf || !iscogn}
                    >确认认定结果
                    </Button>
                )
            }
        </div>
    )
    const searchbank = ['name'];
    // 右侧搜索
    const HeaderRightButtons = (
        <div style={{ display: 'flex' }}>
            <Search
                placeholder='请输入认定计划号或计划说明'
                className={styles.btn}
                onSearch={handleQuickSerach}
                allowClear
                style={{ width: '240px' }}
            />
        </div>
    )
    // 高级查询配置
    const formItems = [
        { title: '制定计划部门', key: 'Q_EQ_createDepartmentId', type: 'tree', props: OrganizationList },
        { title: '制定人', key: 'Q_EQ_creatorId', type: 'list', props: MakerList },
        { title: '供应商名称', key: 'Q_LK_supplierName', props: { placeholder: '输入供应商名称' } },
        { title: '物料分类', key: 'Q_EQ_materielTypeCode', type: 'tree', props: MaterieljurisdictionCode },
        { title: '公司名称', key: 'Q_LK_companyCode', type: 'list', props: JurisdictionjurisdictionCode },
        { title: '单据类型', key: 'Q_EQ_documentType', type: 'list', props: BilltypeList },
        { title: '计划状态', key: 'Q_EQ_planningStatus', type: 'list', props: PlantypeList },
        { title: '认定结果', key: 'Q_EQ_identificationStatus', type: 'list', props: Identificationresults }
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
            <Modal
                title="提示"
                visible={visible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <p>
                    {`确认认定结果后，将结束实物认定计划和认定任务，自动生成认定结果为`}
                    <span style={{ color: 'red' }}>{tasktype}</span>{`且不可变更，是否继续？`}
                </p>
            </Modal>
            {/** 准入创建单*/}
            <RecommendModle
                modifyanalysis={selectanalysis}
                wrappedComponentRef={getecommendRef}
            />
            {/**手工物料 */}
            <InfluenceMaterielModal
                modifyanalysis={selectmanual}
                wrappedComponentRef={getModelRef}
            />
        </>
    )
}

export default SupplierConfigure
