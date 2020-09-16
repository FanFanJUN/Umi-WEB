import { useEffect, useState, useRef, Fragment } from 'react'
import { ExtTable, ComboList, ExtModal, utils, ToolBar, ScrollBar } from 'suid';
import { Input, Button, message, Modal, Form } from 'antd';
import { supplierManagerBaseUrl, recommendUrl } from '@/utils/commonUrl';
import { openNewTab, getFrameElement } from '@/utils';
import { AutoSizeLayout, Header, AdvancedForm, ComboAttachment } from '@/components';
import { materialCode, MaterialConfig, StrategicPurchaseConfig, distributionProps, materialStatus, PDMStatus } from '../../commonProps';
import styles from './index.less'
import {
    epDemandUpdate
} from '../../../../services/qualitySynergy';
const { authAction, storage } = utils;
const { create, Item: FormItem } = Form;
const { Search } = Input;
const { confirm } = Modal;
const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString();
const SupplierFillList = function (props) {
    const headerRef = useRef(null)
    const tableRef = useRef(null);
    const [selectedRowKeys, setRowKeys] = useState([]);
    const [copyVisible, setCopyVisible] = useState(false);
    const [uploadVisible, setUploadVisible] = useState(false);
    const [selectedRows, setRows] = useState([]);
    const [searchValue, setSearchValue] = useState({});
    const [attachment, setAttachment] = useState(null);
    const FRAMELEEMENT = getFrameElement();
    const {
        getFieldDecorator,
        getFieldValue,
        setFieldsValue,
    } = props.form;
    // 高级查询配置
    const formItems = [
        { title: '物料代码', key: 'data1', type: 'list', props: MaterialConfig },
        { title: '战略采购', key: 'data3', type: 'list', props: StrategicPurchaseConfig },
        { title: '环保管理人员', key: 'data4', props: { placeholder: '输入环保管理人员查询' } },
        { title: '是否需要填报', key: 'data7', type: 'list', props: distributionProps },
        { title: '填报状态', key: 'data8', type: 'list', props: materialStatus },
    ]
    // 页面跳转
    function redirectToPage(type) {
        if(selectedRowKeys.length === 0) {
            message.warning('请选择数据');
            return;
        }
        const [key] = selectedRowKeys;
        const { id = '' } = FRAMELEEMENT;
        const { pathname } = window.location;
        switch (type) {
            case 'add':
                openNewTab(`qualitySynergy/EPMaterial/suppliersFillForm?id=${key}&pageStatus=add&frameElementId=${id}&frameElementSrc=${pathname}`, '填报环保资料物料-新增', false)
                break;
            case 'detail':
                openNewTab(`qualitySynergy/EPMaterial/suppliersFillForm?id=${key}&pageStatus=detail&frameElementId=${id}&frameElementSrc=${pathname}`, '填报环保资料物料-明细', false);
                break;
            default:
                break;
        }
    }
    const headerLeft = <>
        {
            authAction(<Button
                type='primary'
                className={styles.btn}
                onClick={()=>{redirectToPage('add')}}
                ignore={DEVELOPER_ENV}
                key='PURCHASE_VIEW_CHANGE_CREATE'
            >填报</Button>)
        }
        {
            authAction(<Button
                className={styles.btn}
                disabled={false}
                onClick={()=>{redirectToPage('detail')}}
                ignore={DEVELOPER_ENV}
                key='PURCHASE_VIEW_CHANGE_EDITOR'
            >明细</Button>)
        }
        {
            authAction(<Button
                className={styles.btn}
                disabled={false}
                onClick={()=>{submit()}}
                key='PURCHASE_VIEW_CHANGE_REMOVE'
                ignore={DEVELOPER_ENV}
            >提交</Button>)
        }
        {
            authAction(<Button
                className={styles.btn}
                disabled={false}
                onClick={()=>{withdraw()}}
                ignore={DEVELOPER_ENV}
                key='PURCHASE_VIEW_CHANGE_DETAIL'
            >撤回</Button>)
        }
        {
            authAction(<Button
                className={styles.btn}
                disabled={false}
                onClick={() => { setCopyVisible(true) }}
                key='PURCHASE_VIEW_CHANGE_REMOVE'
                ignore={DEVELOPER_ENV}
            >复制</Button>)
        }
        {
            authAction(<Button
                className={styles.btn}
                disabled={false}
                ignore={DEVELOPER_ENV}
                key='PURCHASE_VIEW_CHANGE_DETAIL'
            >填报历史</Button>)
        }
        {
            authAction(<Button
                className={styles.btn}
                disabled={false}
                onClick={() => { setUploadVisible(true) }}
                key='PURCHASE_VIEW_CHANGE_REMOVE'
                ignore={DEVELOPER_ENV}
            >上传资质文件</Button>)
        }
    </>
    const headerRight = <>
        <Search
            placeholder='请输入物料代码或描述查询'
            className={styles.btn}
            onSearch={handleQuickSearch}
            allowClear
        />
    </>
    const columns = [
        { title: '是否需要填报', dataIndex: 'needToFill', width: 110, render: (text) => text ? '是' : '否'   },
        { title: '填报状态', dataIndex: 'effectiveStatus', width: 80, render: (text) => {
                switch (text) {
                    case 'draft': return '已填报';
                    case 'pre_publish': return '未填报';
                    default: return '未填报'
                }
            }
        },
        { title: '预警', dataIndex: 'alarm', width: 70, render: (text) => <div className={styles.circle}></div>},
        { title: '剩余有效(天数)', dataIndex: 'daysRemaining', ellipsis: true, width: 120 },
        { title: '有效开始日期', dataIndex: 'effectiveStartDate', ellipsis: true, },
        { title: '有效截止日期', dataIndex: 'effectiveEndDate', ellipsis: true, },
        { title: '物料代码', dataIndex: 'materialCode', ellipsis: true, },
        { title: '物料描述', dataIndex: 'materialName', ellipsis: true, },
        { title: '填报截止日期', dataIndex: 'fillEndDate', ellipsis: true, },
        { title: '物料组', dataIndex: 'materialGroupCode', ellipsis: true, },
        { title: '物料组描述', dataIndex: 'materialGroupName', ellipsis: true, },
        { title: '战略采购名称', dataIndex: 'strategicPurchaseName', ellipsis: true, },
        { title: '环保管理人员', dataIndex: 'environmentAdministratorName', ellipsis: true, },
    ].map(item => ({ ...item, align: 'center' }));
    // 提交 
    const submit = () => {
        confirm({
            title: '请确认是否提交环保资料填报数据',
            onOk: () => {
                console.log('确认删除');
            },
            onCancel() { },
        });
    }
    // 撤回
    const withdraw = () => {
        confirm({
            title: '是否撤回已提交的环保资料填报数据',
            onOk: () => {
                console.log('确认撤回');
            },
            onCancel() { },
        });
    }
    // 快捷查询
    function handleQuickSearch() {

    }
    // 处理高级搜索
    function handleAdvnacedSearch(v) {
        console.log('高级查询', v)
        // const keys = Object.keys(v);
    }
    // 记录列表选中
    function handleSelectedRows(rowKeys, rows) {
        setRowKeys(rowKeys);
        setRows(rows);
    }
    // 确定复制
    function handleCopyOk() {

    }
    // 上传确认
    function handleUploadOk() {

    }
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
                    remotePaging
                    checkbox={{ multiSelect: false }}
                    ref={tableRef}
                    rowKey={(item) => item.id}
                    size='small'
                    showSearch= {false}
                    onSelectRow={handleSelectedRows}
                    selectedRowKeys={selectedRowKeys}
                    store = {{
                        url: `${recommendUrl}/api/epDataFillService/findByPage`,
                        type: 'POST',
                        params: {
                            // ...searchValue,
                        },
                    }}
                />
            }
        </AutoSizeLayout>
        {/* 复制 */}
        <ExtModal
            centered
            destroyOnClose
            onCancel={() => { setCopyVisible(false) }}
            onOk={() => { handleCopyOk() }}
            visible={copyVisible}
            title="复制已填报物料的环保资料"
        >
            <FormItem label='从物料代码复制' labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
                <ComboList {...materialCode} name='supplierCode'
                    field={['supplierName', 'supplierId']}
                    afterSelect={() => { console.log('选中') }} />
            </FormItem>
        </ExtModal>
        {/* 上传资质文件 */}
        <ExtModal
            centered
            destroyOnClose
            onCancel={() => { setUploadVisible(false) }}
            onOk={() => { handleUploadOk() }}
            visible={uploadVisible}
            title="上传资质文件"
        >
            <FormItem label='不使用禁用物质的声明' labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
                {
                    getFieldDecorator('files', {
                        rules: [{ required: true, message: '请上传文件' }]
                    })(<ComboAttachment 
                        uploadButton={{ disabled: false }} 
                        allowDelete={false}
                        showViewType={true} 
                        customBatchDownloadFileName={true} 
                        attachment={attachment} />)
                }
            </FormItem>
        </ExtModal>
    </Fragment>
}

export default create()(SupplierFillList)