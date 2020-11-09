import React, { useState, useRef, useEffect } from 'react';
import { ExtTable, WorkFlow, ExtModal, utils, ComboList } from 'suid';
import { Input, Button, message, Modal, Checkbox } from 'antd';
import { openNewTab, getFrameElement, isEmpty } from '@/utils';
import { StartFlow } from 'seid';
import { AutoSizeLayout, Header, AdvancedForm } from '@/components';
import styles from './index.less';
import { smBaseUrl } from '@/utils/commonUrl';
import { PCNMasterdatalist} from "../commonProps"
import { deleteBatchById,PCNSupplierSubmit} from '../../../services/pcnModifyService'
import {SupplierBilltypeList} from '../commonProps'
const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString()
const { Search } = Input
const confirm = Modal.confirm;
const { authAction, storage } = utils;
const { FlowHistoryButton } = WorkFlow;
function SupplierConfigure() {
    const getModelRef = useRef(null)
    const tableRef = useRef(null)
    const headerRef = useRef(null)
    const authorizations = storage.sessionStorage.get("Authorization");
    const currentUserId = authorizations?.userId;
    const [selectedRowKeys, setRowKeys] = useState([]);
    const [selectedRows, setRows] = useState([]);
    const [searchValue, setSearchValue] = useState({});
    // const [loading, triggerLoading] = useState(true);
    const [attachId, setAttachId] = useState('');
    const [seniorSearchvalue, setSeniorsearchvalue] = useState('');
    /** 按钮可用性判断变量集合 BEGIN*/
    const [signleRow = {}] = selectedRows;
    const { smDocunmentStatus: signleFlowStatus, id: flowId, creatorId } = signleRow;
    // 草稿
    const underWay = signleFlowStatus === 0;
    // 已提交
    const completed = signleFlowStatus === 1;
    // 未选中数据的状态
    const empty = selectedRowKeys.length === 0;
    // 是不是自己的单据
    const isSelf = currentUserId === creatorId;
    // 删除草稿
    const isdelete = signleFlowStatus === 'INIT'

    useEffect(() => {
        window.parent.frames.addEventListener('message', listenerParentClose, false);
        return () => window.parent.frames.removeEventListener('message', listenerParentClose, false);
    }, []);
    const columns = [
        {
            title: '单据状态',
            dataIndex: 'smDocunmentStatus',
            key: 'smDocunmentStatus',
            width: 100,
            render: function (text, record, row) {
                if (text === 0) {
                    return <div>草稿</div>;
                } else if (text === 1){
                    return <div className="successColor">已提交</div>;
                } else if (text === 2) {
                    return <div className="successColor">已完成</div>;
                }
            },
        },
        {
            title: 'PCN变更单号',
            width: 200,
            dataIndex: 'smPcnCode',
        },
        {
            title: '供应商代码',
            width: 140,
            dataIndex: 'smSupplierCode',
        },
        {
            title: '供应商名称',
            width: 220,
            dataIndex: 'smSupplierName',
        },
        {
            title: '变更类型',
            width: 180,
            dataIndex: 'smPcnChangeTypeName',
        },
        {
            title: '联系人',
            width: 220,
            dataIndex: 'smContacts',
        },
        {
            title: '联系电话',
            width: 220,
            dataIndex: 'smContactNumber',
        },
        {
            title: '创建日期',
            width: 180,
            dataIndex: 'createdDate',
        }
    ].map(_ => ({ ..._, align: 'center' }))

    const dataSource = {
        store: {
            url: `${smBaseUrl}/api/smPcnTitleService/findBySupplierPage`,
            params: {
                ...searchValue,
                quickSearchProperties: ['smPcnCode'],
                sortOrders: [
                    {
                        property: 'createdDate',
                        direction: 'DESC'
                    }
                ],
                filters:seniorSearchvalue
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
            fieldName:'smDocunmentStatus',
            value: val.code,
            operator:'EQ'
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
        openNewTab(`pcnModify/Supplier/create/index`, 'PCN变更新建变更单', false)
    }
    // 编辑
    function handleCheckEdit() {
        // const [key] = selectedRowKeys;
        let id = selectedRows[0].id;
        openNewTab(`pcnModify/Supplier/Edit/index?id=${id}`, 'PCN变更编辑变更单', false)
    }
    // 删除
    async function handleDelete() {
        confirm({
            title: '是否确认删除',
            onOk: async () => {
                let params = selectedRows[0].id;
                const { success, message: msg } = await deleteBatchById({pcnTitleId:params});
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
        openNewTab(`pcnModify/Supplier/Detail/index?id=${id}&alone=true`, 'PCN变更单明细', false)
    }
    // 提交
    async function handleSubmit() {
        let status = selectedRows[0].smDocunmentStatus;
        let id = selectedRows[0].id;
        let statustype = false;
        if (status === 0) {
            status = 1
            statustype = true
        }else {
            status = 0
            statustype = false
        }
        const { success, message: msg } = await PCNSupplierSubmit({pcnTitleId:id,smDocunmentStatus:status});
        if (success) {
            message.success(`${statustype ? '提交' : '撤回'}成功！`);
            uploadTable();
        } else {
            message.error(msg);
        }
    }
    // 快速查询
    function handleQuickSerach(value) {
        setSearchValue(v => ({ ...v, quickSearchValue: value }));
        uploadTable();
    }
    // 处理高级搜索
    function handleAdvnacedSearch(value) {
        value.smDocunmentStatus = value.materialGroupCode;
        value.smPcnChangeTypeCode = value.applyPersonName;
        value.smSupplierCode = value.materialCode;
        value.smSupplierName = value.materialName;
        delete value.applyPersonName;
        delete value.applyPersonName_name;
        delete value.materialCode;
        delete value.materialGroupCode;
        delete value.materialGroupCode_name;
        let searchvalue = [];
        searchvalue.push(value);
        let newdata = [];
        searchvalue.map(item => {
            newdata.push(
                {
                    fieldName:'smSupplierCode',
                    value: item.smSupplierCode,
                    operator:'EQ'
                },
                {
                    fieldName:'smSupplierName',
                    value: item.smSupplierName,
                    operator:'EQ'
                },
                {
                    fieldName:'smDocunmentStatus',
                    value: item.smDocunmentStatus,
                    operator:'EQ'
                },
                {
                    fieldName:'smPcnChangeTypeCode',
                    value: item.smPcnChangeTypeCode,
                    operator:'EQ'
                }
    
            )
        })
        setSeniorsearchvalue(newdata)
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
                        key='SRM-SM-PCNSUPPLIER-ADD' 
                        className={styles.btn} 
                        onClick={AddModel}
                        //disabled={empty}
                        >新增
                    </Button>
                )
            }
            {
                authAction(
                    <Button
                        ignore={DEVELOPER_ENV}
                        key='SRM-SM-PCNSUPPLIER-EDIT'
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
                        key='SRM-SM-PCNSUPPLIER-DELETE' 
                        className={styles.btn} 
                        onClick={handleDelete} 
                        disabled={empty || !underWay || !isSelf}
                        >删除
                    </Button>
                )
            }
            {
                authAction(
                    <Button
                        ignore={DEVELOPER_ENV}
                        key='SRM-SM-PCNSUPPLIER-DETAIL'
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
                        key='SRM-SM-PCNSUPPLIER-SUBMIT'
                        className={styles.btn}
                        onClick={handleSubmit}
                        disabled={empty || !underWay || !isSelf}
                    >提交
                    </Button>
                )
            }
            {
                authAction(
                    <Button
                        ignore={DEVELOPER_ENV}
                        key='SRM-SM-PCNSUPPLIER-WITHDRAW'
                        className={styles.btn}
                        onClick={handleSubmit}
                        disabled={empty || !completed || !isSelf}
                    >撤回
                    </Button>
                )
            }
        </div>
    ) 
    const searchbank = ['name'];
    // 右侧搜索
    const HeaderRightButtons = (
        <div style={{ display: 'flex'}}>
            <ComboList
                style={{width:'240px' }}
                searchProperties={searchbank}
                {...SupplierBilltypeList}
                afterSelect={cooperationChange}
                rowKey="code"
                showSearch={false}
                allowClear={true}
                afterClear={clearinput}
                reader={{
                    name: 'name',
                }}
                className={styles.btn}
            />
            <Search
                placeholder='请输入变更单号'
                className={styles.btn}
                onSearch={handleQuickSerach}
                allowClear
                style={{ width: '240px'}}
            />
        </div>
    )
    // 高级查询配置
    const formItems = [
        { title: '供应商代码', key: 'materialCode',  props: { placeholder: '输入供应商代码' } },
        { title: '供应商名称', key: 'materialName',  props: { placeholder: '输入供应商名称' } },
        { title: '单据状态', key: 'materialGroupCode', type: 'list', props: SupplierBilltypeList },
        { title: '变更类型', key: 'applyPersonName', type: 'list', props: PCNMasterdatalist },
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

export default SupplierConfigure
