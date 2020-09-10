import React, { useState, useRef, useEffect } from 'react';
import { ExtTable, WorkFlow, ExtModal, utils, ToolBar,ScrollBar } from 'suid';
import { Input, Button, message, Modal } from 'antd';
import { openNewTab, getFrameElement } from '@/utils';
import { StartFlow } from 'seid';
import UploadFile from '../../components/Upload/index'
import Header from '@/components/Header';
//import AdvancedForm from '@/components/AdvancedForm';
import AutoSizeLayout from '@/components/AutoSizeLayout';
import styles from './index.less';
import { smBaseUrl } from '@/utils/commonUrl';
import { RecommendationList ,stopApproveingOrder} from "@/services/supplierRegister"
const DEVELOPER_ENV = process.env.NODE_ENV === 'development'
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
    const { flowStatus: signleFlowStatus, id: flowId, creatorId } = signleRow;
    // 已提交审核状态
    const underWay = signleFlowStatus !== 'INIT';
    // 审核完成状态
    const completed = signleFlowStatus === 'COMPLETED';
    // 未选中数据的状态
    const empty = selectedRowKeys.length === 0;
    // 是不是自己的单据
    const isSelf = currentUserId === creatorId;

    
    const {
        state: rowState,
        approvalState: rowApprovalState,
        changeable: rowChangeable,
        flowId: businessId
    } = singleRow;

    const columns = [
        {
            title: '审批状态',
            dataIndex: 'flowStatus',
            key: 'flowStatus',
            width: 100,
            render: function(text, record, row) {
                if (text === 'INIT') {
                    return <div>未提交审批</div>;
                } else if (text === 'INPROCESS') {
                    return <div className="doingColor">审批中</div>;
                } else {
                    return <div className="successColor">审批完成</div>;
                }
            },
        },
        {
            title: '申请单号',
            width: 200,
            dataIndex: 'code',
        },
        {
            title: '供应商代码',
            width: 140,
            dataIndex: 'supplierCode',
        },
        {
            title: '供应商名称',
            width: 220,
            dataIndex: 'supplierName',
        },
    
        {
            title: '变更人',
            width: 120,
            dataIndex: 'creatorName',
        }, {
            title: '变更原因',
            width: 220,
            dataIndex: 'modifyReason',
        }, {
            title: '附件',
            width: 80,
            dataIndex: 'id',
            render: (value) => <UploadFile type="show" entityId={value}/>,
        },
        {
            title: '变更日期',
            align: 'center',
            width: 150,
            dataIndex: 'createdDate',
            render: (text) => {
                return text ? text.substring(0, 10) : '';
            },
        },
        {
            title: '供应商类型',
            dataIndex: 'supplierTypeRemark',
        },
    ].map(_ => ({ ..._, align: 'center' }))
    /**供应商表格 */
    const supplierColumns = [
        {
            title: '审批状态',
            dataIndex: 'flowStatus',
            key: 'flowStatus',
            width: 100,
            render: function(text, record, row) {
                if (text === 'INIT') {
                    return <div>未提交审批</div>;
                } else if (text === 'INPROCESS') {
                    return <div className="doingColor">审批中</div>;
                } else {
                    return <div className="successColor">审批完成</div>;
                }
            },
        },
        {
            title: '申请单号',
            width: 200,
            dataIndex: 'code',
        },
    
        {
            title: '变更原因',
            width: 280,
            dataIndex: 'modifyReason',
        },
        {
            title: '附件',
            width: 100,
            dataIndex: 'id',
            render: (value) => <UploadFile type="show" entityId={value}/>,
        },
        {
            title: '创建人员',
            width: 120,
            dataIndex: 'creatorName',
        },
        {
            title: '变更日期',
            align: 'center',
            width: 150,
            dataIndex: 'createdDate',
            render: (text) => {
                return text ? text.substring(0, 10) : '';
            },
        },
    ].map(_ => ({ ..._, align: 'center' }))
    /* 按钮禁用状态控制 */
    const FRAMEELEMENT = getFrameElement();
    //const empty = selectedRowKeys.length === 0;
    //const dataSource = []
    const dataSource = {
        store: {
            url: `${smBaseUrl}/supplierModify/findRequestByPage`,
            params: {
                ...searchValue,
                quickSearchProperties: ['supplierCode', 'supplierName'],
                S_createdDate:'desc'
            },
            type: 'POST'
        }
    }
    // 右侧搜索
    const searchBtnCfg = (
        <>
            <Input
                placeholder='请输入供应商分类或名称查询'
                className={styles.btn}
                onChange={SerachValue}
                allowClear
            />
            <Button type='primary' onClick={handleQuickSerach}>查询</Button>
        </>
    )

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
        const { data, success, message: msg } = await RecommendationList({supplierId});
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
    }
    // 查询
    function handleQuickSerach() {
        setSearchValue({
            quickSearchValue: searchValue
        })
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
    // 终止审核
  function stopApprove() {
    Modal.confirm({
      title: '终止审批流程',
      content: '流程终止后无法恢复，是否继续？',
      onOk: handleStopApproveRecord,
      okText: '确定',
      cancelText: '取消'
    })
  }
  async function handleStopApproveRecord() {
    const [row] = selectedRows
    const { id: flowId } = row
    const { success, message: msg } = await stopApproveingOrder({
      businessId: flowId
    })
    if (success) {
      message.success(msg)
      uploadTable()
      return
    }
    message.error(msg)
  }
    return (
        <>
            <Header
                left={
                    <>
                        {
                            authAction(
                                <Button type='primary' 
                                    ignore={DEVELOPER_ENV} 
                                    key='' 
                                    className={styles.btn} 
                                    onClick={handleEditor}
                                    //disabled={empty}
                                    >新增
                                </Button>
                            )
                        }
                        {
                            authAction(
                                <Button 
                                    ignore={DEVELOPER_ENV} 
                                    key='' 
                                    className={styles.btn} 
                                    onClick={handleCheckDetail} 
                                    disabled={empty}
                                    >编辑
                                </Button>
                            )
                        }
                        {
                            authAction(
                                <Button 
                                    ignore={DEVELOPER_ENV} 
                                    key='' 
                                    className={styles.btn} 
                                    onClick={handleCheckDetail} 
                                    disabled={empty}
                                    >删除
                                </Button>
                            )
                        }
                        {
                            authAction(
                                <StartFlow
                                    className={styles.btn}
                                    ignore={DEVELOPER_ENV}
                                    // preStart={handleBeforeStartFlow}
                                    businessKey={flowId}
                                    callBack={handleComplete}
                                    disabled={empty || underWay || !isSelf}
                                    businessModelCode='com.ecmp.srm.sm.entity.SupplierApply'
                                    ignore={DEVELOPER_ENV}
                                    key='PURCHASE_VIEW_CHANGE_APPROVE'
                                ></StartFlow>
                            )
                        }
                        {
                            authAction(
                                <Button
                                    className={styles.btn}
                                    disabled={empty || !underWay || !isSelf}
                                    onClick={stopApprove}
                                    ignore={DEVELOPER_ENV}
                                    key='PURCHASE_VIEW_CHANGE_STOP_APPROVE'
                                >终止审核</Button>
                            )
                        }
                        {
                            authAction(
                                <FlowHistoryButton
                                    businessId={flowId}
                                    flowMapUrl='flow-web/design/showLook'
                                    ignore={DEVELOPER_ENV}
                                    key='PURCHASE_VIEW_CHANGE_APPROVE_HISTORY'
                                >
                                    <Button className={styles.btn} disabled={empty || !underWay}>审核历史</Button>
                                </FlowHistoryButton>
                            )
                        }
                        {
                            authAction(
                                <Button 
                                    ignore={DEVELOPER_ENV} 
                                    key='' 
                                    className={styles.btn} 
                                    onClick={handleCheckDetail} 
                                    disabled={empty}
                                    >变更明细
                                </Button>
                            )
                        }

                    </>
                }
                right={searchBtnCfg}
                advanced={false}
                extra={false}
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
        </>
    )
}

export default SupplierConfigure
