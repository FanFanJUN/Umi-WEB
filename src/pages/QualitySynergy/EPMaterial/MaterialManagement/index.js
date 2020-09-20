import React, { useState, useRef, useEffect, Fragment } from 'react';
import { Input, Button, message, Modal, Form } from 'antd';
import styles from './index.less';
import { openNewTab, getFrameElement, getUserAccount } from '@/utils';
import { ExtTable, ComboList, ExtModal, utils, ToolBar, ScrollBar, DataExport } from 'suid';
import { AutoSizeLayout, Header, AdvancedForm } from '@/components';
import { recommendUrl } from '@/utils/commonUrl';
import {
    MaterialConfig, MaterialGroupConfig, StrategicPurchaseConfig,
    statusProps, distributionProps, materialStatus, PDMStatus, allPersonList,
} from '../../commonProps';
import CheckQualificationModal from '../components/checkQualificationModal';
import DistributeSupplierModal from '../components/distributeSupplierModal';
import CheckModal from '../components/checkModal';
import GenerateModal from '../components/generateModal';
import EditModal from '../components/editModal';
import SyncHistory from '../components/syncHistory';
import {
    epWhetherDelete,
    editEpDemand,
    epFrozen,
    epSubmit,
    epWithdraw,
    findOrgTreeWithoutFrozen,
    allotStrategicPurchase,
    syncPdm,
} from '../../../../services/qualitySynergy';

