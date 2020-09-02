import { useEffect, useState, useRef, Fragment } from 'react'
import { ExtTable, ComboList, ExtModal, utils, ToolBar, ScrollBar } from 'suid';
import { Input, Button, message, Modal, Form } from 'antd';
import { smBaseUrl } from '@/utils/commonUrl';
import { AutoSizeLayout, Header, AdvancedForm, ComboAttachment } from '@/components';
import { materialCode, statusProps, distributionProps, materialStatus, PDMStatus } from '../../commonProps';
import styles from './index.less'
const { authAction, storage } = utils;
const { create, Item: FormItem } = Form;
const { Search } = Input;
const { confirm } = Modal;
const DEVELOPER_ENV = process.env.NODE_ENV === 'development'
const SupplierFillList = function (props) {
    const headerRef = useRef(null)
    const tableRef = useRef(null);
    const [selectedRowKeys, setRowKeys] = useState([]);
    const [copyVisible, setCopyVisible] = useState(false);
    const [uploadVisible, setUploadVisible] = useState(false);
    const [selectedRows, setRows] = useState([]);
    const [searchValue, setSearchValue] = useState({});
    const [attachment, setAttachment] = useState(null);
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
    const {
        getFieldDecorator,
        getFieldValue,
        setFieldsValue,
    } = props.form;
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
    const headerLeft = <>
        {
            authAction(<Button
                type='primary'
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                key='PURCHASE_VIEW_CHANGE_CREATE'
            >填报</Button>)
        }
        {
            authAction(<Button
                className={styles.btn}
                disabled={false}
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
            placeholder='供应商代码或名称'
            className={styles.btn}
            onSearch={handleQuickSearch}
            allowClear
        />
    </>
    const columns = [
        {
            title: '是否需要填报', dataIndex: 'zsda', width: 80, render: (text) => {
                return text ? '是' : '否'
            }
        },
        {
            title: '填报状态', dataIndex: 'df', width: 80, render: (text) => {
                switch (text) {
                    case 'draft': return '已填报';
                    case 'pre_publish': return '未填报';
                    default: return '未填报'
                }
            }
        },
        {
            title: '预警', dataIndex: 'turnNumber', width: 70, render: () => {
                return <div className={styles.circle}></div>
            }
        },
        { title: '剩余有效（天数）', dataIndex: 'name1', ellipsis: true, },
        { title: '有效开始日期', dataIndex: 'name2', ellipsis: true, },
        { title: '有效截止日期', dataIndex: 'name3', ellipsis: true, },
        { title: '物料代码', dataIndex: 'name4', ellipsis: true, },
        { title: '物料描述', dataIndex: 'name5', ellipsis: true, },
        { title: '填报截止日期', dataIndex: 'name6', ellipsis: true, },
        { title: '物料组', dataIndex: 'name7', ellipsis: true, },
        { title: '物料组描述', dataIndex: 'name8', ellipsis: true, },
        { title: '战略采购名称', dataIndex: 'name9', ellipsis: true, },
        { title: '环保管理人员', dataIndex: 'name10', ellipsis: true, },
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