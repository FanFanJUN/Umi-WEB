import { useEffect, useState, useRef, Fragment } from 'react'
import { ExtTable, ComboList, ExtModal, utils, ToolBar, ScrollBar } from 'suid';
import { Input, Button, message, Modal, Form } from 'antd';
import queryString from 'query-string';
import { supplierManagerBaseUrl, recommendUrl } from '@/utils/commonUrl';
import { openNewTab, getFrameElement, getUserName, getUserId, getUserAccount, closeCurrent } from '@/utils';
import classnames from 'classnames';
import { AutoSizeLayout, Header, AdvancedForm } from '@/components';
import Upload from '../../compoent/Upload';
import FillingHistory from '../components/fillingHistory'
import { findMaterialCode, MaterialConfig, StrategicPurchaseConfig, needToFillList, fillStatusList, allPersonList } from '../../commonProps';
import styles from './index.less'
import {
    epDemandSubmit,
    epDemandRecall,
    epDemandCopyAllList,
    uploadFile,
    supplierGetList,
    findMyselfData
} from '../../../../services/qualitySynergy';
const { authAction, storage } = utils;
const { create, Item: FormItem } = Form;
const { Search } = Input;
const { confirm } = Modal;
const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString();
export default create()(function ({ form }) {
    const headerRef = useRef(null)
    const tableRef = useRef(null);
    const historyRef = useRef(null);
    const [selectedRowKeys, setRowKeys] = useState([]);
    const [copyVisible, setCopyVisible] = useState(false);
    const [uploadVisible, setUploadVisible] = useState(false);
    const [selectedRows, setRows] = useState([]);
    const [searchValue, setSearchValue] = useState({});
    const [dataSource, setDataSource] = useState([]);
    const [materialObj, setMaterialObj] = useState({});
    const [ownerFiles, setOwnerFiles] = useState([]);
    const FRAMELEEMENT = getFrameElement();
    const {
        getFieldDecorator,
        validateFields
    } = form;
    useEffect(() => {
        supplierGetList({
            ...searchValue,
            quickSearchProperties: []
        }).then(res => {
            if (res.success && res.statusCode === 200) {
                setDataSource(res.data.rows)
            } else {
                message.error(res.message)
            }
        })
    }, [searchValue])
    // 高级查询配置
    const formItems = [
        { title: '物料代码', key: 'materialCode', type: 'list', props: MaterialConfig },
        { title: '战略采购', key: 'strategicPurchaseCode', type: 'list', props: StrategicPurchaseConfig },
        { title: '环保管理人员', key: 'environmentAdministratorName', props: { placeholder: '输入环保管理人员查询' } },
        { title: '是否需要填报', key: 'needToFill', type: 'list', props: needToFillList },
        { title: '填报状态', key: 'effectiveStatus', type: 'list', props: fillStatusList },
    ]
    // 页面跳转
    function redirectToPage(type) {
        if (selectedRowKeys.length === 0) {
            message.warning('请选择数据');
            return;
        }
        const [key] = selectedRowKeys;
        const { id = '' } = FRAMELEEMENT;
        const { pathname } = window.location;
        switch (type) {
            case 'add':
                openNewTab(`qualitySynergy/EPMaterial/suppliersFillForm?id=${key}&pageStatus=add`, '环保资料填报-新增', false)
                break;
            case 'detail':
                openNewTab(`qualitySynergy/EPMaterial/suppliersFillForm?id=${key}&pageStatus=detail`, '环保资料填报-明细', false);
                break;
            default:
                break;
        }
    }
    useEffect(() => {
        findMyselfData().then(res => {
            if (res.success && res.statusCode === 200) {
                if (res.data.length === 0) {
                    confirm({
                        title: '提示',
                        content: '您还未上传资质文件，请先上传文件！',
                        okText: '立即上传',
                        cancelText: '退出',
                        onOk: () => {
                            setUploadVisible(true);
                        },
                        onCancel: () => {
                            closeCurrent();
                        }
                    })
                } else {
                    // 暂时先上传一次
                    let ids = res.data[0].documentInfo;
                    setOwnerFiles(ids)
                }
            }
        })

        // 处理工作台过来-url携带参数
        let afterUrl = queryString.parse(window.location.search);
        setSearchValue(v => ({ ...v, ...afterUrl }));

        window.parent.frames.addEventListener('message', listenerParentClose, false);
        return () => window.parent.frames.removeEventListener('message', listenerParentClose, false);
    }, []);

    function listenerParentClose(event) {
        const { data = {} } = event;
        if (data.tabAction === 'close') {
            setSearchValue({})
            tableRef.current.remoteDataRefresh();
        }
    }
    const headerLeft = <>
        {
            authAction(<Button
                type='primary'
                className={styles.btn}
                disabled={selectedRows.length !== 1 || selectedRows[0].effectiveStatus === 'COMPLETED' || !selectedRows[0].needToFill }
                onClick={() => { redirectToPage('add') }}
                ignore={DEVELOPER_ENV}
                key='QUALITYSYNERGY_SUPPLIERFILL_FILL_NEW'
            >填报</Button>)
        }
        {
            authAction(<Button
                className={styles.btn}
                disabled={selectedRowKeys.length !== 1}
                onClick={() => { redirectToPage('detail') }}
                ignore={DEVELOPER_ENV}
                key='QUALITYSYNERGY_SUPPLIERFILL_DETAIL_NEW'
            >明细</Button>)
        }
        {
            authAction(<Button
                className={styles.btn}
                disabled={selectedRowKeys.length !== 1 || selectedRows[0].effectiveStatus === 'COMPLETED'}
                onClick={() => { handleButton('submit') }}
                key='QUALITYSYNERGY_SUPPLIERFILL_SUBMIT_NEW'
                ignore={DEVELOPER_ENV}
            >提交</Button>)
        }
        {
            authAction(<Button
                className={styles.btn}
                disabled={selectedRowKeys.length !== 1|| selectedRows[0].effectiveStatus !== 'COMPLETED'}
                onClick={() => { handleButton('withdraw') }}
                ignore={DEVELOPER_ENV}
                key='QUALITYSYNERGY_SUPPLIERFILL_WITHDEAW_NEW'
            >撤回</Button>)
        }
        {
            authAction(<Button
                className={styles.btn}
                disabled={!(selectedRowKeys.length > 0 && selectedRows.every(item=>(item.effectiveStatus!=='COMPLETED'&&item.needToFill)))}
                onClick={() => { setCopyVisible(true) }}
                key='QUALITYSYNERGY_SUPPLIERFILL_COPY_NEW'
                ignore={DEVELOPER_ENV}
            >复制</Button>)
        }
        {
            authAction(<Button
                className={styles.btn}
                disabled={selectedRowKeys.length !== 1}
                ignore={DEVELOPER_ENV}
                onClick={() => {
                    historyRef.current.setVisible(true);
                }}
                key='QUALITYSYNERGY_SUPPLIERFILL_HISTORY_NEW'
            >填报历史</Button>)
        }
        {
            authAction(<Button
                className={styles.btn}
                disabled={false}
                onClick={() => { setUploadVisible(true) }}
                key='QUALITYSYNERGY_SUPPLIERFILL_UPLOAD_NEW'
                ignore={DEVELOPER_ENV}
            >{ownerFiles.length > 0 ? '查看资质文件' : '上传资质文件'}</Button>)
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
        { title: '是否需要填报', dataIndex: 'needToFill', width: 110, render: (text) => text ? '是' : '否' },
        {
            title: '填报状态', dataIndex: 'effectiveStatus', width: 80, render: (text) => {
                switch (text) {
                    case 'NOTCOMPLETED': return '未填报';
                    case 'COMPLETED': return '已填报';
                    default: return '未填报'
                }
            }
        },
        {
            title: '预警', dataIndex: 'alarm', width: 70, render: (text) => <div className={classnames({
                [styles.circle]: true,
                [styles.red]: (text === 'A'),
                [styles.yellow]: (text === 'B'),
                [styles.green]: (text === 'C'),
            })}></div>
        },
        { title: '剩余有效(天数)', dataIndex: 'daysRemaining', ellipsis: true, width: 120 },
        { title: '有效开始日期', dataIndex: 'effectiveStartDate', ellipsis: true, render: (text) => text ? text.slice(0, 10) : '' },
        { title: '有效截止日期', dataIndex: 'effectiveEndDate', ellipsis: true, render: (text) => text ? text.slice(0, 10) : '' },
        { title: '物料代码', dataIndex: 'materialCode', ellipsis: true, },
        { title: '物料描述', dataIndex: 'materialName', ellipsis: true, },
        { title: '填报编号', dataIndex: 'fillNumber', ellipsis: true,  width: 160, render: (text, item)=>{
            return <a onClick={()=>{
                openNewTab(`qualitySynergy/EPMaterial/suppliersFillForm?id=${item.id}&pageStatus=detail`, '环保资料填报-明细', false);
            }}>{text}</a>
        }},
        { title: '填报截止日期', dataIndex: 'fillEndDate', ellipsis: true, render: (text) => text ? text.slice(0, 10) : '' },
        { title: '分配日期', dataIndex: 'distributionDate', ellipsis: true, render: (text) => text ? text.slice(0, 10) : '' },
        { title: '物料组', dataIndex: 'materialGroupCode', ellipsis: true, },
        { title: '物料组描述', dataIndex: 'materialGroupName', ellipsis: true, },
        { title: '战略采购名称', dataIndex: 'strategicPurchaseName', ellipsis: true, },
        { title: '环保管理人员', dataIndex: 'environmentAdministratorName', ellipsis: true, },
        { title: '创建人', dataIndex: 'applyPersonName', ellipsis: true },
        { title: '创建人联系方式', dataIndex: 'applyPersonPhone', ellipsis: true },
        { title: '供应商代码', dataIndex: 'supplierCode', ellipsis: true },
        { title: '供应商名称', dataIndex: 'supplierName', width: 200, ellipsis: true },
        { dataIndex: 'emputy', width: 20, ellipsis: true },
    ].map(item => ({ ...item, align: 'center' }));
    const handleButton = async (type) => {
        let res = {}, id = selectedRowKeys[0]
        switch (type) {
            case 'submit':
                res = await epDemandSubmit({ id });
                break;
            case 'withdraw':
                res = await epDemandRecall({ id });
                break;
            case 'copy':
                const { } = materialObj;
                res = await epDemandCopyAllList({ materialCode: materialObj.materialCode, ids: selectedRowKeys.join() });
                break;
            default:
                break;
        }
        if (res.statusCode === 200) {
            if(type === 'copy') {
                setCopyVisible(false);
            }
            refresh();
            message.success('操作成功');
        } else {
            message.error(res.message);
        }

    }
    // 快捷查询
    function handleQuickSearch(value) {
        setSearchValue(v => ({ ...v, quickSearchValue: value }));
        refresh();
    }
    // 清空选中/刷新表格数据
    const refresh = () => {
        tableRef.current.manualSelectedRows();
        tableRef.current.remoteDataRefresh();
    };
    // 处理高级搜索
    function handleAdvnacedSearch(value) {
        console.log(value)
        value.materialCode = value.materialCode_name;
        value.strategicPurchaseCode = value.strategicPurchaseCode_name;
        delete value.materialCode_name;
        delete value.materialGroupCode_name;
        delete value.strategicPurchaseCode_name;
        delete value.effectiveStatus_name;
        delete value.needToFill_name;
        setSearchValue(v => ({ ...v, ...value }));
        refresh();
        headerRef.current.hide();
    }
    // 记录列表选中
    function handleSelectedRows(rowKeys, rows) {
        setRowKeys(rowKeys);
        setRows(rows);
    }
    // 上传确认
    function handleUploadOk() {
        if (ownerFiles.length > 0) {
            setUploadVisible(false);
            return;
        }
        validateFields((error, values) => {
            const { files } = values;
            if (!error) {
                uploadFile({
                    aptitudeFileId: files ? files.join() : '',
                    fileIdList: files ? files : [],
                    supplierName: getUserName(),
                    supplierCode: getUserAccount(),
                    supplierId: getUserId()
                }).then(res => {
                    if (res.statusCode === 200) {
                        message.success('上传成功');
                        findMyselfData().then(res => {
                            if (res.success && res.statusCode === 200) {
                                let ids = res.data[0].documentInfo;
                                setOwnerFiles(ids)
                            }
                        })
                        setUploadVisible(false);
                    } else {
                        message.error(res.message)
                    }
                })
            }
        })

    }
    function handleUploadCancle() {
        if (ownerFiles.length === 0) {
            closeCurrent();
        } else {
            setUploadVisible(false);
        }
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
                    checkbox={{ multiSelect: true }}
                    ref={tableRef}
                    rowKey={(item) => item.id}
                    showSearch={false}
                    onSelectRow={handleSelectedRows}
                    selectedRowKeys={selectedRowKeys}
                    // dataSource={dataSource}
                    store={{
                        url: `${recommendUrl}/api/epDataFillService/findByPage`,
                        params: {
                            ...searchValue,
                            quickSearchProperties: [],
                        },
                        type: 'POST',
                    }}
                />
            }
        </AutoSizeLayout>
        {/* 复制 */}
        {copyVisible && <ExtModal
            centered
            destroyOnClose
            maskClosable={false}
            onCancel={() => { setCopyVisible(false) }}
            onOk={() => { handleButton('copy') }}
            visible={copyVisible}
            title="复制已填报物料的环保资料"
        >
            <FormItem label='从物料复制' labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
                <ComboList
                    {...findMaterialCode}
                    style={{ width: '100%' }}
                    name='supplierCode'
                    afterSelect={(item) => {
                        const {materialCode, materialName} = item
                        setMaterialObj({materialCode, materialName})
                    }} />
            </FormItem>
        </ExtModal>}
        {/* 上传资质文件 */}
        {uploadVisible && <ExtModal
            centered
            destroyOnClose
            maskClosable={false}
            onCancel={() => { handleUploadCancle() }}
            onOk={() => { handleUploadOk() }}
            cancelText={ownerFiles.length === 0 ? '退出' : '取消'}
            visible={uploadVisible}
            title="上传资质文件"
        >
            <FormItem label='不使用禁用物质的声明' labelCol={{ span: 10 }} wrapperCol={{ span: 12 }}>
                {
                    getFieldDecorator('files', {
                        rules: [{ required: true, message: '请上传文件' }]
                    })(<Upload entityId={ownerFiles} type={ownerFiles.length > 0 ? 'show' : ''} />)
                }
            </FormItem>
        </ExtModal>}
        {/* 填报历史 */}
        <FillingHistory wrappedComponentRef={historyRef} materialCode={selectedRows[0]&&selectedRows[0].materialCode} />
    </Fragment>
})