const { authAction, storage } = utils;
const { Search } = Input;
const { confirm } = Modal;
const { create, Item: FormItem } = Form;
const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString();
const formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 },
};
export default create()(function ({ form }) {
    const headerRef = useRef(null);
    const tableRef = useRef(null);
    const checkRef = useRef(null);
    const editRef = useRef(null);
    const supplierRef = useRef(null);
    const samplingRef = useRef(null);
    const generateRef = useRef(null);
    const historyRef = useRef(null);
    const [OrgId, setOrgId] = useState('');
    // 按钮禁用控制
    const [buttonStatus, setButtonStatus] = useState({
        edit: true,
        delete: true,
        frozen: true,
        maint: true,
        detail: true,
        submit: true,
        withdraw: true,
        distribute: true,
        assign: true,
        pdm: true,
        sync: true,
        check: true,
        generate: true,
    });
    const [selectedRowKeys, setRowKeys] = useState([]);
    const [selectedRows, setRows] = useState([]);
    const [searchValue, setSearchValue] = useState({});
    const [maintainModal, setMaintainModal] = useState(false);//维护环保人员弹框
    const [assignPurchase, setAssignPurchase] = useState(false);//指派战略采购弹框
    const [supplierVisible, setSupplierVisible] = useState(false);
    // 抽检复核与生成报表是同一个弹框
    const [checkModalType, setCheckModalType] = useState('');
    // 分配供应商与查看供应商是同一个弹框
    const [supplierModalType, setSupplierModalType] = useState('');
    const [viewDemandNum, setViewDemandNum] = useState('')
    const FRAMELEEMENT = getFrameElement();
    const { getFieldDecorator, setFieldsValue, validateFields } = form;
    useEffect(() => {
        findOrgTreeWithoutFrozen().then(res => {
            if (res.success) {
                setOrgId(res.data[0].id);
            }
        });
        // window.parent.frames.addEventListener('message', listenerParentClose, false);
        // return () => window.parent.frames.removeEventListener('message', listenerParentClose, false)
    }, []);
    // function listenerParentClose(event) {
    //     const { data = {} } = event;
    //     console.log('进入监听', data.tabAction)
    //     if (data.tabAction === 'close') {
    //         tableRef.current.remoteDataRefresh();
    //     }
    // }
    function redirectToPage(type) {
        const [key] = selectedRowKeys;
        const { id = '' } = FRAMELEEMENT;
        const { pathname } = window.location;
        switch (type) {
            case 'add':
                openNewTab(`qualitySynergy/EPMaterial/editForm?frameElementId=${id}&frameElementSrc=${pathname}`, '环保资料物料-新增', false);
                break;
            case 'detail':
                if (!checkOneSelect()) return;
                openNewTab(`qualitySynergy/EPMaterial/detailForm?id=${key}&frameElementId=${id}&frameElementSrc=${pathname}`, '环保资料物料-明细', false);
                break;
            default:
                break;
        }
    }

    // 选中一行
    function checkOneSelect() {
        if (selectedRows.length === 0) {
            message.warning('请先选择数据');
            return false;
        }
        return true;
    }

    // 删除
    function handleDelete(v) {
        if (selectedRows[0].effectiveStatus !== 'DRAFT' || selectedRows[0].sourceName !== 'SRM') {
            message.warning('只能删除来源为SRM且状态为草稿的环保资料物料！');
            return;
        }
        confirm({
            title: '删除',
            content: '请确认是否冻结该填报环保资料物料',
            onOk: async () => {
                const res = await epWhetherDelete({
                    ids: selectedRowKeys.join(),
                });
                if (res.statusCode === 200) {
                    refresh();
                    message.success('删除成功');
                } else {
                    message.error(res.message);
                }
            },
        });
    }

    // 冻结
    const handleFreeze = () => {
        confirm({
            title: '请确认是否冻结选中填报环保资料物料',
            onOk: async () => {
                const res = await epFrozen({
                    ids: selectedRowKeys.join(),
                    isFrozen: true,
                });
                if (res.statusCode === 200) {
                    refresh();
                    message.success('操作成功');
                } else {
                    message.error(res.message);
                }
            },
        });
    };
    // 获取导出的数据
    const requestParams = {
        url: `${recommendUrl}/api/epDemandService/findByPage`,
        data: {
            ...searchValue,
            quickSearchProperties: [],
        },
        method: 'POST',
    };
    const explainResponse = res => {
        let arr = [];
        res.data.rows.map(item => {
            arr.push({
                id: item.id,
                '状态': item.effectiveStatus === 'DRAFT' ? '草稿' : '生效',
                '分配供应商状态': item.allotSupplierState === 'ALLOT_END' ? '已分配' : '未分配',
                '物料标记状态': item.assignSupplierStatus === 'EXIST_CONFORM_SUPPLIER' ? '存在符合的供应商' : '不存在符合的供应商',
                '同步PDM状态': item.syncStatus === 'SYNC_FAILURE' ? '同步成功' : '同步失败',
                '冻结': item.frozen ? '已冻结' : '未冻结',
                '物料代码': item.materialCode,
                '物料描述': item.materialName,
                '物料组代码': item.materialGroupCode,
                '物料组描述': item.materialGroupName,
                '环保标准': item.environmentalProtectionName,
                '战略采购代码': item.strategicPurchaseCode,
                '战略采购名称': item.strategicPurchaseName,
                // '供应商': item.list,
                '环保管理人员': item.environmentAdminName,
                '创建人': item.applyPersonName,
                '创建人联系方式': item.applyPersonPhone,
                '申请日期': item.applyDate,
                '来源': item.sourceName,
            });
        });
        console.log(res, 'res');
        if (res.success) {
            return arr;
        }
        return [];
    };
    // 清空选中/刷新表格数据
    const refresh = () => {
        tableRef.current.manualSelectedRows();
        tableRef.current.remoteDataRefresh();
    };
    // 提交
    const submit = () => {
        confirm({
            title: '是否提交环保资料填报需求？',
            onOk: async () => {
                const res = await epSubmit({
                    ids: selectedRowKeys.join(),
                });
                if (res.statusCode === 200) {
                    refresh();
                    message.success('操作成功');
                } else {
                    message.error(res.message);
                }
            },
            onCancel() {
            },
        });
    };
    // 撤回
    const withdraw = () => {
        if (!selectedRows[0].allotSupplierState || selectedRows[0].allotSupplierState !== 'ALLOT_NOT') {
            message.warning('只能撤回未分配供应商的数据');
            return;
        }
        confirm({
            title: '是否撤回环保资料填报需求？',
            onOk: async () => {
                const res = await epWithdraw({
                    id: selectedRowKeys[0],
                });
                if (res.statusCode === 200) {
                    refresh();
                    message.success('操作成功');
                } else {
                    message.error(res.message);
                }
            },
            onCancel() {
            },
        });
    };

    // 处理快速查询
    function handleQuickSearch(value) {
        setSearchValue(v => ({ ...v, quickSearchValue: value }));
        refresh();
        // uploadTable()
    }

    // 处理高级搜索
    function handleAdvnacedSearch(value) {
        value.materialCode = value.materialCode_name;
        value.materialGroupCode = value.materialGroupCode_name;
        value.strategicPurchaseCode = value.strategicPurchaseCode_name;
        delete value.materialCode_name;
        delete value.materialGroupCode_name;
        delete value.strategicPurchaseCode_name;
        delete value.effectiveStatus_name;
        delete value.syncStatus_name;
        delete value.assignSupplierStatus_name;
        delete value.allotSupplierState_name;
        setSearchValue(v => ({ ...v, ...value }));
        headerRef.current.hide();
        refresh();
    }

    // 指派战略采购
    function maintainSeleteChange() {
        validateFields((err, values) => {
            if (!err) {
                const { strategicPurchaseId, strategicPurchaseName, strategicPurchaseCode } = values;
                allotStrategicPurchase({
                    demandIds: selectedRowKeys.join(),
                    strategicPurchaseId,
                    strategicPurchaseName,
                    strategicPurchaseCode,
                }).then(res => {
                    if (res.success) {
                        refresh();
                        message.success('操作成功');
                    } else {
                        message.error(res.message);
                    }
                });
                setAssignPurchase(false);
            }
        });
    }

    // 维护环保管理人员
    function handleManagerSelect() {
        validateFields((err, values) => {
            if (!err) {
                const { environmentAdminAccount, environmentAdminId, environmentAdminName } = values;
                let params = { ...selectedRows[0], environmentAdminAccount, environmentAdminId, environmentAdminName };
                editEpDemand(params).then(res => {
                    if (res.success) {
                        refresh();
                        message.success('操作成功');
                    } else {
                        message.error(res.message);
                    }
                });
                setMaintainModal(false);
            }
        });
    }
    // 编辑弹框处理
    function handleTableTada(type, obj) {
        let params = { ...selectedRows[0], ...obj };
        editEpDemand(params).then(res => {
            console.log(res);
            if (res.statusCode === 200) {
                refresh();
                message.success('编辑成功');
            } else {
                message.error(res.message);
            }
        });
    }
    // 同步pdm
    async function handleSyncPdm() {
        const res = await syncPdm({ id: selectedRowKeys[0] });
        if (res.statusCode === 200) {
            message.success('同步成功');
            refresh();
        } else {
            message.error(res.message);
        }
    }

    // 按钮是否禁用
    function buttonCheck(rows) {
        if (rows.length === 1) {
            setButtonStatus({
                detail: false,
                sync: false,
                delete: !(rows[0].effectiveStatus === 'DRAFT' && rows[0].sourceName === 'SRM'),
                submit: rows[0].effectiveStatus === 'EFFECT',
                withdraw: !(rows[0].effectiveStatus === 'EFFECT' && rows[0].allotSupplierState === 'ALLOT_NOT'),
                distribute: !(rows[0].applyPersonAccount === getUserAccount() && rows[0].effectiveStatus === 'EFFECT'),
                edit: !(rows[0].effectiveStatus === 'DRAFT' && rows[0].allotSupplierState === 'ALLOT_NOT'),
            });
        } else if (rows.length === 0) {
            setButtonStatus({
                detail: true,
                delete: true,
                edit: true,
                frozen: true,
                maint: true,
                detail: true,
                submit: true,
                withdraw: true,
                distribute: true,
                assign: true,
                pdm: true,
                sync: true,
                check: true,
                generate: true,
            });
        } else {
            setButtonStatus({
                detail: true,
                edit: true,
                delete: (() => {
                    // 来源srm且均为草稿状态
                    return !rows.every(item => {
                        return (item.effectiveStatus === 'DRAFT' && item.sourceName === 'SRM')
                    });
                })(),
                withdraw: true,
                distribute: true,
                sync: true,
                pdm: true,
                check: true,
                assign: (() => {
                    // 物料组相同
                    let { materialGroupCode } = rows[0]
                    return !rows.every(item => {
                        return item.materialGroupCode === materialGroupCode;
                    });
                })(),
                submit: (() => {
                    // 状态均为草稿
                    return !rows.every(item => {
                        return item.effectiveStatus === 'DRAFT';
                    });
                })(),
            });
        }
    }
    function showSuplier(e, item) {
        e.stopPropagation();
        setSupplierModalType('view');
        setViewDemandNum(item.demandNumber)
        tableRef.current.manualSelectedRows();
        supplierRef.current.setVisible(true);
    }
    // 高级查询配置
    const formItems = [
        { title: '物料代码', key: 'materialCode', type: 'list', props: MaterialConfig },
        { title: '物料组', key: 'materialGroupCode', type: 'list', props: MaterialGroupConfig },
        { title: '战略采购', key: 'strategicPurchaseCode', type: 'list', props: StrategicPurchaseConfig },
        { title: '环保管理人员', key: 'environmentAdminName', props: { placeholder: '输入申请人查询' } },
        { title: '申请人', key: 'applyPersonName', props: { placeholder: '输入申请人查询' } },
        { title: '状态', key: 'effectiveStatus', type: 'list', props: statusProps },
        { title: '分配供应商状态', key: 'allotSupplierState', type: 'list', props: distributionProps },
        { title: '物料标记状态', key: 'assignSupplierStatus', type: 'list', props: materialStatus },
        { title: '同步PDM状态', key: 'syncStatus', type: 'list', props: PDMStatus },
    ];
    const columns = [
        {
            title: '状态', dataIndex: 'effectiveStatus', width: 80, render: (text) => {
                switch (text) {
                    case 'DRAFT':
                        return '草稿';
                    case 'EFFECT':
                        return '生效';
                    default:
                        return '';
                }
            },
        },
        {
            title: '分配供应商状态', dataIndex: 'allotSupplierState', width: 120, render: (text) => {
                switch (text) {
                    case 'ALLOT_END':
                        return '已分配';
                    case 'ALLOT_NOT':
                        return '未分配';
                    default:
                        return '';
                }
            },
        },
        {
            title: '物料标记状态', dataIndex: 'assignSupplierStatus', width: 160, render: (text) => {
                switch (text) {
                    case 'EXIST_CONFORM_SUPPLIER':
                        return '存在符合的供应商';
                    case 'DIS_EXIST_CONFORM_SUPPLIER':
                        return '不存在符合的供应商';
                    default:
                        return '';
                }
            },
        },
        {
            title: '同步PDM状态', dataIndex: 'syncStatus', width: 120, render: (text) => {
                switch (text) {
                    case 'SYNC_FAILURE': return '同步成功';
                    case 'SYNC_SUCCESS': return '同步失败';
                    default:
                        return '';
                }
            },
        },
        { title: '冻结', dataIndex: 'frozen', width: 70, render: (text) => text ? '已冻结' : '未冻结' },
        { title: '物料代码', dataIndex: 'materialCode', ellipsis: true },
        { title: '物料描述', dataIndex: 'materialName', ellipsis: true },
        { title: '物料组代码', dataIndex: 'materialGroupCode', ellipsis: true },
        { title: '物料组描述', dataIndex: 'materialGroupName', ellipsis: true },
        { title: '环保标准', dataIndex: 'environmentalProtectionName', ellipsis: true },
        { title: '战略采购代码', dataIndex: 'strategicPurchaseCode', ellipsis: true },
        { title: '战略采购名称', dataIndex: 'strategicPurchaseName', ellipsis: true },
        { title: '供应商', dataIndex: 'list', ellipsis: true, render: (text, item) => <span onClick={(e) => { showSuplier(e, item) }} style={{color: 'blue', cursor: 'pointer'}}>查看</span> },
        { title: '环保管理人员', dataIndex: 'environmentAdminName', ellipsis: true },
        { title: '创建人', dataIndex: 'applyPersonName', ellipsis: true },
        { title: '创建人联系方式', dataIndex: 'applyPersonPhone', ellipsis: true },
        { title: '申请日期', dataIndex: 'applyDate', ellipsis: true, render: (text) => text ? text.slice(0, 10) : '' },
        { title: '来源', dataIndex: 'sourceName', ellipsis: true },
        { dataIndex: 'name14', width: 20, ellipsis: true },
    ].map(item => ({ ...item, align: 'center' }));
    const headerLeft = <>
        {
            authAction(<Button
                type='primary'
                onClick={() => {
                    redirectToPage('add');
                }}
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                key='QUALITYSYNERGY_MATERIAL_ADD'
            >新增</Button>)
        }
        {
            authAction(<Button
                className={styles.btn}
                disabled={buttonStatus.edit}
                onClick={() => { editRef.current.showModal('edit'); }}
                ignore={DEVELOPER_ENV}
                key='QUALITYSYNERGY_MATERIAL_EDIT'
            >编辑</Button>)
        }
        {
            authAction(<Button
                className={styles.btn}
                disabled={buttonStatus.delete}
                onClick={() => { handleDelete(); }}
                key='QUALITYSYNERGY_MATERIAL_DELETE'
                ignore={DEVELOPER_ENV}
            >删除</Button>)
        }
        {
            authAction(<Button
                className={styles.btn}
                disabled={buttonStatus.frozen}
                onClick={handleFreeze}
                ignore={DEVELOPER_ENV}
                key='QUALITYSYNERGY_MATERIAL_FROZEN'
            >冻结</Button>)
        }
        {
            authAction(<Button
                className={styles.btn}
                disabled={buttonStatus.maint}
                onClick={() => { setMaintainModal(true); }}
                key='QUALITYSYNERGY_MATERIAL_PERSON'
                ignore={DEVELOPER_ENV}
            >维护环保管理人员</Button>)
        }
        {
            authAction(<Button
                className={styles.btn}
                onClick={() => { redirectToPage('detail'); }}
                ignore={DEVELOPER_ENV}
                disabled={buttonStatus.detail}
                key='QUALITYSYNERGY_MATERIAL_DETAIL'
            >明细</Button>)
        }
        {
            authAction(<Button
                className={styles.btn}
                disabled={buttonStatus.submit}
                onClick={submit}
                key='QUALITYSYNERGY_MATERIAL_SUBMIT'
                ignore={DEVELOPER_ENV}
            >提交</Button>)
        }
        {
            authAction(<Button
                className={styles.btn}
                disabled={buttonStatus.withdraw}
                onClick={withdraw}
                ignore={DEVELOPER_ENV}
                key='QUALITYSYNERGY_MATERIAL_TITHDRAW'
            >撤回</Button>)
        }
        {
            authAction(<Button
                className={styles.btn}
                disabled={buttonStatus.distribute}
                onClick={() => { setSupplierModalType('distribute'); supplierRef.current.setVisible(true); }}
                key='QUALITYSYNERGY_MATERIAL_SUPPLIER'
                ignore={DEVELOPER_ENV}
            >分配供应商</Button>)
        }
        {
            authAction(<Button
                className={styles.btn}
                disabled={false}
                onClick={() => { setAssignPurchase(true); }}
                disabled={buttonStatus.assign}
                ignore={DEVELOPER_ENV}
                key='QUALITYSYNERGY_MATERIAL_DESIGN'
            >指派战略采购</Button>)
        }
        {
            authAction(<Button
                className={styles.btn}
                disabled={buttonStatus.pdm}
                onClick={() => {
                    handleSyncPdm();
                }}
                key='QUALITYSYNERGY_MATERIAL_PDM'
                ignore={DEVELOPER_ENV}
            >同步PDM</Button>)
        }
        {
            authAction(<Button
                className={styles.btn}
                disabled={buttonStatus.sync}
                onClick={() => {
                    checkOneSelect() && historyRef.current.setVisible(true);
                }}
                ignore={DEVELOPER_ENV}
                key='QUALITYSYNERGY_MATERIAL_HISTORY'
            >同步历史</Button>)
        }
        {
            authAction(<Button
                className={styles.btn}
                disabled={buttonStatus.check}
                onClick={() => { setCheckModalType('check'); samplingRef.current.setVisible(true); }}
                key='QUALITYSYNERGY_MATERIAL_RECHECK'
                ignore={DEVELOPER_ENV}
            >抽检复核</Button>)
        }
        {
            authAction(<Button
                className={styles.btn}
                disabled={buttonStatus.generate}
                onClick={() => {
                    setCheckModalType('generate');
                    // generateRef.current.setVisible(true);
                    samplingRef.current.setVisible(true);
                }}
                ignore={DEVELOPER_ENV}
                key='QUALITYSYNERGY_MATERIAL_GENERATE'
            >生成报表</Button>)
        }
        {
            authAction(<DataExport.Button
                className={styles.btn}
                // onClick={handleExport}
                requestParams={requestParams}
                explainResponse={explainResponse}
                key='QUALITYSYNERGY_MATERIAL_EXPORT'
                ignore={DEVELOPER_ENV}
            >导出</DataExport.Button>)
        }
        {
            authAction(<Button
                className={styles.btn}
                onClick={() => {
                    checkRef.current.showModal();
                }}
                ignore={DEVELOPER_ENV}
                key='QUALITYSYNERGY_MATERIAL_VIEW'
            >查看供应商资质</Button>)
        }
    </>;
    const headerRight = <>
        <Search
            placeholder='请输入物料代码和物料组代码查询'
            className={styles.btn}
            onSearch={handleQuickSearch}
            allowClear
        />
    </>;
    return <Fragment>
        <Header
            left={headerLeft}
            right={headerRight}
            ref={headerRef}
            content={
                <AdvancedForm formItems={formItems} onOk={handleAdvnacedSearch} />
            }
            advanced
        />
        <AutoSizeLayout>
            {
                (h) => <ExtTable
                    columns={columns}
                    bordered
                    height={h}
                    allowCancelSelect
                    showSearch={false}
                    remotePaging={true}
                    checkbox={{ multiSelect: false }}
                    ref={tableRef}
                    rowKey={(item) => item.id}
                    checkbox={true}
                    size='small'
                    onSelectRow={(rowKeys, rows) => {
                        setRowKeys(rowKeys);
                        setRows(rows);
                        buttonCheck(rows);
                    }}
                    selectedRowKeys={selectedRowKeys}
                    store={{
                        url: `${recommendUrl}/api/epDemandService/findByPages`,
                        params: {
                            ...searchValue,
                            quickSearchProperties: [],
                        },
                        type: 'POST',
                    }}
                />
            }
        </AutoSizeLayout>
        {/* 编辑弹框 */}
        <EditModal
            wrappedComponentRef={editRef}
            initData={selectedRows[0]}
            handleTableTada={handleTableTada}
        />
        {/* 维护环保管理人员 */}
        {maintainModal && <ExtModal
            centered
            destroyOnClose
            onCancel={() => {
                setMaintainModal(false);
            }}
            onOk={handleManagerSelect}
            visible={maintainModal}
            title="维护环保管理人员"
        >
            <FormItem label='环保管理人员' {...formLayout}>
                {
                    getFieldDecorator('environmentAdminId', { initialValue: selectedRows[0] && selectedRows[0].environmentAdminId }),
                    getFieldDecorator('environmentAdminAccount', { initialValue: selectedRows[0] && selectedRows[0].environmentAdminAccount }),
                    getFieldDecorator('environmentAdminName', {
                        initialValue: selectedRows[0] && selectedRows[0].environmentAdminName,
                        rules: [{ required: true, message: '不能为空' }]
                    })(<ComboList
                        form={form}
                        style={{ width: '100%' }}
                        {...allPersonList}
                        name='environmentAdminName'
                        field={['environmentAdminId', 'environmentAdminAccount']}
                        cascadeParams={{ organizationId: OrgId }}
                    />)
                }

            </FormItem>
        </ExtModal>}
        {/* 指派战略采购 */}
        {assignPurchase && <ExtModal
            centered
            destroyOnClose
            onCancel={() => {
                setAssignPurchase(false);
            }}
            onOk={maintainSeleteChange}
            visible={assignPurchase}
            title="指派战略采购"
        >
            <FormItem label='战略采购' {...formLayout}>
                {
                    getFieldDecorator('strategicPurchaseId', { initialValue: selectedRows[0] && selectedRows[0].environmentAdminId }),
                    getFieldDecorator('strategicPurchaseName', { initialValue: selectedRows[0] && selectedRows[0].environmentAdminAccount }),
                    getFieldDecorator('strategicPurchaseCode', {
                        initialValue: selectedRows[0] && selectedRows[0].strategicPurchaseCode,
                        rules: [{ required: true, message: '不能为空' }]
                    })(<ComboList
                        form={form}
                        {...StrategicPurchaseConfig}
                        name='strategicPurchaseCode'
                        field={['strategicPurchaseId', 'strategicPurchaseName']}
                    />)
                }
            </FormItem>
        </ExtModal>}
        {/* 查看供应商资质 */}
        <CheckQualificationModal ref={checkRef} />
        {/* 分配供应商 */}
        <DistributeSupplierModal wrappedComponentRef={supplierRef} selectedRow={selectedRows[0]} supplierModalType={supplierModalType} viewDemandNum={viewDemandNum} />
        {/* 抽检复核 */}
        <CheckModal wrappedComponentRef={samplingRef} selectedRow={selectedRows[0]} checkModalType={checkModalType} />
        {/* 生成报表 */}
        {/* <GenerateModal wrappedComponentRef={generateRef} /> */}
        {/* 同步历史 */}
        <SyncHistory wrappedComponentRef={historyRef} id={selectedRowKeys[0]} />
    </Fragment>;
});
