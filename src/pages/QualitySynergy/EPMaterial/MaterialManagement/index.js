import React, { useState, useRef, useEffect, Fragment } from 'react';
import { Input, Button, message, Modal, Form } from 'antd';
import styles from './index.less';
import { openNewTab, getFrameElement } from '@/utils';
import { ExtTable, ComboList, ExtModal, utils, ToolBar, ScrollBar } from 'suid';
import { AutoSizeLayout, Header, AdvancedForm } from '@/components';
import { smBaseUrl } from '@/utils/commonUrl';
import { materialCode, statusProps, distributionProps, materialStatus, PDMStatus } from '../../commonProps';
import CheckQualificationModal from '../components/checkQualificationModal';
import DistributeSupplierModal from '../components/distributeSupplierModal';
import CheckModal from '../components/checkModal';
import GenerateModal from '../components/generateModal';
import EditModal from '../components/editModal'
const { authAction, storage } = utils;
const { Search } = Input;
const { confirm } = Modal;
const { create, Item: FormItem } = Form;
const DEVELOPER_ENV = process.env.NODE_ENV === 'development'
const formLayout = {
    labelCol: { span: 8, },
    wrapperCol: { span: 12, },
};
export default function () {
    const headerRef = useRef(null)
    const tableRef = useRef(null);
    const checkRef = useRef(null);
    const editRef = useRef(null);
    const supplierRef = useRef(null);
    const samplingRef = useRef(null);
    const generateRef = useRef(null);
    const [selectedRowKeys, setRowKeys] = useState([]);
    const [selectedRows, setRows] = useState([]);
    const [searchValue, setSearchValue] = useState({});
    const [maintainModal, setMaintainModal] = useState(false);//维护环保人员弹框
    const [assignPurchase, setSssignPurchase] = useState(false);//指派战略采购弹框
    const [qualificationModal, setQualificationModal] = useState(false);
    const FRAMELEEMENT = getFrameElement();
    // 未选中数据的状态
    const tableProps = {
        store: {
            url: `${smBaseUrl}/api/supplierFinanceViewModifyService/findByPage`,
            params: {
                ...searchValue,
                quickSearchProperties: ['supplierName', 'supplierCode'],
                sortOrders: [
                    {
                        property: 'docNumber',
                        direction: 'DESC'
                    }
                ]
            },
            type: 'POST'
        }
    }
    function redirectToPage(type) {
        const [key] = selectedRowKeys;
        const { id = '' } = FRAMELEEMENT;
        const { pathname } = window.location;
        switch (type) {
            case 'add':
                openNewTab(`qualitySynergy/EPMaterial/editForm?id=${key}&frameElementId=${id}&frameElementSrc=${pathname}`, '填报环保资料物料-新增', false)
                break;
            case 'detail':
                openNewTab(`qualitySynergy/EPMaterial/detailForm?id=${key}&frameElementId=${id}&frameElementSrc=${pathname}`, '填报环保资料物料-明细', false);
                break;
            default:
                break;
        }
    }
    // 删除
    function handleDelete(v) {
        confirm({
            title: '删除',
            content: '请确认是否冻结该填报环保资料物料',
            onOk: async () => {
                console.log('确定删除')
            }
        })
    }
    // 冻结
    const handleFreeze = () => {
        confirm({
            title: '请确认是否冻结该填报环保资料物料',
            onOk: () => {
                console.log('确认删除');
            },
        });
    }
    // 提交 
    const submit = () => {
        confirm({
            title: '是否提交环保资料填报需求？',
            onOk: () => {
                console.log('确认删除');
            },
            onCancel() { },
        });
    }
    // 撤回
    const withdraw = () => {
        confirm({
            title: '是否撤回环保资料填报需求？',
            onOk: () => {
                console.log('确认撤回');
            },
            onCancel() { },
        });
    }
    // 记录列表选中
    function handleSelectedRows(rowKeys, rows) {
        setRowKeys(rowKeys);
        setRows(rows);
    }
    // 处理快速查询
    function handleQuickSearch(v) {
        console.log(v)
        setSearchValue({
            quickSearchValue: v
        })
        // uploadTable()
    }
    // 处理高级搜索
    function handleAdvnacedSearch(v) {
        console.log('高级查询', v)
        // const keys = Object.keys(v);
    }
    // 环保管理人员选择
    function maintainSeleteChange(item) {

    }
    // 导出
    function handleExport() {
        console.log('导出')
    }
    // 高级查询配置
    const formItems = [
        { title: '物料代码', key: 'data1', type: 'list', props: materialCode },
        { title: '物料组', key: 'data2', type: 'list', props: materialCode },
        { title: '战略采购', key: 'data3', type: 'list', props: materialCode },
        { title: '环保管理人员', key: 'data4', props: { placeholder: '输入申请人查询' } },
        { title: '申请人', key: 'data5', props: { placeholder: '输入申请人查询' } },
        { title: '状态', key: 'data6', type: 'list', props: statusProps },
        { title: '分配供应商状态', key: 'data7', type: 'list', props: distributionProps },
        { title: '物料标记状态', key: 'data8', type: 'list', props: materialStatus },
        { title: '同步PDM状态', key: 'data9', type: 'list', props: PDMStatus },
    ]
    const columns = [
        {
            title: '状态', dataIndex: 'state', width: 80, render: (text) => {
                switch (text) {
                    case 'draft': return '生效';
                    case 'pre_publish': return '草稿';
                    case 'publish': return '撤回';
                    default: return ''
                }
            }
        },
        {
            title: '分配供应商状态', dataIndex: 'inquiryMethodName', width: 80, render: (text) => {
                switch (text) {
                    case 'draft': return '已分配';
                    case 'pre_publish': return '未分配';
                    default: return ''
                }
            }
        },
        { title: '来源', dataIndex: 'turnNumber', width: 70 },
        { title: '物料代码', dataIndex: 'name1', ellipsis: true, },
        { title: '物料描述', dataIndex: 'name2', ellipsis: true, },
        { title: '物料组代码', dataIndex: 'name3', ellipsis: true, },
        { title: '物料组描述', dataIndex: 'name4', ellipsis: true, },
        { title: '战略采购代码', dataIndex: 'name5', ellipsis: true, },
        { title: '战略采购名称', dataIndex: 'name6', ellipsis: true, },
        { title: '供应商', dataIndex: 'name7', ellipsis: true, },
        { title: '环保管理人员', dataIndex: 'name8', ellipsis: true, },
        { title: '申请人', dataIndex: 'name9', ellipsis: true, },
        { title: '申请人联系方式', dataIndex: 'name10', ellipsis: true, },
        { title: '申请人', dataIndex: 'name11', ellipsis: true, },
        { title: '申请日期', dataIndex: 'name12', ellipsis: true, },
        { title: '物料标记状态', dataIndex: 'name13', ellipsis: true, },
    ].map(item => ({ ...item, align: 'center' }));
    const headerLeft = <>
        {
            authAction(<Button
                type='primary'
                onClick={() => { redirectToPage('add') }}
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                key='PURCHASE_VIEW_CHANGE_CREATE'
            >新增</Button>)
        }
        {
            authAction(<Button
                className={styles.btn}
                disabled={false}
                onClick={() => { editRef.current.showModal('edit') }}
                ignore={DEVELOPER_ENV}
                key='PURCHASE_VIEW_CHANGE_EDITOR'
            >编辑</Button>)
        }
        {
            authAction(<Button
                className={styles.btn}
                disabled={false}
                onClick={handleDelete}
                key='PURCHASE_VIEW_CHANGE_REMOVE'
                ignore={DEVELOPER_ENV}
            >删除</Button>)
        }
        {
            authAction(<Button
                className={styles.btn}
                disabled={false}
                onClick={handleFreeze}
                ignore={DEVELOPER_ENV}
                key='PURCHASE_VIEW_CHANGE_DETAIL'
            >冻结</Button>)
        }
        {
            authAction(<Button
                className={styles.btn}
                disabled={false}
                onClick={() => { setMaintainModal(true) }}
                key='PURCHASE_VIEW_CHANGE_REMOVE'
                ignore={DEVELOPER_ENV}
            >维护环保管理冻结人员</Button>)
        }
        {
            authAction(<Button
                className={styles.btn}
                disabled={false}
                onClick={() => { redirectToPage('detail') }}
                ignore={DEVELOPER_ENV}
                key='PURCHASE_VIEW_CHANGE_DETAIL'
            >明细</Button>)
        }
        {
            authAction(<Button
                className={styles.btn}
                disabled={false}
                onClick={submit}
                key='PURCHASE_VIEW_CHANGE_REMOVE'
                ignore={DEVELOPER_ENV}
            >提交</Button>)
        }
        {
            authAction(<Button
                className={styles.btn}
                disabled={false}
                onClick={withdraw}
                ignore={DEVELOPER_ENV}
                key='PURCHASE_VIEW_CHANGE_DETAIL'
            >撤回</Button>)
        }
        {
            authAction(<Button
                className={styles.btn}
                disabled={false}
                onClick={()=>{supplierRef.current.setVisible(true)}}
                key='PURCHASE_VIEW_CHANGE_REMOVE'
                ignore={DEVELOPER_ENV}
            >分配供应商</Button>)
        }
        {
            authAction(<Button
                className={styles.btn}
                disabled={false}
                onClick={() => { setSssignPurchase(true) }}
                ignore={DEVELOPER_ENV}
                key='PURCHASE_VIEW_CHANGE_DETAIL'
            >指派战略采购</Button>)
        }
        {
            authAction(<Button
                className={styles.btn}
                disabled={false}
                onClick={()=>{console.log('同步PDM')}}
                key='PURCHASE_VIEW_CHANGE_REMOVE'
                ignore={DEVELOPER_ENV}
            >同步PDM</Button>)
        }
        {
            authAction(<Button
                className={styles.btn}
                disabled={false}
                onClick={()=>{console.log('同步历史')}}
                ignore={DEVELOPER_ENV}
                key='PURCHASE_VIEW_CHANGE_DETAIL'
            >同步历史</Button>)
        }
        {
            authAction(<Button
                className={styles.btn}
                disabled={false}
                onClick={()=>{samplingRef.current.setVisible(true)}}
                key='PURCHASE_VIEW_CHANGE_REMOVE'
                ignore={DEVELOPER_ENV}
            >抽检复核</Button>)
        }
        {
            authAction(<Button
                className={styles.btn}
                disabled={false}
                onClick={() => { generateRef.current.setVisible(true) }}
                ignore={DEVELOPER_ENV}
                key='PURCHASE_VIEW_CHANGE_DETAIL'
            >生成报表</Button>)
        }
        {
            authAction(<Button
                className={styles.btn}
                disabled={false}
                onClick={handleExport}
                key='PURCHASE_VIEW_CHANGE_REMOVE'
                ignore={DEVELOPER_ENV}
            >导出</Button>)
        }
        {
            authAction(<Button
                className={styles.btn}
                disabled={false}
                onClick={() => { checkRef.current.showModal() }}
                ignore={DEVELOPER_ENV}
                key='PURCHASE_VIEW_CHANGE_DETAIL'
            >查看供应商资质</Button>)
        }
    </>
    const headerRight = <>
        <Search
            placeholder='供应商代码或名称'
            className={styles.btn}
            onSearch={handleQuickSearch}
            allowClear
        />
    </>
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
                    remotePaging
                    checkbox={{ multiSelect: false }}
                    ref={tableRef}
                    rowKey={(item) => item.id}
                    size='small'
                    onSelectRow={handleSelectedRows}
                    selectedRowKeys={selectedRowKeys}
                    {...tableProps}
                />
            }
        </AutoSizeLayout>
        {/* 编辑弹框 */}
        <EditModal wrappedComponentRef={editRef} />
        {/* 维护环保管理人员 */}
        <ExtModal
            centered
            destroyOnClose
            onCancel={() => { setMaintainModal(false) }}
            onOk={() => { setMaintainModal(false) }}
            visible={maintainModal}
            title="维护环保管理人员"
        >
            <FormItem label='环保管理人员' {...formLayout}>
                <ComboList {...materialCode} name='supplierCode'
                    field={['supplierName', 'supplierId']}
                    afterSelect={maintainSeleteChange} />
            </FormItem>
        </ExtModal>
        {/* 指派战略采购 */}
        <ExtModal
            centered
            destroyOnClose
            onCancel={() => { setSssignPurchase(false) }}
            onOk={() => { setSssignPurchase(false) }}
            visible={assignPurchase}
            title="指派战略采购"
        >
            <FormItem label='战略采购' {...formLayout}>
                <ComboList {...materialCode} name='supplierCode'
                    field={['supplierName', 'supplierId']}
                    afterSelect={maintainSeleteChange} />
            </FormItem>
        </ExtModal>
        {/* 查看供应商资质 */}
        <CheckQualificationModal ref={checkRef} />
        {/* 分配供应商 */}
        <DistributeSupplierModal wrappedComponentRef={supplierRef} />
        {/* 抽检复核 */}
        <CheckModal wrappedComponentRef={samplingRef} />
        {/* 生成报表 */}
        <GenerateModal wrappedComponentRef={generateRef} />
    </Fragment>
}