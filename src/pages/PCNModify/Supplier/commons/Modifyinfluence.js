import React, { forwardRef, useState, useRef, useEffect, useImperativeHandle } from 'react';
import { ExtTable, WorkFlow, ExtModal, utils, ToolBar, AuthButton } from 'suid';
import { Form, Button, message, Radio, Modal ,Input} from 'antd';
import { openNewTab, getFrameElement, isEmpty } from '@/utils';
import Header from '@/components/Header';
import ModifyForm from './ModifyForm';
import AutoSizeLayout from '../../../../components/AutoSizeLayout';
import styles from '../index.less';
import InfluenceMaterielModal from './InfluenceMaterielModal'
import MaterielModal from './MaterielModal'
import SeeMaterielModal from './SeeMaterielModal'
import UploadFile from '../../../../components/Upload/index'
const DEVELOPER_ENV = process.env.NODE_ENV === 'development'
const { create } = Form;
const FormItem = Form.Item;
const { TextArea } = Input;
const { authAction, storage } = utils;
let keys = 1;
let lineCode = 1;
const ModifyinfluenceRef = forwardRef(({
    form,
    isView,
    editData = [],
    headerInfo
}, ref) => {
    useImperativeHandle(ref, () => ({
        getbankform,
        setHeaderFields,
        form
    }));
    const { getFieldDecorator, setFieldsValue, validateFieldsAndScroll } = form;
    const tabformRef = useRef(null)
    const getModelRef = useRef(null)
    const getMatermodRef = useRef(null)
    const getSeeMaterRef = useRef(null)
    const [dataSource, setDataSource] = useState([]);
    const [selectRowKeys, setRowKeys] = useState([]);
    const [selectedRows, setRows] = useState([]);
    const [visible, setVisible] = useState(false);
    const [edit, setEdit] = useState(false);
    const [initialValue, setInitialValue] = useState({});
    const [modalType, setModalType] = useState('add');
    const [showAttach, triggerShowAttach] = useState(false);
    const [loading, triggerLoading] = useState(false);
    const [attachId, setAttachId] = useState('')

    let Modeltitle = '新增';
    useEffect(() => {

    }, [])
    const formLayout = {
        labelCol: {
            span: 6,
        },
        wrapperCol: {
            span: 12,
        }
    };
    const columns = [
        {
            title: '原厂代码',
            dataIndex: 'lineCode',
            align: 'center',
            width: 80
        },
        {
            title: '原厂名称',
            dataIndex: 'countryName',
            align: 'center',
            width: 220,
        },
        {
            title: '物料分类',
            dataIndex: 'provinceName',
            align: 'center',
            width: 220,
        },
        {
            title: '公司代码',
            align: 'center',
            dataIndex: 'regionName',
            width: 220,
        },
        {
            title: '公司名称',
            align: 'center',
            dataIndex: 'bankCode',
            width: 220,
        },
        {
            title: '采购组织代码',
            dataIndex: 'openingPermitId',
            align: 'center',
            width: 90,
        },
        {
            title: '采购组织名称',
            dataIndex: 'openingPermitId',
            align: 'center',
            width: 90,
        },
        {
            title: '是否安规件',
            dataIndex: 'openingPermitId',
            align: 'center',
            width: 90,
        },
        {
            title: '战略采购',
            dataIndex: 'openingPermitId',
            align: 'center',
            width: 90,
        }
    ].map(_ => ({ ..._, align: 'center' }))
    const empty = selectRowKeys.length === 0;

    // 记录列表选中
    function handleSelectedRows(rowKeys, rows) {
        setRowKeys(rowKeys);
        setRows(rows);;

    }
    // 清除选中项
    function cleanSelectedRecord() {
        setRowKeys([]);
        setRows([]);
    }
    // 物料新增
    function showModal() {
        getModelRef.current.handleModalVisible(true);
    }
    // 选择物料
    function showMateriel() {
        getMatermodRef.current.handleModalVisible(true);
    }
    // 查看物料
    function showSeeMateriel() {
        getSeeMaterRef.current.handleModalVisible(true);
    }
    // 清空列选择并刷新
    function uploadTable() {
        cleanSelectedRecord()
        //tableRef.current.remoteDataRefresh()
    }
    // 取消编辑或新增
    function handleCancel() {
        //const { resetFields } = commonFormRef.current.form;
        //resetFields()
        setVisible(false)
        uploadTable()
    }
    // 新增或编辑保存
    function handleSubmit(val) {
        dataSource.map((item, index) => {
            if (item.key === val.key) {
                const copyData = dataSource.slice(0)
                copyData[index] = val;
                setDataSource(copyData)
                setRows(copyData)
            }
        })
        hideModal()
        uploadTable()
    }
    // 关闭弹窗
    function hideModal() {
        setVisible(false)
        setInitialValue({})
    }
    function hideAttach() {
        setAttachId('')
        triggerShowAttach(false)
    }
    // 删除
    async function handleRemove() {
        const filterData = dataSource.filter(item => item.key !== selectedRows[0].key);
        setDataSource(filterData)
    }

    // 获取表单值
    function getbankform() {
        const bankInfo = tabformRef.current.data;
        if (!bankInfo || bankInfo.length === 0) {
            return false;
        }
        return bankInfo;
    }
    // 设置所有表格参数
    const setHeaderFields = (fields) => {
        //const { attachmentId = null, ...fs } = fields;
        // setAttachment(attachmentId)
        // setFieldsValue(fs)
    }
    const headerleft = (
        <>
            {
                <AuthButton type="primary" className={styles.btn} onClick={() => showModal()}>新增</AuthButton>
            }
            {
                <AuthButton className={styles.btn} disabled={empty} onClick={handleRemove}>删除</AuthButton>
            }
            {
                <AuthButton className={styles.btn} onClick={() => showMateriel()} disabled={empty} >选择物料</AuthButton>
            }
            {
                <AuthButton className={styles.btn} onClick={() => showSeeMateriel()} disabled={empty} >查看物料</AuthButton>
            }
        </>
    );
    return (
        <>
            <div>
                <Header style={{ display: headerInfo === true ? 'none' : 'block', color: 'red' }}
                    left={headerInfo ? '' : headerleft}
                    advanced={false}
                    extra={false}
                />
                <AutoSizeLayout>
                    {
                        (height) => <ExtTable
                            columns={columns}
                            showSearch={false}
                            ref={tabformRef}
                            rowKey={(item) => item.key}
                            checkbox={{
                                multiSelect: false
                            }}
                            allowCancelSelect={true}
                            size='small'
                            height={height}
                            Modeltitle={Modeltitle}
                            remotePaging={true}
                            ellipsis={false}
                            saveData={false}
                            onSelectRow={handleSelectedRows}
                            selectedRowKeys={selectRowKeys}
                            dataSource={dataSource}
                        //{...dataSource}
                        />
                    }
                </AutoSizeLayout>
                <div>
                    <InfluenceMaterielModal 
                        wrappedComponentRef={getModelRef}
                    >
                    </InfluenceMaterielModal> 
                    <MaterielModal 
                        wrappedComponentRef={getMatermodRef}>

                    </MaterielModal>
                    <SeeMaterielModal 
                        wrappedComponentRef={getSeeMaterRef}>
                    </SeeMaterielModal>
                </div>
            </div>
            <div>
                <Form>
                    <FormItem label='环保影响' {...formLayout}>
                        {
                            getFieldDecorator('remarkConfig', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择环保影响',
                                    },
                                ],
                                initialValue: true
                            })(
                                <Radio.Group disabled={isView === true}>
                                    <Radio value={true}>有影响</Radio>
                                    <Radio value={false}>无影响</Radio>
                                </Radio.Group>
                            )
                        }
                    </FormItem>
                    <FormItem label='安规影响' {...formLayout}>
                        {
                            getFieldDecorator('remarkConfig', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择安规影响',
                                    },
                                ],
                                initialValue: true
                            })(
                                <Radio.Group disabled={isView === true}>
                                    <Radio value={true}>有影响</Radio>
                                    <Radio value={false}>无影响</Radio>
                                </Radio.Group>
                            )
                        }
                    </FormItem>
                    <FormItem label='安全可靠性、电性能影响' {...formLayout}>
                        {
                            getFieldDecorator('remarkConfig', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择安全可靠性、电性能影响',
                                    },
                                ],
                                initialValue: true
                            })(
                                <Radio.Group disabled={isView === true}>
                                    <Radio value={true}>有影响</Radio>
                                    <Radio value={false}>无影响</Radio>
                                </Radio.Group>
                            )
                        }
                    </FormItem>
                    <FormItem label='其他物料或整机的影响' {...formLayout}>
                        {
                            getFieldDecorator('remarkConfig', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择其他物料或整机的影响',
                                    },
                                ],
                                initialValue: true
                            })(
                                <Radio.Group disabled={isView === true}>
                                    <Radio value={true}>有影响</Radio>
                                    <Radio value={false}>无影响</Radio>
                                </Radio.Group>
                            )
                        }
                    </FormItem>
                    <FormItem label='其他物料或整机的影响' {...formLayout}>
                        {
                            getFieldDecorator('remarkConfig', {
                                initialValue: ''
                            })(
                                <TextArea
                                    style={{
                                        width: "100%"
                                    }}
                                    placeholder="请输入其他物料或整机的影响"
                                    disabled={isView === true}
                                />
                            )
                        }
                    </FormItem>
                </Form>
            </div>
        </>

    )
}
)
const CommonForm = create()(ModifyinfluenceRef)

export default CommonForm